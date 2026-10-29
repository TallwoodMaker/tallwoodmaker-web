import type { Metadata } from "next";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { SHOP_ENABLED } from "@/lib/config";
import { getShopProduct, type ShopProduct } from "@/lib/shopProducts";
import { HOME_FEATURED_PRODUCT_IDS } from "@/config/paths";
import { PROOF, BRAND_LOGOS } from "@/config/proof";
import { formatCompact } from "@/lib/format";
import PathCards from "@/components/site/PathCards";
import { FeaturedProductCard } from "@/components/site/ProductCards";
import LeadForm from "@/components/LeadForm";

// Six shop photos from the About gallery for the "Real jobs" strip. The
// section hides itself if fewer than 3 are listed here.
const REAL_JOB_PHOTOS = [
  { src: "/images/workshop/workshop-4.jpg", altKey: "panelSaw" },
  { src: "/images/workshop/workshop-3.jpg", altKey: "edgeBander" },
  { src: "/images/workshop/workshop-1.jpg", altKey: "cnc" },
  { src: "/images/workshop/workshop-11.jpg", altKey: "edgeBanderLine" },
  { src: "/images/workshop/workshop-8.jpg", altKey: "workshopWide" },
  { src: "/images/workshop/workshop-10.jpg", altKey: "shopFloor" },
] as const;

const WHY_ITEMS = ["board", "order", "walls", "charge"] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/",
    title: t("title"),
    absoluteTitle: true,
    description: t("description"),
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const featured = HOME_FEATURED_PRODUCT_IDS.map((id) => getShopProduct(id)).filter(
    (p): p is ShopProduct => !!p && p.available
  );

  return (
    <>
      <Hero />
      <ProofStrip />
      <WhySection />
      <TwoPaths />
      <LeadMagnet />
      {SHOP_ENABLED && featured.length > 0 && <Plans products={featured} />}
      {REAL_JOB_PHOTOS.length >= 3 && <RealJobs />}
      <AboutTeaser />
    </>
  );
}

function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="container-page section-px flex flex-wrap items-center gap-14 pb-14 pt-[clamp(40px,7vw,72px)]">
      <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-6">
        <div className="eyebrow text-ink-muted">{t("eyebrow")}</div>
        <h1 className="text-[clamp(40px,5.6vw,76px)] font-bold leading-[1.02] tracking-[-0.02em]">
          {t.rich("title", {
            mark: (chunks) => <span className="highlight">{chunks}</span>,
          })}
        </h1>
        <p className="max-w-[560px] text-[19px] leading-[1.55] text-ink-soft">
          {t("text")}
        </p>
        <div className="mt-2">
          <PathCards />
        </div>
      </div>
      <div className="relative min-w-0 flex-[1_1_420px]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
          <Image
            src="/images/workshop/hero-panelsaw-centered.jpg"
            alt={t("photoAlt")}
            fill
            priority
            sizes="(max-width: 960px) 100vw, 560px"
            className="object-cover"
          />
        </div>
        <svg
          aria-hidden="true"
          width="34"
          height="34"
          viewBox="0 0 34 34"
          className="absolute -right-3 -top-3 hidden sm:block"
        >
          <circle cx="17" cy="17" r="9" fill="none" stroke="#141413" strokeWidth="1.5" />
          <path d="M17 0v34M0 17h34" stroke="#141413" strokeWidth="1.5" />
        </svg>
        <div className="absolute bottom-4 left-4 flex flex-col gap-0.5 rounded-[10px] bg-white px-3.5 py-3">
          <span className="text-[15px] font-semibold">{t("nameTag")}</span>
          <span className="text-[13px] text-ink-muted">{t("nameTagRole")}</span>
        </div>
        <div className="absolute bottom-4 right-4 rounded-full bg-ink px-3.5 py-2 text-[13px] font-medium text-cream">
          {t("badge")}
        </div>
      </div>
    </section>
  );
}

