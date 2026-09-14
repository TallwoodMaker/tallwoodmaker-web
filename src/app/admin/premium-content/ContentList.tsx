"use client";

import Link from "next/link";
import type { PremiumContent } from "@/lib/premiumContent";
import { deleteContentAction, moveContentAction } from "./actions";

const TYPE_LABEL: Record<PremiumContent["content_type"], string> = {
  video: "Video",
  plan_download: "Plan / download",
  announcement: "Announcement",
};

export default function ContentList({
  entries,
}: {
  entries: PremiumContent[];
}) {
  if (entries.length === 0) {
    return (
      <p className="text-[15px] text-ink-muted">No entries yet — add one above.</p>
    );
  }

  return (
    <div className="grid gap-3">
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border p-4"
        >
          <div className="min-w-[200px]">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{entry.title}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em] ${
                  entry.published
                    ? "bg-brand text-ink"
                    : "bg-ink/10 text-ink-muted"
                }`}
              >
                {entry.published ? "Published" : "Draft"}
              </span>
            </div>
            <div className="mt-0.5 text-[13px] text-ink-muted">
              {TYPE_LABEL[entry.content_type]}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <form action={moveContentAction}>
              <input type="hidden" name="id" value={entry.id} />
              <input type="hidden" name="direction" value="up" />
              <button
                type="submit"
                disabled={index === 0}
                aria-label="Move up"
                className="rounded border border-border px-2.5 py-1.5 text-[13px] disabled:cursor-default disabled:opacity-30"
              >
                ↑
              </button>
            </form>
            <form action={moveContentAction}>
              <input type="hidden" name="id" value={entry.id} />
              <input type="hidden" name="direction" value="down" />
              <button
                type="submit"
                disabled={index === entries.length - 1}
                aria-label="Move down"
                className="rounded border border-border px-2.5 py-1.5 text-[13px] disabled:cursor-default disabled:opacity-30"
              >
                ↓
              </button>
            </form>

            <Link
              href={`/admin/premium-content?edit=${entry.id}`}
              className="rounded border border-border px-3 py-1.5 text-[13px] font-semibold text-ink"
            >
              Edit
            </Link>

            <form
              action={deleteContentAction}
              onSubmit={(e) => {
                if (!confirm(`Delete “${entry.title}”? This can't be undone.`)) {
                  e.preventDefault();
                }
              }}
            >
              <input type="hidden" name="id" value={entry.id} />
              <button
                type="submit"
                className="rounded border border-border px-3 py-1.5 text-[13px] font-semibold text-link"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
