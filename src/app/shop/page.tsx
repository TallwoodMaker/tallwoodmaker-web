import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ImageSlot from "@/components/ImageSlot";
import { SHOP_ENABLED } from "@/lib/config";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Digital plans, guides, and a few finished pieces, straight from the shop.",
};

const PRODUCTS = [
  { title: "Plan: Dining Table", meta: "Digital PDF plan · $18" },
  { title: "Cutting Board Set", meta: "Finished product · $64" },
  { title: "Guide: Mortise & Tenon Joints", meta: "Digital video · $9" },
  { title: "Plan: Corner Shelf", meta: "Digital PDF plan · $12" },
  { title: "Wooden Clock", meta: "Finished product · $38" },
  { title: "Guide Bundle (5×)", meta: "Digital video · $29" },
];

export default function ShopPage() {
  if (!SHOP_ENABLED) {
    notFound();
  }

  return (
    <>
      <div className="h-2 bg-brand" />

      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)]">
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Shop
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          Digital plans, guides, and a few finished pieces, straight from the
          shop.
        </p>
      </section>

      <section className="container-page section-px grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-6 gap-y-8 pb-[clamp(24px,5vw,64px)]">
        {PRODUCTS.map((product) => (
          <div key={product.title}>
            <div className="mb-3.5 aspect-[4/3]">
              <ImageSlot placeholder="product photo" className="h-full w-full" />
            </div>
            <div className="mb-1 text-[15px] font-semibold">{product.title}</div>
            <div className="mb-3 text-sm text-ink-muted">{product.meta}</div>
            <a
              href="#"
              className="inline-block rounded border border-border px-5 py-2.5 text-sm font-semibold text-ink"
            >
              Buy
            </a>
          </div>
        ))}
      </section>
    </>
  );
}
