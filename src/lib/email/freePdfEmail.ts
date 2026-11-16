import "server-only";
import { Resend } from "resend";
import { getTranslations } from "next-intl/server";
import { localizedUrl, SITE_URL } from "@/i18n/metadata";
import { freePdfPath, type FreeMagnet } from "@/config/freeMagnets";
import { FROM } from "./leadEmails";
import { renderEmailHtml, renderEmailText } from "./template";

const REPLY_TO = "Tom from TallWoodMaker <tom@tallwoodmaker.com>";

let client: Resend | null = null;
function resend(): Resend {
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}

/**
 * The email behind the three ad landing pages (/free/...): the PDF link and
 * one question to reply to. Same template, sender, unsubscribe link and
 * List-Unsubscribe headers as the starter list email; English only.
 */
export async function sendFreePdfEmail(
  lead: {
    email: string;
    marketing_consent: boolean;
    unsubscribe_token: string;
  },
  magnet: FreeMagnet
): Promise<boolean> {
  const t = await getTranslations({ locale: "en", namespace: "email" });
  const token = encodeURIComponent(lead.unsubscribe_token);
  const unsubscribeUrl = `${localizedUrl("en", "/unsubscribe")}?token=${token}`;
  const oneClickUrl = `${SITE_URL}/api/unsubscribe?token=${token}`;

  const paragraphs = [`Here is your PDF: ${magnet.pdfTitle}.`];
  if (lead.marketing_consent) paragraphs.push(t("consentYes"));

  const content = {
    lang: "en",
    greeting: t("greeting"),
    paragraphs,
    button: {
      label: "Download the PDF",
      url: `${SITE_URL}${freePdfPath(magnet)}`,
    },
    // The question takes the place of the generic "Questions? Just reply".
    reply: magnet.emailQuestion,
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
    subject: `Your PDF: ${magnet.pdfTitle}`,
    html: renderEmailHtml(content),
    text: renderEmailText(content),
    headers: {
      "List-Unsubscribe": `<${oneClickUrl}>, <mailto:tom@tallwoodmaker.com?subject=unsubscribe>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    tags: [{ name: "type", value: magnet.source }],
  });

  if (error) {
    console.error("Resend send failed (free PDF):", error);
    return false;
  }
  return true;
}
