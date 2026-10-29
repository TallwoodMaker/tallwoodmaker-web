"use server";

import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Only reachable via the confirm page's form submit (a real click), never on
 * plain page load — see src/app/auth/confirm/page.tsx for why. Email
 * link-scanners (Gmail/Google Safe Browsing, corporate mail gateways, etc.)
 * prefetch GET links to scan them, which burns a one-time OTP token before
 * the real user clicks it. Verification now only happens from this POST.
 */
export async function confirmSignIn(formData: FormData) {
  const token_hash = String(formData.get("token_hash") ?? "");
  const type = String(formData.get("type") ?? "") as EmailOtpType;
  const next = String(formData.get("next") ?? "/premium/subscribe");

  if (!token_hash || !type) {
    redirect(`${next}?error=link_expired`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash });

  if (error) {
    redirect(`${next}?error=link_expired`);
  }

  redirect(next);
}
