import type { Metadata } from "next";
import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";

export const metadata: Metadata = {
  title: "About",
  description:
    "I'm Tom — known online as Tallwoodmaker. Woodworking is both my work and the content I share.",
};

export default function AboutPage() {
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
        <div className="aspect-[4/5] w-full">
          <ImageSlot placeholder="portrait photo" className="h-full w-full" />
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
        <div className="aspect-[16/7] w-full">
          <ImageSlot placeholder="workshop wide photo" className="h-full w-full" />
        </div>
      </section>

      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] text-center">
        <Link
          href="/video"
          className="inline-block rounded bg-brand px-7 py-3.5 text-[15px] font-bold text-ink"
        >
          Follow the build
        </Link>
      </section>
    </>
  );
}
