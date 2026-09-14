"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";
import {
  createContent,
  updateContent,
  deleteContent,
  moveContent,
  type PremiumContentType,
  type PremiumContentInput,
} from "@/lib/premiumContent";

/**
 * Every action re-checks admin status server-side rather than trusting the
 * page guard — Server Actions are POST endpoints reachable directly, not
 * just through the rendered UI (see node_modules/next/dist/docs Server
 * Actions security guide).
 */
async function requireAdmin(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdmin(user?.email)) {
    throw new Error("Not authorized.");
  }
  return user!.email!;
}

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

export type AdminSignInState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

export async function sendAdminMagicLink(
  _prevState: AdminSignInState,
  formData: FormData
): Promise<AdminSignInState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { status: "error", message: "Enter a valid email address." };
  }

  const origin = await getOrigin();
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/admin/premium-content`,
    },
  });

  if (error) {
    return {
      status: "error",
      message: "Couldn't send the link. Please try again.",
    };
  }

  return { status: "sent", message: `Check ${email} for a sign-in link.` };
}

async function uploadFile(
  file: File,
  bucket: "premium-files" | "premium-thumbnails"
): Promise<string> {
  const admin = createAdminClient();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
  const path = `${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await admin.storage
    .from(bucket)
    .upload(path, buffer, { contentType: file.type || undefined });
  if (error) throw error;

  const {
    data: { publicUrl },
  } = admin.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
}

export type ContentFormState = {
  status: "idle" | "error";
  message?: string;
};

export async function saveContent(
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const contentType = String(
    formData.get("content_type") ?? ""
  ) as PremiumContentType;
  const videoEmbedUrl = String(formData.get("video_embed_url") ?? "").trim();
  const bodyMarkdown = String(formData.get("body_markdown") ?? "").trim();
  const published = formData.get("published") === "on";
  const existingFileUrl = String(
    formData.get("existing_file_url") ?? ""
  ).trim();
  const existingThumbnailUrl = String(
    formData.get("existing_thumbnail_url") ?? ""
  ).trim();
  const fileEntry = formData.get("file");
  const thumbnailEntry = formData.get("thumbnail");

  if (!title) {
    return { status: "error", message: "Title is required." };
  }
  if (
    !["video", "plan_download", "announcement", "article"].includes(
      contentType
    )
  ) {
    return { status: "error", message: "Choose a content type." };
  }
  if (contentType === "video" && !videoEmbedUrl) {
    return {
      status: "error",
      message: "Paste a Vimeo or YouTube embed URL.",
    };
  }
  if (contentType === "article" && !bodyMarkdown) {
    return { status: "error", message: "Write the article body." };
  }

  let fileUrl: string | null = existingFileUrl || null;
  let thumbnailUrl: string | null = existingThumbnailUrl || null;

  try {
    if (fileEntry instanceof File && fileEntry.size > 0) {
      fileUrl = await uploadFile(fileEntry, "premium-files");
    }
    if (thumbnailEntry instanceof File && thumbnailEntry.size > 0) {
      thumbnailUrl = await uploadFile(thumbnailEntry, "premium-thumbnails");
    }
  } catch (error) {
    console.error("Premium content upload failed:", error);
    return {
      status: "error",
      message: "File upload failed. Please try again.",
    };
  }

  if (contentType === "plan_download" && !fileUrl) {
    return { status: "error", message: "Upload a file for this download." };
  }

  const input: PremiumContentInput = {
    title,
    description: description || null,
    content_type: contentType,
    video_embed_url: contentType === "video" ? videoEmbedUrl : null,
    file_url: contentType === "plan_download" ? fileUrl : null,
    thumbnail_url: thumbnailUrl,
    body_markdown: contentType === "article" ? bodyMarkdown : null,
    published,
  };

  try {
    if (id) {
      await updateContent(id, input);
    } else {
      await createContent(input);
    }
  } catch (error) {
    console.error("Failed to save premium content:", error);
    return { status: "error", message: "Couldn't save. Please try again." };
  }

  revalidatePath("/admin/premium-content");
  revalidatePath("/premium");
  redirect("/admin/premium-content");
}

export async function deleteContentAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await deleteContent(id);
  revalidatePath("/admin/premium-content");
  revalidatePath("/premium");
}

export async function moveContentAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!id || (direction !== "up" && direction !== "down")) return;

  await moveContent(id, direction);
  revalidatePath("/admin/premium-content");
}
