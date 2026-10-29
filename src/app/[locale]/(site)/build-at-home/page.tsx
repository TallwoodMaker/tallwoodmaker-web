import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { HOME_PATH_PRODUCT_IDS, HOME_STEPS } from "@/config/paths";
import { formatPrice } from "@/lib/format";
import {
  bundleRegularPrice,
  getShopProduct,
  type ShopProduct,
} from "@/lib/shopProducts";
import { PathProductCard } from "@/components/site/ProductCards";
import LeadForm from "@/components/LeadForm";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/build-at-home">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.buildAtHome" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/build-at-home",
    title: t("title"),
    description: t("description"),
  });
}

export default async function BuildAtHomePage({
  params,
}: PageProps<"/[locale]/build-at-home">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BuildAtHome />;
}

function BuildAtHome() {
  const t = useTranslations("buildAtHome");
  const tc = useTranslations("productCard");
  const locale = useLocale();

  const products = HOME_PATH_PRODUCT_IDS.map((id) => getShopProduct(id)).filter(
    (p): p is ShopProduct => !!p && p.available
  );

  return (
    <>
      {/* No suitable "assembled at home" photo yet, so the hero is text-only
          (per the brief: hide the photo column rather than show a stand-in). */}
      <section className="container-page section-px pb-16 pt-[clamp(40px,7vw,72px)]">
        <div className="flex max-w-[860px] flex-col gap-[22px]">
          <span className="self-start rounded-full bg-brand px-3.5 py-1.5 text-[13px] font-semibold">
            {t("badge")}
          </span>
          <h1 className="text-[clamp(38px,5vw,68px)] font-bold leading-[1.03] tracking-[-0.02em]">
            {t("title")}
          </h1>
          <p className="max-w-[600px] text-[19px] leading-[1.55] text-ink-soft">
            {t("text")}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-3">
            <a
              href="#roadmap"
              className="inline-flex min-h-11 items-center rounded-[10px] bg-ink px-[22px] py-3 font-semibold text-cream hover:text-cream"
            >
              {t("ctaSteps")}
            </a>
            <a
              href="#products"
              className="inline-flex min-h-11 items-center rounded-[10px] border-[1.5px] border-ink px-[22px] py-3 font-semibold"
            >
              {t("ctaPlans")}
            </a>
          </div>
        </div>
      </section>

      <section
        id="roadmap"
        className="scroll-mt-4 border-y border-border bg-white"
      >
        <div className="container-page section-px flex flex-col gap-9 py-[clamp(56px,8vw,88px)]">
          <div className="flex flex-col gap-2.5">
            <div className="eyebrow text-ink-muted">{t("roadmapEyebrow")}</div>
            <h2 className="text-[clamp(30px,3.4vw,46px)] font-bold tracking-[-0.02em]">
              {t("roadmapTitle")}
            </h2>
          </div>
          <ol className="flex flex-col gap-3.5">
            {HOME_STEPS.map((step, i) => {
              const product = step.productId
                ? getShopProduct(step.productId)
                : undefined;
              const showProduct = product?.available;
              return (
                <li
                  key={step.key}
                  className="flex flex-wrap items-center gap-5 rounded-[14px] border border-border bg-cream p-6"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-xl bg-brand font-display text-[22px] font-bold"
                  >
                    {i + 1}
                  </span>
                  <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-1">
                    <h3 className="text-[22px] font-bold">
                      <span className="sr-only">{i + 1}. </span>
                      {t(`steps.${step.key}.title`)}
                    </h3>
                    <p className="text-[15px] text-ink-soft">
                      {t(`steps.${step.key}.text`)}
                    </p>
                  </div>
                  {(step.videoUrl || showProduct) && (
                    <div className="flex flex-wrap gap-2.5">
                      {step.videoUrl && (
                        <a
                          href={step.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center rounded-lg border border-ink px-3.5 text-[14px]"
                        >
                          {t("freeVideo")}
                        </a>
                      )}
                      {showProduct && product && (
                        <Link
                          href={`/shop/${product.id}`}
                          className="inline-flex min-h-11 items-center rounded-lg bg-ink px-3.5 text-[14px] font-semibold text-cream hover:text-cream"
                        >
                          {product.title} · {formatPrice(locale, product.priceEur)}
                        </Link>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {products.length > 0 && (
        <section
          id="products"
          className="container-page section-px flex scroll-mt-4 flex-col gap-8 py-[clamp(56px,8vw,88px)]"
        >
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-bold tracking-[-0.02em]">
            {t("productsTitle")}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => {
              const regular = bundleRegularPrice(product);
              const featured = i === 0 && product.type === "bundle";
              return (
                <PathProductCard
                  key={product.id}
                  product={product}
                  featured={featured}
                  badge={
                    featured && regular !== null
                      ? tc("bestStart", { amount: regular - product.priceEur })
                      : undefined
                  }
                />
              );
            })}
          </div>
        </section>
      )}

      <section id="list" className="bg-brand">
        <div className="container-page section-px flex flex-wrap items-center justify-between gap-8 py-16">
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-2.5">
            <h2 className="text-[clamp(28px,3vw,40px)] font-bold tracking-[-0.02em]">
              {t("listTitle")}
            </h2>
            <p className="text-[18px]">{t("listText")}</p>
          </div>
          <div className="min-w-0 flex-[1_1_420px]">
            <LeadForm source="starter-list" path="home" submitLabel={t("listSubmit")} />
          </div>
        </div>
      </section>

      <div className="container-page section-px py-8">
        <Link
          href="/own-shop"
          className="inline-flex min-h-11 items-center text-[16px] font-semibold underline-offset-4 hover:underline"
        >
          {t("switchPath")}
        </Link>
      </div>
    </>
  );
}
