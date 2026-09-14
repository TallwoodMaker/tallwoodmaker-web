"use client";

import { useActionState, useState } from "react";
import { saveContent, type ContentFormState } from "./actions";
import type { PremiumContent, PremiumContentType } from "@/lib/premiumContent";

const initialState: ContentFormState = { status: "idle" };

const inputClass =
  "w-full rounded border border-border bg-cream px-3 py-2 text-[15px] text-ink";
const labelClass = "mb-1.5 block text-[13px] font-semibold text-ink-soft";

export default function ContentForm({
  editing,
}: {
  editing: PremiumContent | null;
}) {
  const [state, formAction, pending] = useActionState(
    saveContent,
    initialState
  );
  const [contentType, setContentType] = useState<PremiumContentType>(
    editing?.content_type ?? "video"
  );

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="id" value={editing?.id ?? ""} />
      <input
        type="hidden"
        name="existing_file_url"
        value={editing?.file_url ?? ""}
      />
      <input
        type="hidden"
        name="existing_thumbnail_url"
        value={editing?.thumbnail_url ?? ""}
      />

      <div>
        <label className={labelClass} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={editing?.title ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={editing?.description ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="content_type">
          Content type
        </label>
        <select
          id="content_type"
          name="content_type"
          value={contentType}
          onChange={(e) => setContentType(e.target.value as PremiumContentType)}
          className={inputClass}
        >
          <option value="video">Video</option>
          <option value="plan_download">Plan / download</option>
          <option value="announcement">Announcement</option>
        </select>
      </div>

      {contentType === "video" && (
        <div>
          <label className={labelClass} htmlFor="video_embed_url">
            Vimeo or YouTube embed URL
          </label>
          <input
            id="video_embed_url"
            name="video_embed_url"
            placeholder="https://player.vimeo.com/video/… or https://www.youtube.com/embed/…"
            defaultValue={editing?.video_embed_url ?? ""}
            className={inputClass}
          />
        </div>
      )}

      {contentType === "plan_download" && (
        <div>
          <label className={labelClass} htmlFor="file">
            File{editing?.file_url ? " (leave blank to keep current file)" : ""}
          </label>
          <input
            id="file"
            name="file"
            type="file"
            className="w-full text-[14px]"
          />
          {editing?.file_url && (
            <a
              href={editing.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-block text-[13px] text-link"
            >
              Current file →
            </a>
          )}
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="thumbnail">
          Thumbnail{" "}
          {editing?.thumbnail_url
            ? "(optional — leave blank to keep current)"
            : "(optional)"}
        </label>
        <input
          id="thumbnail"
          name="thumbnail"
          type="file"
          accept="image/*"
          className="w-full text-[14px]"
        />
        {editing?.thumbnail_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={editing.thumbnail_url}
            alt=""
            className="mt-2 h-16 w-28 rounded border border-border object-cover"
          />
        )}
      </div>

      <label className="flex items-center gap-2 text-[15px] font-medium">
        <input
          type="checkbox"
          name="published"
          defaultChecked={editing?.published ?? false}
        />
        Published (visible on the member page)
      </label>

      {state.status === "error" && (
        <p className="text-[15px] text-link">{state.message}</p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded bg-brand px-6 py-2.5 text-[15px] font-bold text-ink disabled:cursor-default disabled:opacity-60"
        >
          {pending ? "Saving…" : editing ? "Save changes" : "Add entry"}
        </button>
      </div>
    </form>
  );
}