function ProofStrip() {
  const t = useTranslations("home.proof");
  const locale = useLocale();

  const stats = [
    PROOF.followers !== null && {
      key: "followers",
      value: formatCompact(locale, PROOF.followers),
      label: t("followers"),
    },
    PROOF.monthlyReach !== null && {
      key: "monthlyReach",
      value: formatCompact(locale, PROOF.monthlyReach),
      label: t("monthlyReach"),
    },
    PROOF.years !== null && {
      key: "years",
      value: t("yearsValue", { count: PROOF.years }),
      label: t("years"),
    },
    PROOF.workshopM2 !== null && {
      key: "workshop",
      value: t("workshopValue", { count: PROOF.workshopM2 }),
      label: t("workshop"),
    },
  ].filter((s): s is { key: string; value: string; label: string } => !!s);

  if (stats.length === 0 && BRAND_LOGOS.length === 0) return null;

  return (
    <section
      aria-label={t("label")}
      className="border-y border-border bg-white"
    >
      {stats.length > 0 && (
        <div className="container-page section-px grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 py-8">
          {stats.map((stat) => (
            <div key={stat.key} className="flex flex-col gap-1">
              <span className="font-display text-[36px] font-bold leading-tight">
                {stat.value}
              </span>
              <span className="text-[14px] text-ink-muted">{stat.label}</span>
            </div>
          ))}
        </div>
      )}
      {BRAND_LOGOS.length > 0 && (
        <div className="container-page section-px flex flex-wrap items-center gap-7 pb-7">
          <span className="eyebrow text-[12px] text-ink-muted">
            {t("workedWith")}
          </span>
          {BRAND_LOGOS.map((logo) => (
            <Image
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
            />
          ))}
        </div>
      )}
    </section>
  );
}

