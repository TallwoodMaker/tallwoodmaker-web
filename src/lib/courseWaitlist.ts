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
 * Joining is a fresh request to be emailed about the course, so it also
 * lifts an earlier unsubscribe; the newsletter stays off unless the
 * optional checkbox is ticked.
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

    if (!marketingConsent) {
      // An earlier unsubscribe is lifted below for the course email only:
      // it must not bring newsletter consent back with it.
      const { error: resetError } = await supabase
        .from("leads")
        .update({ marketing_consent: false, consent_at: null, consent_text: null })
        .eq("email", email)
        .not("unsubscribed_at", "is", null);
      if (resetError) throw resetError;
    }
    const { error: updateError } = await supabase
      .from("leads")
      .update({ ...consentFields, unsubscribed_at: null })
      .eq("email", email);
    if (updateError) throw updateError;
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
