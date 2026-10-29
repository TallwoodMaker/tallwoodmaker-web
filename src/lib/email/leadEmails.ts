import "server-only";
import { Resend } from "resend";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { localizedUrl, SITE_URL } from "@/i18n/metadata";
import { LEAD_MAGNET } from "@/config/leadMagnet";
import { renderEmailHtml, renderEmailText } from "./template";

export const FROM = "Tom from TallWoodMaker <tom@tallwoodmaker.com>";
const REPLY_TO = "Tom from TallWoodMaker <tom@tallwoodmaker.com>";

let client: Resend | null = null;
function resend(): Resend {
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}

export type LeadForEmail = {
  email: string;
  source: string;
  locale: string | null;
  marketing_consent: boolean;
  unsubscribe_token: string;
};

/**
 * "welcome": sent right after signup (starter list or workshop waitlist).
 * "starter-ready": the follow-up from /admin/leads once the PDF exists.
 */
export type LeadEmailKind = "welcome" | "starter-ready";

/**
 * Sends one lead email in the visitor's language, with an unsubscribe link
 * and List-Unsubscribe (+ one-click POST) headers. Returns whether the
 * email included the starter list download, so the caller can set
 * starter_sent_at.
 */
export async function sendLeadEmail(
  lead: LeadForEmail,
  kind: LeadEmailKind
): Promise<{ ok: boolean; sentStarterList: boolean }> {
  const locale: Locale =
    lead.locale && hasLocale(routing.locales, lead.locale)
      ? lead.locale
      : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "email" });
  const token = encodeURIComponent(lead.unsubscribe_token);
  const unsubscribeUrl = `${localizedUrl(locale, "/unsubscribe")}?token=${token}`;
  const oneClickUrl = `${SITE_URL}/api/unsubscribe?token=${token}`;
  const listUrls = LEAD_MAGNET.starterListUrls;

  let subject: string;
  const paragraphs: string[] = [];
  let button: { label: string; url: string } | undefined;
  let secondaryLink: { label: string; url: string } | undefined;
  let sentStarterList = false;

  if (lead.source === "workshop-pricing") {
    subject = t("subjectWaitlist");
    paragraphs.push(t("waitlist"));
  } else if (listUrls) {
    subject =
      kind === "starter-ready" ? t("subjectStarterReady") : t("subjectStarter");
    paragraphs.push(
      kind === "starter-ready" ? t("starterReadyLater") : t("starterReady")
    );
    // The list in the language the visitor picked (stored as leads.locale),
    // plus the English original whenever that's a different language.
    button = { label: t("starterButton"), url: listUrls[locale] };
    if (locale !== "en") {
      secondaryLink = { label: "English version", url: listUrls.en };
    }
    sentStarterList = true;
  } else {
    subject = t("subjectStarter");
    paragraphs.push(t("starterPending"));
  }
  if (kind === "welcome" && lead.marketing_consent) {
    paragraphs.push(t("consentYes"));
  }

  const content = {
    lang: locale,
    greeting: t("greeting"),
    paragraphs,
    button,
    secondaryLink,
    reply: t("reply"),
    signoff: t("signoff"),
    signoffRole: t("signoffRole"),
    footer: t("footer"),
    unsubscribeLabel: t("unsubscribe"),
    unsubscribeUrl,
  };

  const { error } = await resend().emails.send({
    from: FROM,
    to: lead.email,
    replyTo: REPLY_TO,
    subject,
    html: renderEmailHtml(content),
    text: renderEmailText(content),
    headers: {
      "List-Unsubscribe": `<${oneClickUrl}>, <mailto:tom@tallwoodmaker.com?subject=unsubscribe>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    tags: [
      { name: "type", value: lead.source.replace(/[^a-zA-Z0-9_-]/g, "_") },
    ],
  });

  if (error) {
    console.error("Resend send failed:", error);
    return { ok: false, sentStarterList: false };
  }
  return { ok: true, sentStarterList };
}

/**
 * Mirrors a lead into Resend contacts: subscribed when they gave marketing
 * consent, unsubscribed when they opt out. Only called for consenting
 * leads and for unsubscribes — never for list-only signups.
 */
export async function syncResendContact(
  email: string,
  unsubscribed: boolean
): Promise<void> {
  const updated = await resend().contacts.update({ email, unsubscribed });
  if (!updated.error) {
    // Existing contact (maybe from an earlier signup): make sure it's in
    // the site's segment. Adding twice is harmless.
    if (!unsubscribed) {
      const segmentId = await siteSegmentId();
      if (segmentId) {
        await resend().contacts.segments.add({ email, segmentId });
      }
    }
    return;
  }
  if (unsubscribed) return; // nothing to mark if they were never a contact
  const segmentId = await siteSegmentId();
  const created = await resend().contacts.create({
    email,
    unsubscribed,
    segments: segmentId ? [{ id: segmentId }] : undefined,
  });
  if (created.error) {
    console.error("Resend contact sync failed:", created.error);
  }
}

/**
 * Contacts from tallwoodmaker.com live in their own Resend segment, separate
 * from "General" (used by MebCut on the same Resend account). Looked up by
 * name and created if missing; cached per server instance.
 */
const SITE_SEGMENT_NAME = "TallWoodMaker";
let segmentIdPromise: Promise<string | null> | null = null;

function siteSegmentId(): Promise<string | null> {
  segmentIdPromise ??= (async () => {
    const list = await resend().segments.list();
    const existing = list.data?.data.find((s) => s.name === SITE_SEGMENT_NAME);
    if (existing) return existing.id;
    const created = await resend().segments.create({ name: SITE_SEGMENT_NAME });
    if (created.error) {
      console.error("Resend segment create failed:", created.error);
      return null;
    }
    return created.data.id;
  })().catch((error) => {
    console.error("Resend segment lookup failed:", error);
    segmentIdPromise = null; // retry on the next call
    return null;
  });
  return segmentIdPromise;
}
