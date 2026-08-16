import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Benefits",
  description:
    "Discount codes and affiliate deals for the tools and materials used in the TallWoodMaker workshop.",
};

type Deal = {
  brand: string;
  category: string;
  description: string;
  discount: string;
  code?: string;
  url: string;
};

const DEALS: Deal[] = [
  {
    brand: "SpeTool",
    category:
      "Woodworking tools — CNC router bits, panel clamps, router sleds, dust collection accessories",
    description:
      "Precision router bits and workshop accessories used in real client projects — not just reviewed, actually used.",
    discount: "10% off your order",
    url: "https://spetools.com/?ref=TALLWOODMAKER",
  },
];

export default function BenefitsPage() {
  return (
    <>
      <div className="h-2 bg-brand" />

      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)]">
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Benefits
        </h1>
        <p className="mb-4 max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          Tools and materials I actually use in the workshop — with discount
          codes for my community.
        </p>
        <p className="max-w-[560px] text-[15px] leading-[1.6] text-ink-muted">
          These are the brands that show up in real client work, not
          sponsors I tried once for a video. If it&apos;s listed here,
          it&apos;s because it earned a place in the shop first — the
          discount is a real perk for the people who follow along, not
          another ad.
        </p>
      </section>

      <section className="container-page section-px pb-[clamp(24px,5vw,64px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
          {DEALS.map((deal) => (
            <div
              key={deal.brand}
              className="flex flex-col gap-4 rounded-md border border-border p-6"
            >
              <div>
                <div className="mb-1 text-base font-bold">{deal.brand}</div>
                <div className="mb-2 text-[13px] font-semibold uppercase tracking-[0.03em] text-ink-muted">
                  {deal.category}
                </div>
                <div className="text-sm text-ink-muted">
                  {deal.description}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="rounded bg-brand px-3.5 py-2 text-sm font-bold text-ink">
                  {deal.code ?? deal.discount}
                </div>
                <a
                  href={deal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] font-semibold"
                >
                  Visit site →
                </a>
              </div>
              {!deal.code && (
                <div className="text-[13px] text-ink-muted">
                  No code needed — the discount applies automatically through
                  the link above.
                </div>
              )}
            </div>
          ))}

          <div className="flex flex-col justify-center gap-2 rounded-md border border-dashed border-ink/30 p-6 text-center">
            <p className="text-[15px] font-semibold text-ink">
              More deals coming soon
            </p>
            <p className="text-[13px] text-ink-muted">
              I&apos;m adding more discount codes for the tools and materials
              I actually use in the shop. Check back soon.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
