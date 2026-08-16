import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Benefits",
  description:
    "Discount codes and affiliate deals for the tools and materials used in the TallWoodMaker workshop.",
};

type Deal = {
  brand: string;
  description: string;
  code: string;
  url: string;
};

// No live partnerships yet — add entries here as they're set up.
const DEALS: Deal[] = [];

export default function BenefitsPage() {
  return (
    <>
      <div className="h-2 bg-brand" />

      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)]">
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Benefits
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          Tools and materials I actually use in the workshop — with discount
          codes for my community.
        </p>
      </section>

      <section className="container-page section-px pb-[clamp(24px,5vw,64px)]">
        {DEALS.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
            {DEALS.map((deal) => (
              <div
                key={deal.brand}
                className="flex flex-col gap-4 rounded-md border border-border p-6"
              >
                <div>
                  <div className="mb-1 text-base font-bold">{deal.brand}</div>
                  <div className="text-sm text-ink-muted">
                    {deal.description}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="rounded bg-brand px-3.5 py-2 text-sm font-bold text-ink">
                    {deal.code}
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
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-ink/30 p-12 text-center">
            <p className="text-[17px] font-semibold text-ink">
              More deals coming soon
            </p>
            <p className="mx-auto mt-2 max-w-[420px] text-[15px] text-ink-muted">
              I&apos;m putting together discount codes for the tools and
              materials I actually use in the shop. Check back soon.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
