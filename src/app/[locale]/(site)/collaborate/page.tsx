import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import PromoBanner from "@/components/PromoBanner";
import { PROOF } from "@/config/proof";
import { formatProofCount } from "@/lib/format";

const WHAT_BRANDS_GET = ["audience", "footage", "voice"] as const;


const PARTNERSHIP_OPTIONS = ["mention", "feature", "ongoing"] as const;

const PHOTOS = [
  { src: "/images/workshop/workshop-4.jpg", key: "panelSaw" },
  { src: "/images/workshop/workshop-2.jpg", key: "edgeBanding" },
  { src: "/images/workshop/workshop-8.jpg", key: "workshop" },
] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/collaborate">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.collaborate" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/collaborate",
    title: t("title"),
    description: t("description"),
  });
}

export default async function CollaboratePage({
  params,
}: PageProps<"/[locale]/collaborate">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("collaborate");

  // Same source as the homepage proof strip (src/config/proof.ts); a null
  // value hides that stat.
  const stats = [
    PROOF.followers !== null && {
      key: "followers",
      value: formatProofCount(PROOF.followers),
    },
    PROOF.monthlyReach !== null && {
      key: "reach",
      value: formatProofCount(PROOF.monthlyReach),
    },
    PROOF.years !== null && { key: "years", value: String(PROOF.years) },
  ].filter((s): s is { key: string; value: string } => !!s);

  return (
    <>
      <section className="container-page section-px pb-10 pt-[clamp(40px,7vw,72px)]">
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-bold leading-[1.05] tracking-[-0.03em]">
          {t("title")}
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          {t("intro")}
        </p>
      </section>

      <section className="container-page section-px pb-[clamp(24px,5vw,64px)]">
        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl">
          <Image
            src="/images/workshop/workshop-1.jpg"
            alt={t("heroAlt")}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </section>

      <PromoBanner title={t("philosophyTitle")} description={t("philosophyText")} />
      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] pt-12">
        <p className="max-w-[640px] text-[17px] leading-[1.75] text-ink-soft">
          {t("story")}
        </p>
      </section>

      {stats.length > 0 && (
        <>
          <PromoBanner title={t("numbersTitle")} description={t("numbersText")} />
          <section className="container-page section-px pb-[clamp(24px,5vw,64px)] pt-12">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.key}
                  className="rounded-xl border border-border p-6 text-center"
                >
                  <div className="mb-1 font-display text-[clamp(28px,4vw,36px)] font-bold leading-none">
                    {stat.value}
                  </div>
                  <div className="text-[13px] font-semibold uppercase tracking-[0.03em] text-ink-muted">
                    {t(`stats.${stat.key}`)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <PromoBanner title={t("gettingTitle")} description={t("gettingText")} />
      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] pt-12">
        <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {PHOTOS.map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={photo.src}
                alt={t(`photoAlts.${photo.key}`)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-8">
          {WHAT_BRANDS_GET.map((key) => (
            <div key={key} className="rounded-xl border border-border p-8">
              <h3 className="mb-3 text-[19px] font-bold">
                {t(`benefits.${key}.title`)}
              </h3>
              <p className="text-[15px] leading-[1.6] text-ink-muted">
                {t(`benefits.${key}.text`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <PromoBanner title={t("optionsTitle")} description={t("optionsText")} />
      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] pt-12">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {PARTNERSHIP_OPTIONS.map((key) => (
            <div
              key={key}
              className="flex flex-col gap-3 rounded-xl border border-border p-6"
            >
              <h3 className="text-[17px] font-bold">{t(`options.${key}.title`)}</h3>
              <p className="flex-1 text-[14px] leading-[1.6] text-ink-muted">
                {t(`options.${key}.text`)}
              </p>
              <div className="text-[15px] font-bold text-ink">{t("quote")}</div>
            </div>
          ))}
        </div>
      </section>

      <PromoBanner title={t("talkTitle")} description={t("talkText")} />
      <section className="container-page section-px pb-[clamp(24px,5vw,64px)] pt-12 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center rounded-[10px] bg-brand px-7 py-3.5 text-[15px] font-bold text-ink hover:text-ink"
          >
            {t("talkCta")}
          </Link>
          <a
            href="mailto:tom@tallwoodmaker.com"
            className="text-[15px] font-semibold"
          >
            tom@tallwoodmaker.com
          </a>
        </div>
      </section>
    </>
  );
}
