/**
 * Search engines, link previews and email security scanners (which open
 * every link in an email before the reader does). Used to keep them out of
 * locale redirects (src/proxy.ts), download tracking and page views.
 */
export const BOT_UA =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|pinterest|whatsapp|telegram|linkedin|google-inspectiontool|lighthouse|preview|scanner|safelinks|proofpoint|mimecast|barracuda|headless|python|curl|wget|go-http/i;

export function isBot(userAgent: string | null | undefined): boolean {
  return !userAgent || BOT_UA.test(userAgent);
}
