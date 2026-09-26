import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
            <p className="mb-6 max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
              {product.description}
            </p>

            {product.whatYouLearn && product.whatYouLearn.length > 0 && (
              <div className="mb-7 max-w-[560px]">
                <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.05em] text-ink-muted">
                  What you&apos;ll learn
                </h2>
                <ul className="grid gap-2.5">
                  {product.whatYouLearn.map((line) => {
                    const [lead, ...rest] = line.split(" — ");
                    return (
                      <li
                        key={line}
                        className="flex gap-2.5 text-[15px] leading-[1.6] text-ink-muted"
                      >
                        <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                        <span>
                          <strong className="font-bold text-ink">
                            {lead}
                          </strong>
                          {rest.length > 0 ? ` — ${rest.join(" — ")}` : ""}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="mb-6 text-2xl font-bold">€{product.priceEur}</div>
            <div className="max-w-[280px]">
              <AddToCartButton productId={product.id} />
            </div>
          </div>
        </div>

        {product.samplePageUrl && (
          <div className="mt-12 border-t border-border pt-10">
            <h2 className="mb-4 text-[13px] font-bold uppercase tracking-[0.05em] text-ink-muted">
              A sample page from the {product.type === "ebook" ? "ebook" : "plan"}
            </h2>
            <div className="relative aspect-[210/297] w-full max-w-[420px] overflow-hidden rounded-md border border-border">
              <Image
                src={product.samplePageUrl}
                alt={`Sample page from ${product.title}`}
                fill
                className="object-cover"
                sizes="420px"
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}
