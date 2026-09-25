import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PromoBanner from "@/components/PromoBanner";

export const metadata: Metadata = {
  title: "Collaborate",
  description:
    "Brand partnerships with a professional woodworker — fifteen years in the trade, real shop content, no staging.",
};

const WHAT_BRANDS_GET = [
  {
    title: "An audience that works with wood",
    description:
      "Woodworking enthusiasts and aspiring professionals, not casual scrollers — people who watch because they're actually building something.",
  },
  {
    title: "Real shop footage",
    description:
      "Tools and materials shown exactly as they're used on real jobs, in a working shop — nothing staged for the camera.",
  },
  {
    title: "A credible voice",
    description:
      "Fifteen years of trade experience behind every recommendation, not a creator reading a script for a brand deal.",
  },
];

const MEDIA_KIT_STATS = [
  { label: "Combined followers", value: "30,000+" },
  { label: "Monthly reach", value: "20M+" },
  { label: "Years in the trade", value: "15" },
];

const PARTNERSHIP_OPTIONS = [
  {
    title: "Product mention",
    description:
      "Your tool or material shown and named in a regular build video.",
    price: "Get a quote",
  },
  {
    title: "Dedicated feature",
    description:
      "A full video built around your product — review, test, or tutorial.",
    price: "Get a quote",
  },
  {
    title: "Ongoing partnership",
    description:
      "Multiple videos over a season, plus shop and social mentions.",
    price: "Get a quote",
  },
];

export default function CollaboratePage() {
  return (
    <>
      <div className="h-2 bg-brand" />

      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)]">
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Collaborate
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          I build for brands the same way I build for the camera — no
          shortcuts, no filler. If your tools or materials belong in a real
          shop, let&apos;s talk.
        </p>
      </section>

      <section className="container-page section-px pb-[clamp(24px,5vw,64px)]">
        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-md border border-border">
          <Image
            src="/images/workshop/workshop-1.jpg"
            alt="Biesse Rover A Smart CNC machining center in the workshop"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </section>

      <PromoBanner
        title="Build. Share. Inspire."
        description="The philosophy behind everything I build, on camera or off."
      />
      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] pt-12">
        <p className="max-w-[640px] text-[17px] leading-[1.75] text-ink-soft">
          I&apos;m Tom — fifteen years working wood professionally, not since
          I picked up a camera. TallWoodMaker documents real client work:
          kitchens, custom furniture, and full interior fit-outs, run on CNC
          machinery and panel saws every day, not weekend projects. The
          channel exists to pass the trade on properly, the way it was taught
          to me — entertainment is a side effect, not the point.
        </p>
      </section>

      <PromoBanner
        title="By the numbers"
        description="A quick look at the audience behind the channel."
      />
      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] pt-12">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6">
          {MEDIA_KIT_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-md border border-border p-6 text-center"
            >
              <div className="mb-1 text-[clamp(28px,4vw,36px)] font-extrabold leading-none">
                {stat.value}
              </div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.03em] text-ink-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <PromoBanner
        title="What you're actually getting"
        description="Here's what a partnership actually puts in front of real woodworkers."
      />
      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] pt-12">
        <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {[
            {
              src: "/images/workshop/workshop-4.jpg",
              alt: "Tom loading a board onto the Biesse Selco panel saw",
            },
            {
              src: "/images/workshop/workshop-2.jpg",
              alt: "Edge banding machine applying banding to a panel",
            },
            {
              src: "/images/workshop/workshop-8.jpg",
              alt: "Wide view of the workshop with lumber racks and a hot press",
            },
          ].map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-[4/3] overflow-hidden rounded-md border border-border"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
          {WHAT_BRANDS_GET.map((item) => (
            <div
              key={item.title}
              className="rounded-md border border-border p-8"
            >
              <h3 className="mb-3 text-[19px] font-bold">{item.title}</h3>
              <p className="text-[15px] leading-[1.6] text-ink-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <PromoBanner
        title="Partnership options"
        description="A few ways to work together — every partnership is scoped to fit."
      />
      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] pt-12">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {PARTNERSHIP_OPTIONS.map((option) => (
            <div
              key={option.title}
              className="flex flex-col gap-3 rounded-md border border-border p-6"
            >
              <h3 className="text-[17px] font-bold">{option.title}</h3>
              <p className="flex-1 text-[14px] leading-[1.6] text-ink-muted">
                {option.description}
              </p>
              <div className="text-[15px] font-bold text-ink">
                {option.price}
              </div>
            </div>
          ))}
        </div>
      </section>

      <PromoBanner
        title="Let's talk"
        description="If your tools or materials would hold up in a working shop, get in touch and let's figure out what makes sense."
      />
      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] pt-12 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-block rounded bg-brand px-7 py-3.5 text-[15px] font-bold text-ink"
          >
            Start a conversation
          </Link>
          <a
            href="mailto:tom@tallwoodmaker.com"
            className="text-[15px] font-semibold"
          >
            tom@tallwoodmaker.com
          </a>
        </div>
      </section>
    </>
  );
}
