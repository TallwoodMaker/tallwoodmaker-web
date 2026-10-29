import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SHOP_ENABLED } from "@/lib/config";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import CartPageClient from "./CartPageClient";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cart">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.cart" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/cart",
    title: t("title"),
    noindex: true,
  });
}

export default async function CartPage({ params }: PageProps<"/[locale]/cart">) {
  if (!SHOP_ENABLED) {
    notFound();
  }
  const { locale } = await params;
  setRequestLocale(locale);

  return <CartPageClient />;
}
