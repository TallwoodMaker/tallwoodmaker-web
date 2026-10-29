import type { Metadata } from "next";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { MEBCUT_URL, SHOP_PATH_PRODUCT_IDS, SHOP_STEPS } from "@/config/paths";
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
}: PageProps<"/[locale]/own-shop">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.ownShop" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/own-shop",
    title: t("title"),
    description: t("description"),
  });
}

export default async function OwnShopPage({
  params,
}: PageProps<"/[locale]/own-shop">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OwnShop />;
}

function OwnShop() {
  const t = useTranslations("ownShop");
  const tc = useTranslations("productCard");
  const locale = useLocale();

  const products = SHOP_PATH_PRODUCT_IDS.map((id) => getShopProduct(id)).filter(
    (p): p is ShopProduct => !!p && p.available
  );

  return (
    <>
      <section className="bg-ink text-cream">
        <div className="container-page section-px flex flex-wrap items-center gap-14 pb-[clamp(56px,8vw,88px)] pt-[clamp(48px,7vw,80px)]">
          <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-[22px]">
            <span className="self-start rounded-full bg-cream px-3.5 py-1.5 text-[13px] font-semibold text-ink">
              {t("badge")}
            </span>
            <h1 className="text-[clamp(38px,5vw,68px)] font-bold leading-[1.03] tracking-[-0.03em]">
              {t.rich("title", {
                mark: (chunks) => <span className="text-brand">{chunks}</span>,
              })}
            </h1>
            <p className="max-w-[620px] text-[19px] leading-[1.55] text-on-dark">
              {t("text")}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-3">
              <a
                href="#roadmap"
                className="inline-flex min-h-11 items-center rounded-[10px] bg-brand px-[22px] py-3 font-semibold text-ink hover:text-ink"
              >
                {t("ctaSteps")}
              </a>
              <a
                href="#products"
                className="inline-flex min-h-11 items-center rounded-[10px] border-[1.5px] border-cream px-[22px] py-3 font-semibold text-cream hover:text-cream"
              >
                {t("ctaTools")}
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] min-w-0 flex-[1_1_380px] overflow-hidden rounded-2xl">
            <Image
              src="/images/workshop/workshop-9.jpg"
              alt={t("photoAlt")}
              fill
              priority
              sizes="(max-width: 960px) 100vw, 520px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section
        id="roadmap"
        className="container-page section-px flex scroll-mt-4 flex-col gap-9 py-[clamp(56px,8vw,88px)]"
      >
        <div className="flex flex-col gap-2.5">
          <div className="eyebrow text-ink-muted">{t("roadmapEyebrow")}</div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-bold tracking-[-0.03em]">
            {t("roadmapTitle")}
          </h2>
        </div>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SHOP_STEPS.map((step, i) => {
            const number = String(i + 1).padStart(2, "0");
            const ownTool = step.key === "cutting";
            const product = step.productId
              ? getShopProduct(step.productId)
              : undefined;
            return (
              <li
                key={step.key}
                className={`flex flex-col gap-2.5 rounded-[14px] p-[26px] ${
                  ownTool
                    ? "border-[1.5px] border-ink bg-brand"
                    : "border border-border bg-white"
                }`}
              >
                <span
                  className={`font-mono text-[13px] uppercase ${ownTool ? "" : "text-ink-muted"}`}
                >
                  {ownTool
                    ? t("ownToolLabel", { number })
                    : t("stepLabel", { number })}
                </span>
                <h3 className="text-[22px] font-bold">
                  {t(`steps.${step.key}.title`)}
                </h3>
                <p className={`text-[15px] leading-[1.5] ${ownTool ? "" : "text-ink-soft"}`}>
                  {t(`steps.${step.key}.text`)}
                </p>
                {ownTool && (
                  <a
                    href={MEBCUT_URL}
                    target="_blank"
                    rel="noopener"
                    className="mt-auto inline-flex min-h-11 items-center self-start text-[15px] font-semibold underline-offset-4 hover:underline"
                  >
                    {t("steps.cutting.cta")}
                  </a>
                )}
                {product?.available && (
                  <Link
                    href={`/shop/${product.id}`}
                    className="mt-auto inline-flex min-h-11 items-center self-start text-[15px] font-semibold underline-offset-4 hover:underline"
                  >
                    {product.title} · {formatPrice(locale, product.priceEur)} →
                  </Link>
                )}
                {step.videoUrl && (
                  <a
                    href={step.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center self-start text-[15px] underline-offset-4 hover:underline"
                  >
                    {t("freeVideo")}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <section id="products" className="scroll-mt-4 border-y border-border bg-white">
        <div className="container-page section-px flex flex-col gap-8 py-[clamp(56px,8vw,88px)]">
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-bold tracking-[-0.03em]">
            {t("productsTitle")}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const regular = bundleRegularPrice(product);
              const featured = product.type === "bundle";
              return (
                <PathProductCard
                  key={product.id}
                  product={product}
                  featured={featured}
                  badge={
                    featured && regular !== null
                      ? tc("everything", { amount: regular - product.priceEur })
                      : undefined
                  }
                />
              );
            })}
            <a
              href={MEBCUT_URL}
              target="_blank"
              rel="noopener"
              className="group flex flex-col gap-2.5 rounded-[14px] border border-border bg-cream p-6 text-ink hover:text-ink"
            >
              <span className="font-mono text-[12px] uppercase text-ink-muted">
                {t("mebcut.label")}
              </span>
              <span className="font-display text-[22px] font-bold group-hover:underline">
                MebCut
              </span>
              <span className="text-[15px] text-ink-soft">{t("mebcut.text")}</span>
              <span className="mt-auto pt-2 text-[17px] font-semibold">
                {t("mebcut.price")}
              </span>
            </a>
          </div>
        </div>
      </section>

      <section id="waitlist" className="container-page section-px scroll-mt-4 py-[clamp(56px,8vw,88px)]">
        <div className="flex flex-wrap items-center gap-9 rounded-[20px] bg-ink p-[clamp(24px,5vw,48px)] text-cream">
          <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-3.5">
            <div className="eyebrow text-brand">{t("waitlist.eyebrow")}</div>
            <h2 className="text-[clamp(28px,3.2vw,42px)] font-bold leading-[1.08] tracking-[-0.03em]">
              {t("waitlist.title")}
            </h2>
            <p className="text-[17px] leading-[1.55] text-on-dark">
              {t("waitlist.text")}
            </p>
          </div>
          <div className="min-w-0 flex-[1_1_380px]">
            <LeadForm
              source="workshop-pricing"
              path="shop"
              submitLabel={t("waitlist.submit")}
              tone="dark"
            />
          </div>
        </div>
      </section>

      <div className="container-page section-px pb-8">
        <Link
          href="/build-at-home"
          className="inline-flex min-h-11 items-center text-[16px] font-semibold underline-offset-4 hover:underline"
        >
          {t("switchPath")}
        </Link>
      </div>
    </>
  );
}
