import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscriberByEmail, hasActiveSubscription } from "@/lib/subscribers";
import { listPublishedContent } from "@/lib/premiumContent";
import ImageSlot from "@/components/ImageSlot";

export const metadata: Metadata = {
  title: "Premium",
  description: "Full builds, extended cuts, and shop files for members.",
};

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
        <section className="container-page section-px grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-6 gap-y-10 border-t border-border pb-[clamp(24px,5vw,64px)] pt-12">
          {entries.map((entry) => (
            <div key={entry.id}>
              <div className="mb-3.5 aspect-video overflow-hidden rounded-md">
                {entry.content_type === "video" && entry.video_embed_url ? (
                  <iframe
                    src={entry.video_embed_url}
                    title={entry.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : entry.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={entry.thumbnail_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageSlot
                    placeholder={
                      entry.content_type === "plan_download"
                        ? "download"
                        : "announcement"
                    }
                    className="h-full w-full"
                  />
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
              {entry.content_type === "plan_download" && entry.file_url && (
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
        </section>
      )}
    </>
  );
}
