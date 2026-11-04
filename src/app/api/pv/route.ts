import { LOCALES } from "@/i18n/routing";
import { isRef } from "@/config/ref";
import { isBot } from "@/lib/bots";
import { createAdminClient } from "@/lib/supabase/admin";

const OWN_HOSTS = /(^|\.)tallwoodmaker\.com$|^localhost$|^127\.0\.0\.1$/;
const SKIPPED_PATHS = /^\/(admin|auth|api)(\/|$)/;

function text(value: string | null, max = 200): string | null {
  const trimmed = (value ?? "").trim().slice(0, max);
  return trimmed || null;
}

/**
 * First-party page views from PageViewTracker. No cookies, no IP, no user
 * agent stored: only the page, whether it was the visit's landing page, and
 * the landing page's ref/UTM tags and referring host. Only production
 * traffic is recorded (TRACK_DEV_PAGEVIEWS=1 records local dev too).
 */
export async function POST(request: Request) {
  const done = new Response(null, { status: 204 });
  if (
    process.env.VERCEL_ENV !== "production" &&
    process.env.TRACK_DEV_PAGEVIEWS !== "1"
  ) {
    return done;
  }
  if (isBot(request.headers.get("user-agent"))) return done;

  let body: { p?: unknown; e?: unknown; s?: unknown; r?: unknown };
  try {
    body = JSON.parse(await request.text());
  } catch {
    return done;
  }

  const rawPath = typeof body.p === "string" ? body.p.slice(0, 300) : "";
  if (!rawPath.startsWith("/")) return done;
  const segments = rawPath.split("?")[0].split("/").filter(Boolean);
  const locale = (LOCALES as readonly string[]).includes(segments[0])
    ? segments.shift()!
    : "en";
  const path = `/${segments.join("/")}`;
  if (SKIPPED_PATHS.test(path)) return done;

  const isEntry = body.e === true;
  const params = new URLSearchParams(
    isEntry && typeof body.s === "string" ? body.s.slice(0, 1000) : ""
  );
  let referrerHost: string | null = null;
  if (isEntry && typeof body.r === "string" && body.r) {
    try {
      const host = new URL(body.r).hostname;
      if (!OWN_HOSTS.test(host)) referrerHost = host.slice(0, 200);
    } catch {}
  }
  const ref = params.get("ref");

  const { error } = await createAdminClient()
    .from("page_views")
    .insert({
      path,
      locale,
      is_entry: isEntry,
      ref: isRef(ref) ? ref : null,
      utm_source: text(params.get("utm_source")),
      utm_medium: text(params.get("utm_medium")),
      utm_campaign: text(params.get("utm_campaign")),
      referrer_host: referrerHost,
    });
  if (error) console.error("Failed to record page view:", error);
  return done;
}
