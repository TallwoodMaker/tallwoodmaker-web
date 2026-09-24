import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SHOP_ENABLED } from "@/lib/config";
import { getShopProduct } from "@/lib/shopProducts";
import ProductThumbnail from "../ProductThumbnail";
import AddToCartButton from "../AddToCartButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getShopProduct(id);
  if (!product) {
    return { title: "Shop" };
  }
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      type: "website",
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: product.imageUrl ? [product.imageUrl] : undefined,
    },
  };
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

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.imageUrl
      ? `https://www.tallwoodmaker.com${product.imageUrl}`
      : undefined,
    brand: { "@type": "Brand", name: "TallWoodMaker" },
    offers: {
      "@type": "Offer",
      url: `https://www.tallwoodmaker.com/shop/${product.id}`,
      priceCurrency: "EUR",
      price: product.priceEur,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="h-2 bg-brand" />

      <section className="container-page section-px py-[clamp(24px,5vw,64px)]">
        <Link
          href="/shop"
          className="mb-6 inline-block text-sm text-ink-muted hover:text-ink"
        >
          ← Back to shop
        </Link>

        <div className="grid gap-10 sm:grid-cols-[minmax(0,420px)_1fr]">
          <div className="relative aspect-[2/3]">
            <ProductThumbnail
              product={product}
              sizes="(min-width: 640px) 420px, 100vw"
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
            <div className="max-w-[280px]">
              <AddToCartButton productId={product.id} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
