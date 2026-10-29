import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SHOP_ENABLED } from "@/lib/config";
import { getShopProduct } from "@/lib/shopProducts";
import { formatPrice } from "@/lib/format";
import { Link } from "@/i18n/navigation";
import { localizedUrl, pageMetadata, SITE_URL } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import ProductThumbnail from "../ProductThumbnail";
import AddToCartButton from "../AddToCartButton";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/shop/[id]">): Promise<Metadata> {
  const { locale, id } = await params;
  const product = getShopProduct(id);
  if (!product) {
    const t = await getTranslations({ locale, namespace: "meta.shop" });
    return { title: t("title") };
  }
  const t = await getTranslations({ locale, namespace: "products" });
  const description = t(`${product.id}.description`);
  const base = pageMetadata({
    locale: locale as Locale,
    path: `/shop/${product.id}`,
    title: product.title,
    description,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: product.imageUrl ? [product.imageUrl] : undefined,
    },
  };
}

export default async function ShopProductPage({
  params,
}: PageProps<"/[locale]/shop/[id]">) {
  if (!SHOP_ENABLED) {
    notFound();
  }

  const { locale, id } = await params;
  setRequestLocale(locale);
  const product = getShopProduct(id);
  if (!product || !product.available) {
    notFound();
  }

  const t = await getTranslations("product");
  const tp = await getTranslations("products");
  const tc = await getTranslations("productCard");
  const description = tp(`${product.id}.description`);
  const whatYouLearn = tp.raw(`${product.id}.whatYouLearn`) as string[];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description,
    image: product.imageUrl ? `${SITE_URL}${product.imageUrl}` : undefined,
    brand: { "@type": "Brand", name: "TallWoodMaker" },
    // The PDF itself is English in every language version of the page.
    inLanguage: "en",
    offers: {
      "@type": "Offer",
      url: localizedUrl(locale as Locale, `/shop/${product.id}`),
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

      <section className="container-page section-px py-[clamp(32px,6vw,64px)]">
        <Link
          href="/shop"
          className="mb-6 inline-flex min-h-11 items-center text-sm text-ink-muted hover:text-ink"
        >
          {t("back")}
        </Link>

        <div className="grid gap-10 sm:grid-cols-[minmax(0,420px)_1fr]">
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl">
            <ProductThumbnail
              product={product}
              sizes="(min-width: 640px) 420px, 100vw"
            />
          </div>

          <div>
            <h1 className="mb-3 text-[clamp(28px,4vw,44px)] font-bold leading-[1.1] tracking-[-0.02em]">
              {product.title}
            </h1>
            {locale !== "en" && (
              <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-sand px-3 py-1.5 text-[13px] font-medium text-ink">
                <span aria-hidden="true" className="font-mono text-[12px]">
                  EN
                </span>
                {tc("pdfInEnglish")} · {t("pdfNote")}
              </p>
            )}
            <p className="mb-6 max-w-[560px] text-[17px] leading-[1.6] text-ink-soft">
              {description}
            </p>

            {whatYouLearn.length > 0 && (
              <div className="mb-7 max-w-[560px]">
                <h2 className="eyebrow mb-3 font-mono text-ink-muted">
                  {t("whatYouLearn")}
                </h2>
                <ul className="grid gap-2.5">
                  {whatYouLearn.map((line) => {
                    const [lead, ...rest] = line.split(" — ");
                    return (
                      <li
                        key={line}
                        className="flex gap-2.5 text-[15px] leading-[1.6] text-ink-soft"
                      >
                        <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                        <span>
                          <strong className="font-semibold text-ink">{lead}</strong>
                          {rest.length > 0 ? ` — ${rest.join(" — ")}` : ""}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="mb-6 font-display text-[28px] font-bold">
              {formatPrice(locale, product.priceEur)}
            </div>
            <div className="max-w-[280px]">
              <AddToCartButton productId={product.id} />
            </div>
          </div>
        </div>

        {product.includes && product.includes.length > 0 && (
          <div className="mt-12 border-t border-border pt-10">
            <h2 className="eyebrow mb-4 font-mono text-ink-muted">
              {t("whatsIncluded")}
            </h2>
            <div className="grid max-w-[560px] gap-4">
              {product.includes.map((includedId) => {
                const includedProduct = getShopProduct(includedId);
                if (!includedProduct) return null;
                return (
                  <Link
                    key={includedId}
                    href={`/shop/${includedId}`}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-white p-4 text-ink hover:border-ink hover:text-ink"
                  >
                    <div className="relative aspect-[2/3] w-16 flex-none overflow-hidden rounded">
                      <ProductThumbnail product={includedProduct} sizes="64px" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-0.5 font-semibold group-hover:underline">
                        {includedProduct.title}
                      </div>
                      <div className="text-sm text-ink-muted">
                        {t("onItsOwn", {
                          price: formatPrice(locale, includedProduct.priceEur),
                        })}
                      </div>
                    </div>
                    <span className="text-sm text-ink-muted">{t("view")}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {product.samplePageUrl && (
          <div className="mt-12 border-t border-border pt-10">
            <h2 className="eyebrow mb-4 font-mono text-ink-muted">
              {product.type === "ebook" ? t("sampleEbook") : t("samplePlan")}
            </h2>
            <div className="relative aspect-[210/297] w-full max-w-[420px] overflow-hidden rounded-xl border border-border">
              <Image
                src={product.samplePageUrl}
                alt={t("sampleAlt", { title: product.title })}
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