function WhySection() {
  const t = useTranslations("home.why");

  return (
    <section className="bg-ink text-cream">
      <div className="container-page section-px section-py flex flex-col gap-12">
        <div className="flex max-w-[820px] flex-col gap-[18px]">
          <div className="eyebrow text-brand">{t("eyebrow")}</div>
          <h2 className="text-[clamp(32px,4vw,56px)] font-bold leading-[1.05] tracking-[-0.02em]">
            {t("title")}
          </h2>
          <p className="text-[18px] leading-[1.6] text-on-dark">{t("text")}</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {WHY_ITEMS.map((key, i) => (
            <div
              key={key}
              className="flex flex-col gap-2.5 rounded-xl border border-line-dark p-6"
            >
              <span className="font-mono text-[13px] text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[21px] font-bold">{t(`items.${key}.title`)}</h3>
              <p className="text-[15px] leading-[1.5] text-on-dark">
                {t(`items.${key}.text`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CheckList({ points, dark = false }: { points: string[]; dark?: boolean }) {
  return (
    <ul className={`flex flex-col gap-3 text-[16px] ${dark ? "text-[#e8e4d8]" : ""}`}>
      {points.map((point) => (
        <li key={point} className="flex gap-2.5">
          <span aria-hidden="true">✓</span>
          {point}
        </li>
      ))}
    </ul>
  );
}

function TwoPaths() {
  const t = useTranslations("home.paths");
  const tp = useTranslations("paths");

  return (
    <section className="container-page section-px section-py flex flex-col gap-10">
      <h2 className="text-[clamp(30px,3.6vw,48px)] font-bold tracking-[-0.02em]">
        {t("title")}
      </h2>
      <div className="flex flex-wrap gap-6">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5 rounded-2xl border-[1.5px] border-ink bg-white p-[clamp(24px,4vw,36px)]">
          <span className="self-start rounded-full bg-brand px-3.5 py-1.5 text-[13px] font-semibold">
            {tp("home")}
          </span>
          <h3 className="text-[clamp(24px,3vw,30px)] font-bold leading-[1.1]">
            {t("home.title")}
          </h3>
          <CheckList points={t.raw("home.points") as string[]} />
          <Link
            href="/build-at-home"
            className="mt-auto inline-flex min-h-11 items-center self-start text-[16px] font-semibold underline-offset-4 hover:underline"
          >
            {t("home.cta")}
          </Link>
        </div>
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5 rounded-2xl border-[1.5px] border-ink bg-ink p-[clamp(24px,4vw,36px)] text-cream">
          <span className="self-start rounded-full bg-cream px-3.5 py-1.5 text-[13px] font-semibold text-ink">
            {tp("shop")}
          </span>
          <h3 className="text-[clamp(24px,3vw,30px)] font-bold leading-[1.1]">
            {t("shop.title")}
          </h3>
          <CheckList points={t.raw("shop.points") as string[]} dark />
          <Link
            href="/own-shop"
            className="mt-auto inline-flex min-h-11 items-center self-start text-[16px] font-semibold text-brand underline-offset-4 hover:text-brand hover:underline"
          >
            {t("shop.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function LeadMagnet() {
  const t = useTranslations("home.lead");

  return (
    <section id="start" className="scroll-mt-4 bg-brand">
      <div className="container-page section-px flex flex-col gap-4 py-[clamp(48px,7vw,72px)]">
        <div className="eyebrow">{t("eyebrow")}</div>
        <h2 className="max-w-[820px] text-[clamp(30px,3.4vw,46px)] font-bold leading-[1.05] tracking-[-0.02em]">
          {t("title")}
        </h2>
        <p className="text-[18px] leading-[1.5]">{t("text")}</p>
        <div className="mt-1 max-w-[620px]">
          <LeadForm source="starter-list" path="general" submitLabel={t("submit")} />
        </div>
      </div>
    </section>
  );
}

function Plans({ products }: { products: ShopProduct[] }) {
  const t = useTranslations("home.plans");

  return (
    <section id="plans" className="container-page section-px section-py flex flex-col gap-9">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2.5">
          <div className="eyebrow text-ink-muted">{t("eyebrow")}</div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-bold tracking-[-0.02em]">
            {t("title")}
          </h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center text-[16px] font-semibold underline-offset-4 hover:underline"
        >
          {t("seeAll")}
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <FeaturedProductCard key={product.id} product={product} />
        ))}
      </div>
      <p className="text-[14px] text-ink-muted">{t("note")}</p>
    </section>
  );
}

function RealJobs() {
  const t = useTranslations("home.realJobs");
  const tg = useTranslations("gallery");

  return (
    <section className="border-t border-border bg-white">
      <div className="container-page section-px section-py flex flex-col gap-9">
        <div className="flex flex-col gap-2.5">
          <div className="eyebrow text-ink-muted">{t("eyebrow")}</div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-bold tracking-[-0.02em]">
            {t("title")}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REAL_JOB_PHOTOS.map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand"
            >
              <Image
                src={photo.src}
                alt={tg(photo.altKey)}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutTeaser() {
  const t = useTranslations("home.about");

  return (
    <section
      id="about"
      className="container-page section-px section-py flex flex-wrap items-center gap-12"
    >
      <div className="relative aspect-square w-full max-w-[360px] flex-[0_1_360px] overflow-hidden rounded-2xl bg-sand">
        <Image
          src="/images/workshop/hero-centered.jpg"
          alt={t("portraitAlt")}
          fill
          sizes="360px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-[18px]">
        <h2 className="text-[clamp(30px,3.4vw,46px)] font-bold tracking-[-0.02em]">
          {t("title")}
        </h2>
        <p className="text-[18px] leading-[1.6] text-ink-soft">{t("p1")}</p>
        <p className="text-[18px] leading-[1.6] text-ink-soft">{t("p2")}</p>
        <div className="mt-1.5 flex flex-wrap gap-3">
          <Link
            href="/build-at-home"
            className="inline-flex min-h-11 items-center rounded-[10px] bg-brand px-[22px] py-3 font-semibold text-ink hover:text-ink"
          >
            {t("homeCta")}
          </Link>
          <Link
            href="/own-shop"
            className="inline-flex min-h-11 items-center rounded-[10px] bg-ink px-[22px] py-3 font-semibold text-cream hover:text-cream"
          >
            {t("shopCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
