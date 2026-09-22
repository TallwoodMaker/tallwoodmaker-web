import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageSlot from "@/components/ImageSlot";
import { SHOP_ENABLED } from "@/lib/config";
import { getShopProduct, type ShopProduct } from "@/lib/shopProducts";
import { createShopCheckoutSession } from "../actions";

const PLACEHOLDER_BY_TYPE: Record<ShopProduct["type"], string> = {
  plan: "plan preview",
  ebook: "ebook cover",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getShopProduct(id);
  return { title: product?.title ?? "Shop" };
}

export default async function ShopProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!SHOP_ENABLED) {
    notFound();
  }

  const { id } = await params;
  const product = getShopProduct(id);
  if (!product || !product.available) {
    notFound();
  }

  return (
    <>
      <div className="h-2 bg-brand" />

      <section className="container-page section-px py-[clamp(24px,5vw,64px)]">
        <Link
          href="/shop"
          className="mb-6 inline-block text-sm text-ink-muted hover:text-ink"
        >
          ← Back to shop
        </Link>

        <div className="grid gap-10 sm:grid-cols-[minmax(0,420px)_1fr]">
          <div className="aspect-[4/3]">
            <ImageSlot
              placeholder={PLACEHOLDER_BY_TYPE[product.type]}
              className="h-full w-full"
            />
          </div>

          <div>
            <h1 className="mb-3 text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
              {product.title}
            </h1>
            <p className="mb-6 max-w-[480px] text-[17px] leading-[1.6] text-ink-muted">
              {product.description}
            </p>
            <div className="mb-6 text-2xl font-bold">€{product.priceEur}</div>
            <form action={createShopCheckoutSession}>
              <input type="hidden" name="productId" value={product.id} />
              <button
                type="submit"
                className="cursor-pointer rounded bg-brand px-7 py-3.5 text-[15px] font-bold text-ink"
              >
                Buy — €{product.priceEur}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
