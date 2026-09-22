import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ImageSlot from "@/components/ImageSlot";
import { SHOP_ENABLED } from "@/lib/config";
import { getAvailableShopProducts, type ShopProduct } from "@/lib/shopProducts";
import { createShopCheckoutSession } from "./actions";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Digital plans, guides, and a few finished pieces, straight from the shop.",
};

const PLACEHOLDER_BY_TYPE: Record<ShopProduct["type"], string> = {
  plan: "plan preview",
  ebook: "ebook cover",
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

      <section className="container-page section-px grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-6 gap-y-8 pb-[clamp(24px,5vw,64px)]">
        {products.map((product) => (
          <div key={product.id}>
            <div className="mb-3.5 aspect-[4/3]">
              <ImageSlot
                placeholder={PLACEHOLDER_BY_TYPE[product.type]}
                className="h-full w-full"
              />
            </div>
            <div className="mb-1 text-[15px] font-semibold">
              {product.title}
            </div>
            <div className="mb-3 text-sm text-ink-muted">
              {product.description} · €{product.priceEur}
            </div>
            <form action={createShopCheckoutSession}>
              <input type="hidden" name="productId" value={product.id} />
              <button
                type="submit"
                className="cursor-pointer rounded border border-border px-5 py-2.5 text-sm font-semibold text-ink"
              >
                Buy — €{product.priceEur}
              </button>
            </form>
          </div>
        ))}
      </section>
    </>
  );
}
