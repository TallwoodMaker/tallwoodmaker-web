"use client";

import { useState } from "react";
import type { PremiumContent } from "@/lib/premiumContent";
import ImageSlot from "@/components/ImageSlot";

export type FeedEntry = PremiumContent & { bodyHtml?: string };

type TabKey = "all" | "article" | "video" | "plan_download";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "article", label: "Articles" },
  { key: "video", label: "Videos" },
  { key: "plan_download", label: "Downloads" },
];

const TYPE_LABEL: Record<string, string> = {
  article: "Article",
  video: "Video",
  plan_download: "Download",
};

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-block rounded-full bg-ink/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-ink-muted">
      {TYPE_LABEL[type] ?? type}
    </span>
  );
}

export default function PremiumFeed({ entries }: { entries: FeedEntry[] }) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const filtered =
    activeTab === "all"
      ? entries
      : entries.filter((e) => e.content_type === activeTab);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-4 py-2 text-[14px] font-semibold ${
                active
                  ? "bg-ink text-brand"
                  : "border border-border text-ink hover:border-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[15px] text-ink-muted">Nothing here yet.</p>
      ) : (
        <div className="grid gap-8">
          {filtered.map((entry) => (
            <div key={entry.id} className="rounded-md border border-border p-6">
              <div className="mb-2">
                <TypeBadge type={entry.content_type} />
              </div>
              <h3 className="mb-1 text-lg font-bold">{entry.title}</h3>
              {entry.description && (
                <p className="mb-4 text-sm text-ink-muted">
                  {entry.description}
                </p>
              )}

              {entry.content_type === "video" && (
                <div className="aspect-video overflow-hidden rounded-md">
                  {entry.video_embed_url ? (
                    <iframe
                      src={entry.video_embed_url}
                      title={entry.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <ImageSlot
                      placeholder="video thumbnail"
                      className="h-full w-full"
                    />
                  )}
                </div>
              )}

              {entry.content_type === "article" && (
                <div
                  className="text-[15px] leading-[1.6] text-ink [&_a]:text-link [&_h1]:mt-5 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mt-4 [&_h3]:font-semibold [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc [&_ul]:mb-3 first:[&>*]:mt-0"
                  // Safe: bodyHtml is precomputed server-side with
                  // renderMarkdown (markdown-it, html:false) — raw
                  // author-supplied HTML is escaped, never executed.
                  dangerouslySetInnerHTML={{ __html: entry.bodyHtml ?? "" }}
                />
              )}

              {entry.content_type === "plan_download" && (
                <div>
                  {entry.thumbnail_url && (
                    <div className="mb-3.5 aspect-video overflow-hidden rounded-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={entry.thumbnail_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  {entry.file_url && (
                    <a
                      href={entry.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded bg-brand px-4 py-2 text-[14px] font-bold text-ink"
                    >
                      Download
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
