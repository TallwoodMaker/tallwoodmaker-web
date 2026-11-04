import { after } from "next/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/i18n/metadata";
import { LEAD_MAGNET } from "@/config/leadMagnet";
import { isBot } from "@/lib/bots";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Starter list download link used in the welcome email:
 * /api/starter-list?l=<locale>&t=<lead's unsubscribe_token>.
 * Records the first download (time + PDF language) on that lead row, then
 * forwards to the PDF. Scanners and previews are forwarded but not counted;
 * an unknown or missing token still gets the file.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const rawLocale = params.get("l") ?? "";
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;
  const token = params.get("t");
  const target = LEAD_MAGNET.starterListUrls?.[locale] ?? SITE_URL;

  if (token && token.length <= 128 && !isBot(request.headers.get("user-agent"))) {
    after(async () => {
      const { error } = await createAdminClient()
        .from("leads")
        .update({
          starter_downloaded_at: new Date().toISOString(),
          starter_download_locale: locale,
        })
        .eq("unsubscribe_token", token)
        .eq("source", "starter-list")
        .is("starter_downloaded_at", null);
      if (error) console.error("Failed to record starter list download:", error);
    });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: target, "Cache-Control": "no-store" },
  });
}
