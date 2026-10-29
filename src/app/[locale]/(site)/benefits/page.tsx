import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

type Deal = {
  /** Message key under benefits.deals (category/text/discount copy). */
  key: string;
  brand: string;
  code?: string;
  url: string;
};

const DEALS: Deal[] = [
  {
    key: "spetool",
    brand: "SpeTool",
    url: "https://spetools.com/?ref=TALLWOODMAKER",
  },
];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/benefits">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.benefits" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/benefits",
    title: t("title"),
    description: t("description"),
  });
}

export default async function BenefitsPage({
  params,
}: PageProps<"/[locale]/benefits">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("benefits");

  return (
    <>
      <section className="container-page section-px pb-10 pt-[clamp(40px,7vw,72px)]">
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-bold leading-[1.05] tracking-[-0.03em]">
          {t("title")}
        </h1>
        <p className="mb-4 max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          {t("intro")}
        </p>
        <p className="max-w-[560px] text-[15px] leading-[1.6] text-ink-muted">
          {t("text")}
        </p>
      </section>

      <section className="container-page section-px pb-[clamp(48px,7vw,80px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
          {DEALS.map((deal) => (
            <div
              key={deal.key}
              className="flex flex-col gap-4 rounded-xl border border-border bg-white p-6"
            >
              <div>
                <div className="mb-1 text-base font-bold">{deal.brand}</div>
                <div className="mb-2 text-[13px] font-semibold uppercase tracking-[0.03em] text-ink-muted">
                  {t(`deals.${deal.key}.category`)}
                </div>
                <div className="text-sm text-ink-muted">
                  {t(`deals.${deal.key}.text`)}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="rounded bg-brand px-3.5 py-2 text-sm font-bold text-ink">
                  {deal.code ?? t(`deals.${deal.key}.discount`)}
                </div>
                <a
                  href={deal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-[15px] font-semibold"
                >
                  {t("visit")}
                </a>
              </div>
              {!deal.code && (
                <div className="text-[13px] text-ink-muted">{t("noCode")}</div>
              )}
            </div>
          ))}

          <div className="flex flex-col justify-center gap-2 rounded-xl border border-dashed border-ink/30 p-6 text-center">
            <p className="text-[15px] font-semibold text-ink">{t("moreTitle")}</p>
            <p className="text-[13px] text-ink-muted">{t("moreText")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
