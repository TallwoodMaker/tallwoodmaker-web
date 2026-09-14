import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type PremiumContentType = "video" | "plan_download" | "announcement";

export type PremiumContent = {
  id: string;
  title: string;
  description: string | null;
  content_type: PremiumContentType;
  video_embed_url: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
};

/** All entries, draft and published, ordered for the admin list view. */
export async function listAllContent(): Promise<PremiumContent[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("premium_content")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Published-only entries, in display order, for the member-facing page. */
export async function listPublishedContent(): Promise<PremiumContent[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("premium_content")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export type PremiumContentInput = {
  title: string;
  description: string | null;
  content_type: PremiumContentType;
  video_embed_url: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  published: boolean;
};

export async function createContent(
  input: PremiumContentInput
): Promise<PremiumContent> {
  const supabase = createAdminClient();

  // New rows go to the end of the list by default.
  const { data: maxRow } = await supabase
    .from("premium_content")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (maxRow?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("premium_content")
    .insert({ ...input, sort_order: nextSortOrder })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateContent(
  id: string,
  input: PremiumContentInput
): Promise<PremiumContent> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("premium_content")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteContent(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("premium_content").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Swaps sort_order with the entry immediately before/after `id` in the
 * current ordering. Simple neighbor-swap reorder — no drag-and-drop.
 */
export async function moveContent(
  id: string,
  direction: "up" | "down"
): Promise<void> {
  const supabase = createAdminClient();
  const all = await listAllContent();
  const index = all.findIndex((row) => row.id === id);
  if (index === -1) return;

  const neighborIndex = direction === "up" ? index - 1 : index + 1;
  if (neighborIndex < 0 || neighborIndex >= all.length) return;

  const current = all[index];
  const neighbor = all[neighborIndex];

  const { error: err1 } = await supabase
    .from("premium_content")
    .update({ sort_order: neighbor.sort_order })
    .eq("id", current.id);
  const { error: err2 } = await supabase
    .from("premium_content")
    .update({ sort_order: current.sort_order })
    .eq("id", neighbor.id);

  if (err1) throw err1;
  if (err2) throw err2;
}
