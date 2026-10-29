import { type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { REF_COOKIE, REF_MAX_AGE, isRef } from "@/config/ref";

const intlMiddleware = createIntlMiddleware(routing);

// Search engines get the URL they asked for: no Accept-Language/cookie
// redirects, so /shop is always indexed as English and /de/shop as German.
const crawlerMiddleware = createIntlMiddleware({
  ...routing,
  localeDetection: false,
});

const CRAWLER_UA =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|pinterest|whatsapp|telegram|linkedin|google-inspectiontool|lighthouse/i;

/**
 * Two jobs on every page request:
 * 1. Refreshes the Supabase auth session cookie. Server Components can only
 *    read cookies, not write them, so without this the session would
 *    silently expire instead of refreshing.
 * 2. Resolves the locale (next-intl): rewrites unprefixed English URLs to
 *    /en/..., and redirects first-time visitors to their browser language.
 */
export async function proxy(request: NextRequest) {
  let refreshedCookies: {
    name: string;
    value: string;
    options: CookieOptions;
  }[] = [];
  let refreshHeaders: Record<string, string> = {};

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          // Updating request.cookies also rewrites the request's Cookie
          // header, which next-intl forwards to the page — so Server
          // Components see the refreshed token on this same request.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          refreshedCookies = cookiesToSet;
          refreshHeaders = headers;
        },
      },
    }
  );

  // Refreshes the token if expired; required for Server Components to see a
  // valid session.
  await supabase.auth.getUser();

  const isCrawler = CRAWLER_UA.test(request.headers.get("user-agent") ?? "");
  const response = (isCrawler ? crawlerMiddleware : intlMiddleware)(request);

  refreshedCookies.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options)
  );
  Object.entries(refreshHeaders).forEach(([key, value]) =>
    response.headers.set(key, value)
  );

  // ?ref=ig|tt|yt → remember the traffic source for 30 days so a later
  // lead form signup can be attributed to it (src/config/ref.ts).
  const ref = request.nextUrl.searchParams.get("ref");
  if (isRef(ref)) {
    response.cookies.set(REF_COOKIE, ref, {
      path: "/",
      maxAge: REF_MAX_AGE,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  // Everything except API routes (the Stripe webhook must never be
  // locale-rewritten), Next internals, Vercel internals and static files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
