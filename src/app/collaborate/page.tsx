import type { Metadata } from "next";
import Link from "next/link";
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

      <PromoBanner
        title="Build. Share. Inspire."
        description="The philosophy behind everything I build, on camera or off."
      />
      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] pt-12">
        <p className="max-w-[640px] text-[17px] leading-[1.75] text-ink-soft">
          That&apos;s the whole operation in three words. I build real pieces
          in a real shop, I share the process — the good cuts and the bad
          ones — and the goal is always to leave people knowing more than
          they did before they watched. Every partnership has to fit inside
          that, or it doesn&apos;t happen.
        </p>
      </section>

      <PromoBanner
        title="Fifteen years in the trade"
        description="A working shop in Slovakia, not a hobby that turned into content."
        linkHref="/about"
        linkLabel="More about me →"
      />
      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] pt-12">
        <p className="max-w-[640px] text-[17px] leading-[1.75] text-ink-soft">
          I&apos;m Tom. I&apos;ve been working wood professionally for
          fifteen years, not since I picked up a camera. TallWoodMaker
          isn&apos;t a hobby that turned into content — it&apos;s a working
          shop in Slovakia that happens to be filmed. I run CNC machinery,
          panel saws, and edge banders every day for actual paying work, and
          the channel documents that — not a weekend-warrior version of it.
        </p>
      </section>

      <PromoBanner
        title="Real work, not weekend projects"
        description="Kitchens, custom furniture, and full interior fit-outs — not birdhouses."
      />
      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] pt-12">
        <p className="max-w-[640px] text-[17px] leading-[1.75] text-ink-soft">
          The builds on this channel are kitchens, custom furniture, and full
          interior fit-outs — the kind of jobs that take weeks, not an
          afternoon. I&apos;m not filming birdhouses for beginners.
          It&apos;s professional-grade work, shot as it actually happens on
          the shop floor, cut list to finished install.
        </p>
      </section>

      <PromoBanner
        title="Passing the trade on"
        description="Helping the next generation actually learn the trade, not just watch it."
      />
      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] pt-12">
        <p className="max-w-[640px] text-[17px] leading-[1.75] text-ink-soft">
          Woodworking got passed down to me by people who took the time to
          explain it properly, and I want to do the same for whoever&apos;s
          watching. The goal isn&apos;t views for their own sake — it&apos;s
          helping the next generation of woodworkers actually learn the
          trade: the joinery, the machines, the judgment calls you only get
          from doing it. Entertainment is a side effect, not the point.
        </p>
      </section>

      <PromoBanner
        title="What you're actually getting"
        description="Here's what a partnership actually puts in front of real woodworkers."
      />
      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] pt-12">
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
