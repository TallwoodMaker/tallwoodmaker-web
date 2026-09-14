import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Landing point for the magic-link email. Supabase's email template must be
 * set to link here with a token_hash + type (see supabase/schema.sql /
 * project setup notes) rather than the default PKCE `code` param, since the
 * link is often opened on a different device/browser than the one that
 * requested it.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/premium/subscribe";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Preserve `next` so the error lands back on whichever page requested the
  // link (e.g. /admin/premium-content) rather than always /premium/subscribe
  // — this callback is shared by both magic-link sign-in flows.
  return NextResponse.redirect(`${origin}${next}?error=link_expired`);
}
