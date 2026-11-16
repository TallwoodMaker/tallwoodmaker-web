"use server";

import { after } from "next/server";
import { getTranslations } from "next-intl/server";
import { isRef } from "@/config/ref";
import { getFreeMagnetBySource, type FreeMagnet } from "@/config/freeMagnets";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncResendContact } from "@/lib/email/leadEmails";
import { sendFreePdfEmail } from "@/lib/email/freePdfEmail";

// Same loose check as src/lib/leads.ts: the inbox is the real test.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LEAD_COLUMNS =
  "id, email, marketing_consent, unsubscribe_token, offer_token, starter_sent_at";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/** A repeat request re-sends the PDF at most this often. */
const RESEND_INTERVAL_MS = 60 * 60 * 1000;

function optionalText(value: FormDataEntryValue | null, max: number) {
  const text = String(value ?? "").trim().slice(0, max);
  return text || null;
}

function thanksUrl(magnet: FreeMagnet, offerToken?: string) {
  const token = offerToken ? `&l=${encodeURIComponent(offerToken)}` : "";
  return `/free/thanks?t=${magnet.offer}${token}`;
}

export type FreeLeadState = {
  status: "idle" | "success" | "invalid" | "error";
  /** Where to go after a successful signup (the offer page). */
  next?: string;
  /** Lead source, for the Meta Pixel "Lead" event. */
  source?: string;
};

/**
 * Signup on an ad landing page (/free/...): saves the lead with the page's
 * source and path, the ?ref= and UTM tags from the URL, and the optional
 * newsletter consent (same checkbox and text as /start), then emails the
 * PDF. `ref` comes from a form field filled from the URL, not from a cookie,
 * so it is recorded without analytics consent.
 *
 * Signing up again with the same email creates no second row: it records a
 * newly ticked consent and re-sends the PDF, at most once an hour.
 */
export async function submitFreeLead(
  _prevState: FreeLeadState,
  formData: FormData
): Promise<FreeLeadState> {
  const magnet = getFreeMagnetBySource(String(formData.get("source") ?? ""));
  if (!magnet) return { status: "error" };

  // "company" is the hidden honeypot input: real visitors never see it.
  // Pretend it worked so bots don't retry.
  if (String(formData.get("company") ?? "") !== "") {
    return { status: "success", next: thanksUrl(magnet) };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return { status: "invalid" };
  }

  const marketingConsent = formData.get("marketingConsent") === "on";
  const ref = String(formData.get("ref") ?? "");
  const utm = Object.fromEntries(
    UTM_KEYS.map((key) => [key, optionalText(formData.get(key), 200)])
  );
  const consentFields = marketingConsent
    ? {
        marketing_consent: true,
        consent_at: new Date().toISOString(),
        // The checkbox text exactly as shown (these pages are English only).
        consent_text: (
          await getTranslations({ locale: "en", namespace: "leadForm" })
        )("consent"),
      }
    : {};

  const supabase = createAdminClient();
  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      email,
      source: magnet.source,
      path: magnet.path,
      locale: "en",
      ref: isRef(ref) ? ref : null,
      ...utm,
      ...consentFields,
    })
    .select(LEAD_COLUMNS)
    .single();

  if (error) {
    // 23505 = unique_violation on (email, source): asked for this PDF before.
    if (error.code !== "23505") {
      console.error("Failed to save free PDF lead:", error);
      return { status: "error" };
    }
    return repeatSignup(email, magnet, marketingConsent, consentFields);
  }

  // Email + contact sync run after the response, so the visitor isn't kept
  // waiting on Resend. starter_sent_at doubles as "PDF sent" for these rows
  // (it also starts the 12-month retention clock, src/lib/leadRetention.ts).
  after(async () => {
    if (await sendFreePdfEmail(lead, magnet)) {
      await supabase
        .from("leads")
        .update({ starter_sent_at: new Date().toISOString() })
        .eq("id", lead.id);
    }
    if (marketingConsent) await syncResendContact(email, false);
  });

  return {
    status: "success",
    next: thanksUrl(magnet, lead.offer_token),
    source: magnet.source,
  };
}

async function repeatSignup(
  email: string,
  magnet: FreeMagnet,
  marketingConsent: boolean,
  consentFields: Record<string, unknown>
): Promise<FreeLeadState> {
  const supabase = createAdminClient();

  if (marketingConsent) {
    const { error } = await supabase
      .from("leads")
      .update({ ...consentFields, unsubscribed_at: null })
      .eq("email", email)
      .eq("source", magnet.source);
    if (error) console.error("Failed to record consent:", error);
    else after(() => syncResendContact(email, false));
  }

  const { data: previous } = await supabase
    .from("leads")
    .select(LEAD_COLUMNS)
    .eq("email", email)
    .eq("source", magnet.source)
    .maybeSingle();
  if (!previous) return { status: "error" };

  // Claim the hour with a conditional update before sending, so two
  // parallel submits can't both get through.
  const cutoff = new Date(Date.now() - RESEND_INTERVAL_MS).toISOString();
  const { data: claimed, error: claimError } = await supabase
    .from("leads")
    .update({ starter_sent_at: new Date().toISOString() })
    .eq("id", previous.id)
    .or(`starter_sent_at.is.null,starter_sent_at.lt.${cutoff}`)
    .select(LEAD_COLUMNS)
    .maybeSingle();
  if (claimError) {
    console.error("Failed to claim free PDF resend:", claimError);
  } else if (claimed) {
    after(async () => {
      if (!(await sendFreePdfEmail(claimed, magnet))) {
        // Give the slot back so the next try can send it.
        await supabase
          .from("leads")
          .update({ starter_sent_at: previous.starter_sent_at })
          .eq("id", previous.id);
      }
    });
  }

  // No `source`: a repeat signup is not a new lead for the Pixel.
  return { status: "success", next: thanksUrl(magnet, previous.offer_token) };
}
