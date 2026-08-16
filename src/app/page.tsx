import Link from "next/link";
import Image from "next/image";
import ImageSlot from "@/components/ImageSlot";
import PromoBanner from "@/components/PromoBanner";
import TikTokCreatorEmbed from "@/components/TikTokCreatorEmbed";
import {
  YouTubeIcon,
  InstagramIcon,
  TikTokIcon,
  FacebookIcon,
} from "@/components/SocialIcons";
import { SHOP_ENABLED, HOME_PROJECTS_ENABLED } from "@/lib/config";

const SOCIAL_LINKS = [
  { name: "YouTube", url: "https://youtube.com/@tallwoodmaker", Icon: YouTubeIcon },
  { name: "Instagram", url: "https://instagram.com/tallwoodmaker", Icon: InstagramIcon },
  { name: "TikTok", url: "https://tiktok.com/@tallwoodmaker", Icon: TikTokIcon },
  { name: "Facebook", url: "https://facebook.com/Tallwoodmaker", Icon: FacebookIcon },
];

const LONG_FORM_VIDEOS = [
  {
    id: "h_7bRppzupc",
    title: "Inside My €650,000 Dream Woodshop (900m² Full Tour 2025)",
    tag: "Workshop Tour",
    duration: "14:23",
  },
  {
    id: "Lr1ormzIZEo",
    title: "Sunday Reset, CNC Fix & Projects | Day in the Workshop Ep.7",
    tag: "Day in the Workshop",
    duration: "4:00",
  },
  {
    id: "xUvPfp6E0zw",
    title: "23 Minutes from the Life of a Woodworking CNC Operator",
    tag: "Day in the Workshop",
    duration: "23:49",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="container-page section-px section-py grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-center gap-14">
        <div>
          <h1 className="mb-6 text-[clamp(40px,6vw,72px)] font-extrabold leading-[1.05] tracking-[-0.01em]">
            TallWoodMaker
          </h1>
          <p className="mb-8 max-w-[480px] text-[19px] leading-[1.6] text-ink-muted">
            Woodworking content for a growing community on YouTube, Instagram,
            and TikTok. From first sketch to final finish — the whole
            process, on camera.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/about"
              className="rounded bg-brand px-7 py-3.5 text-[15px] font-bold text-ink"
            >
              View projects
            </Link>
            <Link
              href="/about#video"
              className="rounded border border-border px-7 py-3.5 text-[15px] font-semibold text-ink"
            >
              Follow along
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md border border-border">
          <Image
            src="/images/workshop/workshop-10.jpg"
            alt="Wide view of the TallWoodMaker workshop with a panel saw and spindle moulder"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="bg-brand section-px py-[22px]">
        <div className="container-page text-center text-[clamp(18px,2.6vw,28px)] font-extrabold tracking-[0.04em]">
          BUILD · SHARE · INSPIRE
        </div>
      </section>

      <section className="container-page section-px section-py grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-14">
        <div className="aspect-square w-full max-w-[400px]">
          <ImageSlot placeholder="portrait photo" className="h-full w-full" />
        </div>
        <div>
          <h2 className="mb-4 inline-block bg-brand px-3.5 py-1 text-[28px] font-bold">
            About
          </h2>
          <p className="mb-5 max-w-[520px] text-[17px] leading-[1.65] text-ink-muted">
            I build by hand and by machine, from first sketch to final
            finish. The content I make shows the whole process — mistakes,
            fixes, and finished pieces.
          </p>
          <Link href="/about" className="text-[15px] font-semibold">
            More about me →
          </Link>
        </div>
      </section>

      {HOME_PROJECTS_ENABLED && (
        <>
          <PromoBanner
            title="Projects"
            description="A selection from the shop — tables, shelves, small pieces, and custom builds."
            linkHref="/about"
            linkLabel="Full gallery →"
          />

          <section className="container-page section-px section-py grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
            <div className="aspect-[4/3]">
              <ImageSlot placeholder="project photo" className="h-full w-full" />
            </div>
            <div className="aspect-[4/3]">
              <ImageSlot placeholder="project photo" className="h-full w-full" />
            </div>
            <div className="aspect-[4/3]">
              <ImageSlot placeholder="project photo" className="h-full w-full" />
            </div>
            <div className="aspect-[4/3]">
              <ImageSlot placeholder="project photo" className="h-full w-full" />
            </div>
          </section>
        </>
      )}

      <PromoBanner
        title="Follow the build"
        description="New video every week — process, tools, mistakes, and results."
        linkHref="/about#video"
        linkLabel="All videos →"
      />

      <section className="container-page section-px section-py">
        <h2 className="mb-4 inline-block bg-brand px-3.5 py-1 text-[28px] font-bold">
          Follow Along
        </h2>
        <p className="mb-8 max-w-[520px] text-[15px] leading-[1.6] text-ink-muted">
          New builds and behind-the-scenes drop across every platform — pick
          where you want to follow.
        </p>

        <div className="mb-10 flex flex-wrap gap-3">
          {SOCIAL_LINKS.map(({ name, url, Icon }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[15px] font-semibold text-ink hover:border-ink hover:text-ink"
            >
              <Icon className="text-ink" />
              Follow on {name}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          <div className="rounded-md border border-border p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <YouTubeIcon className="text-ink" />
              <h3 className="text-lg font-bold">YouTube</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {LONG_FORM_VIDEOS.map((video) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-video overflow-hidden rounded border border-border"
                >
                  <img
                    src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </a>
              ))}
            </div>
            <a
              href="https://youtube.com/@tallwoodmaker"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-[15px] font-semibold"
            >
              Watch more on YouTube →
            </a>
          </div>

          <div className="flex flex-col rounded-md border border-border p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <InstagramIcon className="text-ink" />
              <h3 className="text-lg font-bold">Instagram</h3>
            </div>
            <p className="mb-5 flex-1 text-[15px] text-ink-muted">
              See our latest posts on Instagram — daily cuts, reels, and
              behind-the-scenes from the shop.
            </p>
            <a
              href="https://instagram.com/tallwoodmaker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] font-semibold"
            >
              Follow on Instagram →
            </a>
          </div>

          <div className="rounded-md border border-border p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <TikTokIcon className="text-ink" />
              <h3 className="text-lg font-bold">TikTok</h3>
            </div>
            <TikTokCreatorEmbed />
          </div>
        </div>
      </section>

      <section className="container-page section-px section-py border-t border-border">
        <h2 className="mb-4 inline-block bg-brand px-3.5 py-1 text-[28px] font-bold">
          Long-Form Videos
        </h2>
        <p className="mb-8 max-w-[520px] text-[15px] leading-[1.6] text-ink-muted">
          Full workshop tours and day-in-the-shop episodes — the extended
          cuts from the channel.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {LONG_FORM_VIDEOS.map((video) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-ink hover:text-ink"
            >
              <div className="relative mb-3 aspect-video overflow-hidden rounded-md border border-border">
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover:bg-ink/20">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream/90">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="ml-0.5 text-ink"
                    >
                      <path d="M6 4.5v15l14-7.5-14-7.5Z" />
                    </svg>
                  </span>
                </span>
                <span className="absolute bottom-2 right-2 rounded bg-ink/80 px-1.5 py-0.5 text-[11px] font-semibold text-cream">
                  {video.duration}
                </span>
              </div>
              <div className="mb-1 text-[15px] font-semibold">{video.title}</div>
              <div className="text-sm text-ink-muted">{video.tag}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="container-page section-px section-py grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-10 border-t border-border">
        <div className="rounded-md border border-border p-8">
          <h2 className="mb-2.5 inline-block bg-brand px-3.5 py-1 text-[22px] font-bold">
            Premium
          </h2>
          <p className="mb-5 text-[15px] leading-[1.6] text-ink-muted">
            Full builds, extended cuts, and shop files for members — launching
            soon. Join the waitlist now for an early-bird discount.
          </p>
          <Link href="/premium/subscribe" className="text-[15px] font-semibold">
            Learn more →
          </Link>
        </div>
        <div className="rounded-md border border-border p-8">
          <h2 className="mb-2.5 inline-block bg-brand px-3.5 py-1 text-[22px] font-bold">
            Work with me
          </h2>
          <p className="mb-5 text-[15px] leading-[1.6] text-ink-muted">
            Brand partnerships, sponsored builds, and discount codes for the
            community.
          </p>
          <Link href="/collaborate" className="text-[15px] font-semibold">
            See collaboration options →
          </Link>
        </div>
      </section>

      {SHOP_ENABLED && (
        <>
          <PromoBanner
            title="Shop"
            description="Plans, guides, and a few finished pieces for sale."
            linkHref="/shop"
            linkLabel="Visit the shop →"
          />

          <section className="container-page section-px section-py grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
            <div>
              <div className="mb-3.5 aspect-[4/3]">
                <ImageSlot placeholder="product photo" className="h-full w-full" />
              </div>
              <div className="mb-1 text-[15px] font-semibold">Plan: Dining Table</div>
              <div className="text-[15px] text-ink-muted">$18</div>
            </div>
            <div>
              <div className="mb-3.5 aspect-[4/3]">
                <ImageSlot placeholder="product photo" className="h-full w-full" />
              </div>
              <div className="mb-1 text-[15px] font-semibold">Cutting Board Set</div>
              <div className="text-[15px] text-ink-muted">$64</div>
            </div>
            <div>
              <div className="mb-3.5 aspect-[4/3]">
                <ImageSlot placeholder="product photo" className="h-full w-full" />
              </div>
              <div className="mb-1 text-[15px] font-semibold">
                Guide: Mortise &amp; Tenon Joints
              </div>
              <div className="text-[15px] text-ink-muted">$9</div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
