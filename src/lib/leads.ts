"use server";

import { cookies } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { REF_COOKIE, isRef } from "@/config/ref";

export type LeadSource = "starter-list" | "workshop-pricing";
export type LeadPath = "home" | "shop" | "general";

const SOURCES: LeadSource[] = ["starter-list", "workshop-pricing"];
const PATHS: LeadPath[] = ["home", "shop", "general"];

// Deliberately loose: one @, something on each side, a dot in the domain.
// Anything stricter rejects real addresses; the inbox is the real test.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LeadState = {
  status: "idle" | "success" | "invalid" | "error";
};

/**
 * Saves an email to the `leads` table (see supabase/migrations). Uses the
 * plain anon key on purpose: RLS lets anon insert and nothing else, so this
 * action can never read the list back. A duplicate (email, source) counts
 * as success — the visitor is already on that list.
 */
export async function submitLead(
  _prevState: LeadState,
  formData: FormData
): Promise<LeadState> {
  // "company" is the hidden honeypot input in LeadForm: real visitors never
  // see it, bots fill every field. Pretend it worked so they don't retry.
  if (String(formData.get("company") ?? "") !== "") {
    return { status: "success" };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const source = String(formData.get("source") ?? "") as LeadSource;
  const path = String(formData.get("path") ?? "") as LeadPath;
  const locale = String(formData.get("locale") ?? "");
  const ref = (await cookies()).get(REF_COOKIE)?.value;

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return { status: "invalid" };
  }
  if (!SOURCES.includes(source) || !PATHS.includes(path)) {
    return { status: "error" };
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { error } = await supabase.from("leads").insert({
    email,
    source,
    path,
    locale: hasLocale(routing.locales, locale) ? locale : null,
    ref: isRef(ref) ? ref : null,
  });

  // 23505 = unique_violation on (email, source): already signed up.
  if (error && error.code !== "23505") {
    console.error("Failed to save lead:", error);
    return { status: "error" };
  }

  return { status: "success" };
}
