import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { isValidUnsubscribeToken } from "@/lib/unsubscribe";
import UnsubscribeForm from "./UnsubscribeForm";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/unsubscribe">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.unsubscribe" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/unsubscribe",
    title: t("title"),
    noindex: true,
  });
}

/**
 * Target of the unsubscribe link in every lead email. Opening the link
 * only shows a button; the unsubscribe itself is a POST (server action), so
 * email link scanners that prefetch the URL can't unsubscribe anyone.
 */
export default async function UnsubscribePage({
  params,
  searchParams,
}: PageProps<"/[locale]/unsubscribe">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("unsubscribe");
  const raw = (await searchParams).token;
  const token = typeof raw === "string" ? raw : "";
  const valid = await isValidUnsubscribeToken(token);

  return (
    <section className="container-page section-px flex max-w-[640px] flex-col gap-5 py-[clamp(48px,8vw,96px)]">
      <h1 className="text-[clamp(32px,4.5vw,48px)] font-bold tracking-[-0.02em]">
        {t("title")}
      </h1>
      {valid ? (
        <UnsubscribeForm token={token} />
      ) : (
        <p className="text-[17px] leading-[1.6] text-ink-soft">{t("invalid")}</p>
      )}
    </section>
  );
}
