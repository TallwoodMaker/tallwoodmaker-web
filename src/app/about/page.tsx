import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import TikTokCreatorEmbed from "@/components/TikTokCreatorEmbed";
import { YouTubeIcon, InstagramIcon } from "@/components/SocialIcons";
import { getLatestYouTubeVideos } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "About",
  description:
    "I'm Tom — known online as Tallwoodmaker. Woodworking is both my work and the content I share.",
};

const GALLERY_ITEMS = [
  {
    src: "/images/workshop/workshop-1.jpg",
    title: "Biesse Rover CNC Machine",
    category: "CNC Machine",
    alt: "Biesse Rover A Smart CNC machining center in the workshop",
  },
  {
    src: "/images/workshop/workshop-2.jpg",
    title: "Edge Banding in Progress",
    category: "Edge Banding",
    alt: "Edge banding machine applying banding to a panel",
  },
  {
    src: "/images/workshop/workshop-3.jpg",
    title: "Feeding the Edge Bander",
    category: "Edge Banding",
    alt: "Tom feeding a panel into the edge banding machine",
  },
  {
    src: "/images/workshop/workshop-4.jpg",
    title: "On the Panel Saw",
    category: "Panel Saw",
    alt: "Tom loading a board onto the Biesse Selco panel saw",
  },
  {
    src: "/images/workshop/workshop-5.jpg",
    title: "Biesse Selco Panel Saw",
    category: "Panel Saw",
    alt: "Biesse Selco WN2 panel saw and outfeed tables",
  },
  {
    src: "/images/workshop/workshop-6.jpg",
    title: "A Break in the Shop",
    category: "Behind the Scenes",
    alt: "Tom standing in the workshop next to stacked panel offcuts",
  },
  {
    src: "/images/workshop/workshop-7.jpg",
    title: "Edge Bander Controls",
    category: "Edge Banding",
    alt: "Cehisa edge banding machine control panel",
  },
  {
    src: "/images/workshop/workshop-8.jpg",
    title: "Lumber Storage & Hot Press",
    category: "Workshop Overview",
    alt: "Wide view of the workshop with lumber racks and a hot press",
  },
  {
    src: "/images/workshop/workshop-9.jpg",
    title: "Dust Collection & Sanding Line",
    category: "Workshop Overview",
    alt: "Workshop overview with a wide-belt sander and overhead dust collection ductwork",
  },
  {
    src: "/images/workshop/workshop-10.jpg",
    title: "Sliding Table Saw",
    category: "Workshop Overview",
    alt: "Workshop overview with a sliding table saw and spindle moulder",
  },
  {
    src: "/images/workshop/workshop-11.jpg",
    title: "Fravol Edge Bander",
    category: "Edge Banding",
    alt: "Fravol edge banding machine with overhead dust collection piping",
  },
  {
    src: "/images/workshop/workshop-12.jpg",
    title: "The Shop Floor",
    category: "Workshop Overview",
    alt: "Fravol edge bander and the shop's overhead ducting network",
  },
];

