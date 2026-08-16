import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageSlot from "@/components/ImageSlot";
import { COURSE_ENABLED } from "@/lib/config";

export const metadata: Metadata = {
  title: "Online Course",
  description:
    "A step-by-step course built for beginners who want to build real furniture with confidence.",
};

const CURRICULUM = [
  {
    title: "Shop setup",
    description:
      "Which tools to start with, and how to set up a small space safely.",
  },
  {
    title: "Core joinery",
    description:
      "Mortise and tenon, dowels, and glue-ups — the joints behind most furniture.",
  },
  {
    title: "Finishing",
    description: "Sanding, oils, and finishes that hold up to daily use.",
  },
  {
    title: "Your first build",
    description: "A guided project from cut list to finished piece.",
  },
];

export default function CoursePage() {
  if (!COURSE_ENABLED) {
    notFound();
  }

  return (
    <>
      <section className="container-page section-px section-py grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-center gap-14">
        <div>
          <span className="mb-5 inline-block rounded-full bg-ink px-4 py-1.5 text-[13px] font-bold tracking-[0.03em] text-brand">
            COMING SOON
          </span>
          <h1 className="mb-6 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
            Online Course
          </h1>
          <p className="mb-7 max-w-[480px] text-lg leading-[1.65] text-ink-muted">
            A step-by-step course built for beginners who want to build real
            furniture with confidence — joinery, tool setup, and finishing,
            taught the way I&apos;d teach a friend in my own shop.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded bg-brand px-7 py-3.5 text-[15px] font-bold text-ink"
          >
            Get notified at launch
          </Link>
        </div>
        <div className="aspect-[4/3] w-full">
          <ImageSlot placeholder="course preview photo" className="h-full w-full" />
        </div>
      </section>

      <section className="container-page section-px section-py border-t border-border">
        <h2 className="mb-8 text-[28px] font-bold">What it covers</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-10">
          {CURRICULUM.map((item) => (
            <div key={item.title}>
              <h3 className="mb-2.5 text-lg font-bold">{item.title}</h3>
              <p className="text-[15px] leading-[1.6] text-ink-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page section-px section-py border-t border-border text-center">
        <h2 className="mb-4 text-2xl font-bold">Want early access?</h2>
        <p className="mx-auto mb-6 max-w-[480px] text-base text-ink-muted">
          Leave your email and I&apos;ll let you know the moment it opens,
          along with a launch discount.
        </p>
        <form className="flex flex-wrap justify-center gap-3">
          <input
            type="email"
            placeholder="your@email.com"
            className="w-[280px] rounded border border-border bg-cream px-4 py-3 text-[15px] text-ink"
          />
          <button
            type="button"
            className="cursor-pointer rounded bg-brand px-6 py-3 text-[15px] font-bold text-ink"
          >
            Notify me
          </button>
        </form>
      </section>
    </>
  );
}
