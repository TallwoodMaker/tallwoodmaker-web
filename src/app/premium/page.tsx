import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscriberByEmail, hasActiveSubscription } from "@/lib/subscribers";
import { listPublishedContent, type PremiumContent } from "@/lib/premiumContent";
import { renderMarkdown } from "@/lib/markdown";
import ImageSlot from "@/components/ImageSlot";

export const metadata: Metadata = {
  title: "Premium",
  description: "Full builds, extended cuts, and shop files for members.",
};

function byRecency(a: PremiumContent, b: PremiumContent) {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

export default async function PremiumPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/premium/subscribe");
  }

  const subscriber = await getSubscriberByEmail(user.email);
  if (!hasActiveSubscription(subscriber)) {
    redirect("/premium/subscribe");
  }

  const entries = await listPublishedContent();

  // Sections are ordered by recency within each content type, not the
  // admin's manual sort_order — that still controls the admin list's own
  // ordering, but no longer this page's display order.
  const announcements = entries
    .filter((e) => e.content_type === "announcement")
    .sort(byRecency)
    .slice(0, 3);
  const articles = entries
    .filter((e) => e.content_type === "article")
    .sort(byRecency);
  const videos = entries.filter((e) => e.content_type === "video").sort(byRecency);
  const downloads = entries
    .filter((e) => e.content_type === "plan_download")
    .sort(byRecency);

  return (
    <>
      <div className="h-2 bg-brand" />

      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)]">
        <span className="mb-5 inline-block rounded-full bg-ink px-4 py-1.5 text-[13px] font-bold tracking-[0.03em] text-brand">
          PREMIUM
        </span>
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Premium Video
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          Full builds and extended cuts for members. New content added
          regularly.
        </p>
      </section>

      {entries.length === 0 ? (
        <section className="container-page section-px border-t border-border pb-[clamp(24px,5vw,64px)] pt-12">
          <p className="text-[15px] text-ink-muted">
            New content coming soon — check back shortly.
          </p>
        </section>
      ) : (
        <div className="border-t border-border pb-[clamp(24px,5vw,64px)] pt-12">
          {announcements.length > 0 && (
            <section className="container-page section-px mb-12">
              <h2 className="mb-4 text-xl font-bold">Announcements</h2>
              <div className="grid gap-3 rounded-md bg-ink p-5 text-brand">
                {announcements.map((entry) => (
                  <div key={entry.id}>
                    <div className="font-semibold">{entry.title}</div>
                    {entry.description && (
                      <div className="text-[14px] text-brand/80">
                        {entry.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {articles.length > 0 && (
            <section className="container-page section-px mb-12">
              <h2 className="mb-4 text-xl font-bold">Articles</h2>
              <div className="grid gap-8">
                {articles.map((entry) => (
                  <article
                    key={entry.id}
                    className="rounded-md border border-border p-6"
                  >
                    <h3 className="mb-1 text-lg font-bold">{entry.title}</h3>
                    {entry.description && (
                      <p className="mb-4 text-sm text-ink-muted">
                        {entry.description}
                      </p>
                    )}
                    <div
                      className="text-[15px] leading-[1.6] text-ink [&_a]:text-link [&_h1]:mt-5 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mt-4 [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc [&_ul]:mb-3 first:[&>*]:mt-0"
                      // Safe: body_markdown is rendered with markdown-it's
                      // html:false option (src/lib/markdown.ts), so raw
                      // author-supplied HTML is escaped, never executed —
                      // this only contains markdown-it's own generated markup.
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(entry.body_markdown ?? ""),
                      }}
                    />
                  </article>
                ))}
              </div>
            </section>
          )}

          {videos.length > 0 && (
            <section className="container-page section-px mb-12">
              <h2 className="mb-6 text-xl font-bold">Videos</h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-6 gap-y-10">
                {videos.map((entry) => (
                  <div key={entry.id}>
                    <div className="mb-3.5 aspect-video overflow-hidden rounded-md">
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
                    <div className="mb-1 text-[15px] font-semibold">
                      {entry.title}
                    </div>
                    {entry.description && (
                      <div className="text-sm text-ink-muted">
                        {entry.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {downloads.length > 0 && (
            <section className="container-page section-px">
              <h2 className="mb-6 text-xl font-bold">Downloads</h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-6 gap-y-10">
                {downloads.map((entry) => (
                  <div key={entry.id}>
                    <div className="mb-3.5 aspect-video overflow-hidden rounded-md">
                      {entry.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={entry.thumbnail_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageSlot placeholder="download" className="h-full w-full" />
                      )}
                    </div>
                    <div className="mb-1 text-[15px] font-semibold">
                      {entry.title}
                    </div>
                    {entry.description && (
                      <div className="mb-3 text-sm text-ink-muted">
                        {entry.description}
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
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}
