"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";
import { PLATFORMS, type Platform } from "@/config/social";

export type SocialFormState = {
  status: "idle" | "saved" | "error";
  message?: string;
};

const NUMBER_FIELDS = [
  "followers",
  "views",
  "saves",
  "comments",
  "profile_visits",
  "link_clicks",
] as const;

/**
 * Saves one week of numbers for one platform to social_stats. Entering the
 * same week + platform again overwrites it. Admin only (re-checked here,
 * since server actions are callable directly).
 */
export async function saveSocialStats(
  _prev: SocialFormState,
  formData: FormData
): Promise<SocialFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !isAdmin(user.email)) {
    return { status: "error", message: "Not authorized." };
  }

  const weekStart = String(formData.get("week_start") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
    return { status: "error", message: "Pick the week." };
  }
  const platform = String(formData.get("platform") ?? "") as Platform;
  if (!PLATFORMS.includes(platform)) {
    return { status: "error", message: "Pick a platform." };
  }

  const numbers: Record<string, number | null> = {};
  for (const field of NUMBER_FIELDS) {
    const raw = String(formData.get(field) ?? "").replace(/[\s,.]/g, "");
    if (raw === "") {
      numbers[field] = null;
      continue;
    }
    const value = Number(raw);
    if (!Number.isInteger(value) || value < 0 || value > 2_000_000_000) {
      return { status: "error", message: `"${field.replace("_", " ")}" must be a whole number.` };
    }
    numbers[field] = value;
  }
  const bestPost = String(formData.get("best_post_url") ?? "").trim().slice(0, 500);

  const { error } = await createAdminClient()
    .from("social_stats")
    .upsert(
      {
        week_start: weekStart,
        platform,
        ...numbers,
        best_post_url: bestPost || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "week_start,platform" }
    );
  if (error) {
    console.error("Failed to save social stats:", error);
    return { status: "error", message: "Couldn't save. Try again." };
  }
  return { status: "saved" };
}
