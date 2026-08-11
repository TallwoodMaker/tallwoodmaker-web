import type { Metadata } from "next";
import ImageSlot from "@/components/ImageSlot";

export const metadata: Metadata = {
  title: "Video & Social",
  description:
    "New video every week. Shorter cuts land daily on Instagram and TikTok.",
};

const YOUTUBE_VIDEOS = [
  "9 Genius Tape Measure Hacks You Didn't Know!",
  "Sunday Reset, CNC Fix & Projects",
  "CNC Kids Chair Build (115 kg Test)",
];

export default function VideoPage() {
  return (
    <>
      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)]">
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Video &amp; Social
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          New video every week. Shorter cuts land daily on Instagram and
          TikTok.
        </p>
      </section>

      <section className="container-page section-px border-t border-border pb-[clamp(24px,5vw,64px)] pt-12">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-2xl font-bold">YouTube</h2>
          <span className="text-[15px] text-ink-muted">@tallwoodmaker</span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
          {YOUTUBE_VIDEOS.map((title) => (
            <div key={title}>
              <div className="mb-3 aspect-video">
                <ImageSlot placeholder="video thumbnail" className="h-full w-full" />
              </div>
              <div className="text-[15px] font-semibold">{title}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page section-px border-t border-border pb-[clamp(24px,5vw,64px)] pt-12">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-2xl font-bold">Instagram</h2>
          <span className="text-[15px] text-ink-muted">@tallwoodmaker</span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square">
              <ImageSlot placeholder="post" className="h-full w-full" />
            </div>
          ))}
        </div>
      </section>

      <section className="container-page section-px border-t border-border pb-[clamp(24px,5vw,64px)] pt-12">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-2xl font-bold">TikTok</h2>
          <span className="text-[15px] text-ink-muted">@tallwoodmaker</span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[9/16]">
              <ImageSlot placeholder="clip" className="h-full w-full" />
            </div>
          ))}
        </div>
      </section>

      <section className="container-page section-px border-t border-border pb-[clamp(24px,5vw,64px)] pt-12">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border p-7">
          <div>
            <h2 className="mb-1.5 text-xl font-bold">Facebook</h2>
            <p className="text-[15px] text-ink-muted">
              Weekly recaps and live streams from the shop.
            </p>
          </div>
          <span className="text-[15px] font-semibold">TallWoodMaker →</span>
        </div>
      </section>
    </>
  );
}
