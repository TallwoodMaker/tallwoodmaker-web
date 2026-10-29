import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SHOP_ENABLED } from "@/lib/config";
import { SHOP_CATEGORIES, getAvailableShopProducts } from "@/lib/shopProducts";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import ShopGrid from "./ShopGrid";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/shop">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.shop" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/shop",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ShopPage({ params }: PageProps<"/[locale]/shop">) {
  if (!SHOP_ENABLED) {
    notFound();
  }
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("shop");

  const products = getAvailableShopProducts();

  return (
    <>
      <section className="container-page section-px flex flex-col gap-4 pb-10 pt-[clamp(40px,7vw,72px)]">
        <h1 className="text-[clamp(36px,5vw,56px)] font-bold leading-[1.05] tracking-[-0.02em]">
          {t("title")}
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-soft">
          {t("text")}
        </p>
        <p className="text-[14px] text-ink-muted">{t("note")}</p>
      </section>

      <section className="container-page section-px pb-[clamp(48px,7vw,80px)]">
        <ShopGrid products={products} categories={SHOP_CATEGORIES} />
      </section>
    </>
  );
}
