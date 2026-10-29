"use server";

import { after } from "next/server";
import { cookies } from "next/headers";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { REF_COOKIE, isRef } from "@/config/ref";
import { CONSENT_COOKIE_NAME } from "@/lib/consent";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendLeadEmail, syncResendContact } from "@/lib/email/leadEmails";

export type LeadSource = "starter-list" | "workshop-pricing";
export type LeadPath = "home" | "shop" | "general";

const SOURCES: LeadSource[] = ["starter-list", "workshop-pricing"];
const PATHS: LeadPath[] = ["home", "shop", "general"];

// Deliberately loose: one @, something on each side, a dot in the domain.
// Anything stricter rejects real addresses; the inbox is the real test.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LEAD_COLUMNS =
  "id, email, source, locale, marketing_consent, unsubscribe_token";

function hasAnalyticsConsent(raw: string | undefined): boolean {
  if (!raw) return false;
  try {
    return JSON.parse(decodeURIComponent(raw))?.analytics === true;
  } catch {
    return false;
  }
}

export type LeadState = {
  status: "idle" | "success" | "invalid" | "error";
};

/**
 * Saves an email to the `leads` table and sends the welcome email via
 * Resend. The starter list / waitlist confirmation goes to everyone; the
 * optional marketing checkbox is recorded (with timestamp and the exact
 * text shown) and only then is the address added to Resend contacts.
 *
 * Signing up again for the same list sends nothing new; ticking the
 * checkbox on a repeat signup records the new consent.
 */
export async function submitLead(
  _prevState: LeadState,
  formData: FormData
): Promise<LeadState> {
  // "company" is the hidden honeypot input in LeadForm: real visitors never
  // see it, bots fill every field. Pretend it worked so they don't retry.
  if (String(formData.get("company") ?? "") !== "") {
    return { status: "success" };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const source = String(formData.get("source") ?? "") as LeadSource;
  const path = String(formData.get("path") ?? "") as LeadPath;
  const rawPageLocale = String(formData.get("locale") ?? "");
  const pageLocale = hasLocale(routing.locales, rawPageLocale)
    ? rawPageLocale
    : routing.defaultLocale;
  // leads.locale = the language the starter list was requested in (the
  // form's language picker); other forms fall back to the page language.
  // The welcome email goes out in this language too.
  const rawListLocale = String(formData.get("listLocale") ?? "");
  const locale = hasLocale(routing.locales, rawListLocale)
    ? rawListLocale
    : pageLocale;
  const marketingConsent = formData.get("marketingConsent") === "on";
  const cookieStore = await cookies();
  const ref = hasAnalyticsConsent(cookieStore.get(CONSENT_COOKIE_NAME)?.value)
    ? cookieStore.get(REF_COOKIE)?.value
    : undefined;

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return { status: "invalid" };
  }
  if (!SOURCES.includes(source) || !PATHS.includes(path)) {
    return { status: "error" };
  }

  const consentFields = marketingConsent
    ? {
        marketing_consent: true,
        consent_at: new Date().toISOString(),
        // The checkbox text exactly as shown, i.e. in the page language.
        consent_text: (
          await getTranslations({ locale: pageLocale, namespace: "leadForm" })
        )("consent"),
      }
    : {};

  const supabase = createAdminClient();
  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      email,
      source,
      path,
      locale,
      ref: isRef(ref) ? ref : null,
      ...consentFields,
    })
    .select(LEAD_COLUMNS)
    .single();

  if (error) {
    // 23505 = unique_violation on (email, source): already on this list.
    if (error.code !== "23505") {
      console.error("Failed to save lead:", error);
      return { status: "error" };
    }
    if (marketingConsent) {
      const { error: updateError } = await supabase
        .from("leads")
        .update({ ...consentFields, unsubscribed_at: null })
        .eq("email", email)
        .eq("source", source);
      if (updateError) console.error("Failed to record consent:", updateError);
      else after(() => syncResendContact(email, false));
    }
    return { status: "success" };
  }

  // Email + contact sync run after the response, so the visitor isn't kept
  // waiting on Resend; a failed send leaves starter_sent_at empty, and the
  // admin "send to pending" button can retry later.
  after(async () => {
    const result = await sendLeadEmail(lead, "welcome");
    if (result.sentStarterList) {
      await supabase
        .from("leads")
        .update({ starter_sent_at: new Date().toISOString() })
        .eq("id", lead.id);
    }
    if (marketingConsent) await syncResendContact(email, false);
  });

  return { status: "success" };
}
