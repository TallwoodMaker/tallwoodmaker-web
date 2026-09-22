import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SHOP_ENABLED } from "@/lib/config";
import { SHOP_CATEGORIES, getAvailableShopProducts } from "@/lib/shopProducts";
import ShopGrid from "./ShopGrid";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Digital plans, guides, and a few finished pieces, straight from the shop.",
};

export default function ShopPage() {
  if (!SHOP_ENABLED) {
    notFound();
  }

  const products = getAvailableShopProducts();

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

      <section className="container-page section-px pb-[clamp(24px,5vw,64px)]">
        <ShopGrid products={products} categories={SHOP_CATEGORIES} />
      </section>
    </>
  );
}
