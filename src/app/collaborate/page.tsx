import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Collaborate",
  description:
    "Ways to work together — brand partnerships, sponsored builds, and discount codes for the community.",
};

const OFFERINGS = [
  {
    title: "Sponsored builds",
    description:
      "Feature your tools or materials in a full build video, start to finish.",
  },
  {
    title: "Brand partnerships",
    description:
      "Longer-term collaborations across YouTube, Instagram, and TikTok.",
  },
  {
    title: "Affiliate & discount codes",
    description: "A code for my audience, tracked and reported back to you.",
  },
];

const DISCOUNT_CODES = [
  { brand: "Brand Name", offer: "10% off tools", code: "TALLWOOD10" },
  { brand: "Brand Name", offer: "15% off finishes", code: "TALLWOOD15" },
  { brand: "Brand Name", offer: "Free shipping", code: "TALLWOOD" },
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
          Ways to work together — brand partnerships, sponsored builds, and
          discount codes for the community.
        </p>
      </section>

      <section className="container-page section-px grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 pb-[clamp(24px,5vw,64px)]">
        {OFFERINGS.map((item) => (
          <div key={item.title} className="rounded-md border border-border p-8">
            <h3 className="mb-3 text-[19px] font-bold">{item.title}</h3>
            <p className="text-[15px] leading-[1.6] text-ink-muted">
              {item.description}
            </p>
          </div>
        ))}
      </section>

      <section className="container-page section-px border-t border-border pb-[clamp(24px,5vw,64px)] pt-12">
        <h2 className="mb-2 text-[28px] font-bold">
          Discount codes for my community
        </h2>
        <p className="mb-8 max-w-[560px] text-base text-ink-muted">
          Codes I share with my subscribers for brands I actually use in the
          shop.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
          {DISCOUNT_CODES.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 rounded-md border border-border p-6"
            >
              <div>
                <div className="mb-1 text-base font-bold">{item.brand}</div>
                <div className="text-sm text-ink-muted">{item.offer}</div>
              </div>
              <div className="rounded bg-brand px-3.5 py-2 text-sm font-bold text-ink">
                {item.code}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] text-center">
        <Link
          href="/contact"
          className="inline-block rounded bg-brand px-7 py-3.5 text-[15px] font-bold text-ink"
        >
          Start a conversation
        </Link>
      </section>
    </>
  );
}
