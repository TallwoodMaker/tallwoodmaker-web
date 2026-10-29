import "server-only";

/** Brand colors, same as the site tokens in globals.css. */
const CREAM = "#FAF9F5";
const INK = "#141413";
const BRAND = "#F2B705";
const MUTED = "#66635C";
const LINE = "#E4DFD0";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type EmailContent = {
  lang: string;
  greeting: string;
  paragraphs: string[];
  button?: { label: string; url: string };
  /** Small text link under the button (e.g. the English version). */
  secondaryLink?: { label: string; url: string };
  reply: string;
  signoff: string;
  signoffRole: string;
  footer: string;
  unsubscribeLabel: string;
  unsubscribeUrl: string;
};

/**
 * Simple, personal-looking email: cream background, white card, black text,
 * one yellow button. Table layout + inline styles for email clients.
 */
export function renderEmailHtml(c: EmailContent): string {
  const p = (text: string) =>
    `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${INK};">${escapeHtml(text)}</p>`;

  const button = c.button
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="background:${BRAND};border-radius:10px;">
        <a href="${escapeHtml(c.button.url)}" style="display:inline-block;padding:14px 22px;font-size:16px;font-weight:600;color:${INK};text-decoration:none;">${escapeHtml(c.button.label)}</a>
      </td></tr></table>`
    : "";

  const secondary = c.secondaryLink
    ? `<p style="margin:-12px 0 24px;font-size:14px;line-height:1.5;"><a href="${escapeHtml(c.secondaryLink.url)}" style="color:${MUTED};text-decoration:underline;">${escapeHtml(c.secondaryLink.label)}</a></p>`
    : "";

  return `<!doctype html>
<html lang="${c.lang}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:${CREAM};font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding:0 0 20px;">
          <span style="display:inline-block;width:36px;height:36px;line-height:36px;border-radius:8px;background:${INK};color:${BRAND};font-weight:700;font-size:15px;text-align:center;vertical-align:middle;">TW</span>
          <span style="margin-left:10px;font-weight:700;font-size:18px;color:${INK};vertical-align:middle;">TallWoodMaker</span>
        </td></tr>
        <tr><td style="background:#FFFFFF;border:1px solid ${LINE};border-radius:14px;padding:28px;">
          ${p(c.greeting)}
          ${c.paragraphs.map(p).join("\n          ")}
          ${button}
          ${secondary}
          ${p(c.reply)}
          <p style="margin:24px 0 0;font-size:16px;line-height:1.4;color:${INK};font-weight:600;">${escapeHtml(c.signoff)}</p>
          <p style="margin:2px 0 0;font-size:14px;line-height:1.4;color:${MUTED};">${escapeHtml(c.signoffRole)}</p>
        </td></tr>
        <tr><td style="padding:20px 4px 0;font-size:13px;line-height:1.5;color:${MUTED};">
          ${escapeHtml(c.footer)}<br>
          <a href="${escapeHtml(c.unsubscribeUrl)}" style="color:${MUTED};text-decoration:underline;">${escapeHtml(c.unsubscribeLabel)}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Plain-text alternative (better deliverability, text-only clients). */
export function renderEmailText(c: EmailContent): string {
  return [
    c.greeting,
    "",
    ...c.paragraphs.flatMap((t) => [t, ""]),
    ...(c.button ? [`${c.button.label}: ${c.button.url}`, ""] : []),
    ...(c.secondaryLink
      ? [`${c.secondaryLink.label}: ${c.secondaryLink.url}`, ""]
      : []),
    c.reply,
    "",
    c.signoff,
    c.signoffRole,
    "",
    "—",
    c.footer,
    `${c.unsubscribeLabel}: ${c.unsubscribeUrl}`,
  ].join("\n");
}