export default async function AboutPage() {
  const youtubeVideos = await getLatestYouTubeVideos(3);
  return (
    <>
      <section className="container-page section-px section-py grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-center gap-14">
        <div>
          <h1 className="mb-6 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
            About
          </h1>
          <p className="max-w-[480px] text-lg leading-[1.65] text-ink-muted">
            I&apos;m Tom — known online as Tallwoodmaker. Woodworking is both
            my work and the content I share. The camera&apos;s been in the
            shop since the first cut.
          </p>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md border border-border">
          <Image
            src="/images/workshop/workshop-4.jpg"
            alt="Tom, TallWoodMaker, at the panel saw in the workshop"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="container-page section-px section-py mx-auto max-w-[900px] border-t border-border">
        <p className="mb-6 text-[17px] leading-[1.75] text-ink-soft">
          I got into woodworking by fixing an old shelf that was headed for
          the dump. The first piece came out crooked, the second was better,
          and the third ended up online. From there it grew into daily shop
          work.
        </p>
        <p className="text-[17px] leading-[1.75] text-ink-soft">
          The content I make isn&apos;t just a highlight reel. I show the
          measurements that didn&apos;t work, the tools that deserve more
          attention, and the calls made right at the saw.
        </p>
      </section>

      <section className="container-page section-px section-py grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-10 border-t border-border">
        <div>
          <h3 className="mb-3 text-[19px] font-bold">Process</h3>
          <p className="text-[15px] leading-[1.6] text-ink-muted">
            From design to finish — every step documented, including the
            mistakes.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-[19px] font-bold">Tools</h3>
          <p className="text-[15px] leading-[1.6] text-ink-muted">
            A mix of hand tools and machines. I explain what and why.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-[19px] font-bold">Community</h3>
          <p className="text-[15px] leading-[1.6] text-ink-muted">
            Questions from the comments often become the next video&apos;s
            topic.
          </p>
        </div>
      </section>

      <section className="container-page section-px section-py border-t border-border">
        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-md border border-border">
          <Image
            src="/images/workshop/workshop-9.jpg"
            alt="Wide view of the workshop with a wide-belt sander and overhead dust collection ductwork"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </section>

      <section className="container-page section-px section-py border-t border-border">
        <h2 className="mb-4 text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Gallery
        </h2>
        <p className="mb-10 max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          A look inside the shop — the machines, the process, and the people
          behind every build.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-6 gap-y-8">
          {GALLERY_ITEMS.map((item) => (
            <div key={item.src}>
              <div className="relative mb-3.5 aspect-[4/3] overflow-hidden rounded-md border border-border">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="mb-0.5 text-[15px] font-semibold">{item.title}</div>
              <div className="text-sm text-ink-muted">{item.category}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="video" className="container-page section-px section-py border-t border-border">
        <h2 className="mb-4 text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Video &amp; Social
        </h2>
        <p className="mb-10 max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          New video every week. Shorter cuts land daily on Instagram and
          TikTok.
        </p>

        <div className="mb-12">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-2xl font-bold">YouTube</h3>
            <span className="text-[15px] text-ink-muted">@tallwoodmaker</span>
          </div>
          {youtubeVideos ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
              {youtubeVideos.map((video) => (
                <a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-ink hover:text-ink"
                >
                  <div className="mb-3 aspect-video overflow-hidden rounded-md border border-border">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="text-[15px] font-semibold">{video.title}</div>
                </a>
              ))}
            </div>
          ) : (
            <a
              href="https://youtube.com/@tallwoodmaker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border p-7 text-ink hover:text-ink"
            >
              <div className="flex items-center gap-4">
                <YouTubeIcon className="shrink-0 text-ink" />
                <div>
                  <h4 className="mb-1.5 text-xl font-bold">Watch on YouTube</h4>
                  <p className="text-[15px] text-ink-muted">
                    New video every week, straight from the shop.
                  </p>
                </div>
              </div>
              <span className="text-[15px] font-semibold">TallWoodMaker →</span>
            </a>
          )}
        </div>

        <div className="mb-12">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-2xl font-bold">Instagram</h3>
            <span className="text-[15px] text-ink-muted">@tallwoodmaker</span>
          </div>
          <a
            href="https://instagram.com/tallwoodmaker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border p-7 text-ink hover:text-ink"
          >
            <div className="flex items-center gap-4">
              <InstagramIcon className="shrink-0 text-ink" />
              <div>
                <h4 className="mb-1.5 text-xl font-bold">Follow on Instagram</h4>
                <p className="text-[15px] text-ink-muted">
                  Daily cuts, reels, and behind-the-scenes from the shop.
                </p>
              </div>
            </div>
            <span className="text-[15px] font-semibold">@tallwoodmaker →</span>
          </a>
        </div>

        <div className="mb-12">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-2xl font-bold">TikTok</h3>
            <span className="text-[15px] text-ink-muted">@tallwoodmaker</span>
          </div>
          <TikTokCreatorEmbed />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border p-7">
          <div>
            <h3 className="mb-1.5 text-xl font-bold">Facebook</h3>
            <p className="text-[15px] text-ink-muted">
              Weekly recaps and live streams from the shop.
            </p>
          </div>
          <span className="text-[15px] font-semibold">TallWoodMaker →</span>
        </div>
      </section>

      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] text-center">
        <Link
          href="#video"
          className="inline-block rounded bg-brand px-7 py-3.5 text-[15px] font-bold text-ink"
        >
          Follow the build
        </Link>
      </section>
    </>
  );
}
