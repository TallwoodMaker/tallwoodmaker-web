import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { PROOF } from "@/config/proof";
import { formatProofCount } from "@/lib/format";

const CONTACT_EMAIL = "tom@tallwoodmaker.com";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/for-brands">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.forBrands" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/for-brands",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ForBrandsPage({
  params,
}: PageProps<"/[locale]/for-brands">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ForBrands />;
}

function ForBrands() {
  const t = useTranslations("forBrands");
  const tp = useTranslations("home.proof");

  // Same source as the homepage proof strip; unset (null) stats are skipped.
  const stats = [
    PROOF.followers !== null && {
      value: formatProofCount(PROOF.followers),
      label: tp("followers"),
    },
    PROOF.monthlyReach !== null && {
      value: formatProofCount(PROOF.monthlyReach),
      label: tp("monthlyReach"),
    },
    PROOF.years !== null && {
      value: tp("yearsValue", { count: PROOF.years }),
      label: tp("years"),
    },
    PROOF.workshopM2 !== null && {
      value: tp("workshopValue", { count: PROOF.workshopM2 }),
      label: tp("workshop"),
    },
  ].filter((s): s is { value: string; label: string } => !!s);

  return (
    <>
      <section className="container-page section-px flex flex-col gap-5 pb-12 pt-[clamp(40px,7vw,72px)]">
        <h1 className="max-w-[860px] text-[clamp(38px,5vw,64px)] font-bold leading-[1.03] tracking-[-0.02em]">
          {t("title")}
        </h1>
        <p className="max-w-[680px] text-[19px] leading-[1.55] text-ink-soft">
          {t("p1")}
        </p>
        <p className="max-w-[680px] text-[19px] leading-[1.55] text-ink-soft">
          {t("p2")}
        </p>
      </section>

      {stats.length > 0 && (
        <section aria-label={t("statsTitle")} className="border-y border-border bg-white">
          <div className="container-page section-px grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 py-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-display text-[36px] font-bold leading-tight">
                  {stat.value}
                </span>
                <span className="text-[14px] text-ink-muted">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container-page section-px py-[clamp(48px,7vw,80px)]">
        <div className="flex flex-col gap-4 rounded-[20px] bg-ink p-[clamp(24px,5vw,48px)] text-cream">
          <h2 className="text-[clamp(28px,3.2vw,42px)] font-bold tracking-[-0.02em]">
            {t("contactTitle")}
          </h2>
          <p className="max-w-[560px] text-[17px] leading-[1.55] text-on-dark">
            {t("contactText")}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex min-h-11 items-center rounded-[10px] bg-brand px-[22px] py-3 font-semibold text-ink hover:text-ink"
            >
              {t("emailCta")}
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex min-h-11 items-center text-[17px] font-medium text-cream underline-offset-4 hover:text-cream hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
