"use server";

import { after } from "next/server";
import { getTranslations } from "next-intl/server";
import { isRef } from "@/config/ref";
import { COURSE_WAITLIST_SOURCE } from "@/config/freeMagnets";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncResendContact } from "@/lib/email/leadEmails";

// Same loose check as src/lib/leads.ts: the inbox is the real test.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

function optionalText(value: FormDataEntryValue | null, max: number) {
  const text = String(value ?? "").trim().slice(0, max);
  return text || null;
}

export type CourseWaitlistState = {
  status: "idle" | "success" | "invalid" | "error";
  /** True when this email wasn't on the course waitlist before. */
  isNew?: boolean;
};

/**
 * /course waitlist ("Furniture Without a Big Shop").
 *
 * Someone already in `leads` (any source) gets course_waitlist = true on
 * every one of their rows and no new row, so the admin overview can show
 * which lead magnet the waitlist signup came from. Only an email that isn't
 * in `leads` yet gets a new row with source = 'course-waitlist'.
 *
 * Someone who unsubscribed earlier and joins now gets the flag but stays
 * unsubscribed (unsubscribed_at is kept), so nothing else, neither the
 * newsletter nor an email series nor the starter list, can reach them
 * again. Unsubscribing clears the flag (src/lib/unsubscribe.ts), so
 * course_waitlist = true always means "asked for course emails and hasn't
 * unsubscribed since": the course emails go to exactly those rows, without
 * looking at unsubscribed_at. Only ticking the optional newsletter checkbox
 * lifts the unsubscribe, as on every other form.
 */
export async function joinCourseWaitlist(
  _prevState: CourseWaitlistState,
  formData: FormData
): Promise<CourseWaitlistState> {
  // Honeypot, as in the other lead forms.
  if (String(formData.get("company") ?? "") !== "") {
    return { status: "success" };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return { status: "invalid" };
  }

  const marketingConsent = formData.get("marketingConsent") === "on";
  const now = new Date().toISOString();
  const consentFields = marketingConsent
    ? {
        marketing_consent: true,
        consent_at: now,
        // The checkbox text exactly as shown (the page is English only).
        consent_text: (
          await getTranslations({ locale: "en", namespace: "leadForm" })
        )("consent"),
      }
    : {};

  const supabase = createAdminClient();

  /** Flags every existing row of this email; returns what was there. */
  const flagExisting = async () => {
    const { data: rows, error } = await supabase
      .from("leads")
      .select("id, course_waitlist")
      .eq("email", email);
    if (error) throw error;
    if (!rows.length) return null;

    if (marketingConsent) {
      // A newly ticked newsletter checkbox is a new consent, so it also
      // lifts an earlier unsubscribe. Without it, unsubscribed_at stays.
      const { error: updateError } = await supabase
        .from("leads")
        .update({ ...consentFields, unsubscribed_at: null })
        .eq("email", email);
      if (updateError) throw updateError;
    }
    // Keeps the date of the first signup on rows that already had the flag.
    const { error: flagError } = await supabase
      .from("leads")
      .update({ course_waitlist: true, course_waitlist_at: now })
      .eq("email", email)
      .eq("course_waitlist", false);
    if (flagError) throw flagError;
    return { wasOnWaitlist: rows.some((row) => row.course_waitlist) };
  };

  try {
    let existing = await flagExisting();
    if (!existing) {
      const ref = String(formData.get("ref") ?? "");
      const utm = Object.fromEntries(
        UTM_KEYS.map((key) => [key, optionalText(formData.get(key), 200)])
      );
      const { error } = await supabase.from("leads").insert({
        email,
        source: COURSE_WAITLIST_SOURCE,
        path: "course",
        locale: "en",
        ref: isRef(ref) ? ref : null,
        course_waitlist: true,
        course_waitlist_at: now,
        ...utm,
        ...consentFields,
      });
      if (error) {
        // 23505: a parallel submit created the row first; flag that one.
        if (error.code !== "23505") throw error;
        existing = await flagExisting();
      }
    }

    if (marketingConsent) after(() => syncResendContact(email, false));
    return { status: "success", isNew: !existing?.wasOnWaitlist };
  } catch (error) {
    console.error("Failed to save course waitlist signup:", error);
    return { status: "error" };
  }
}
