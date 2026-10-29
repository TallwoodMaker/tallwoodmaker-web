import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import {
  YouTubeIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/SocialIcons";
import { getLatestYouTubeVideos } from "@/lib/youtube";

// Copy (title/category/alt) lives in messages under about.galleryItems.<key>.
const GALLERY_ITEMS = [
  { src: "/images/workshop/workshop-1.jpg", key: "cnc" },
  { src: "/images/workshop/workshop-2.jpg", key: "edgeBanding" },
  { src: "/images/workshop/workshop-3.jpg", key: "feedingEdgeBander" },
  { src: "/images/workshop/workshop-4.jpg", key: "onPanelSaw" },
  { src: "/images/workshop/workshop-5.jpg", key: "panelSaw" },
  { src: "/images/workshop/workshop-6.jpg", key: "break" },
  { src: "/images/workshop/workshop-7.jpg", key: "controls" },
  { src: "/images/workshop/workshop-8.jpg", key: "storage" },
  { src: "/images/workshop/workshop-9.jpg", key: "dust" },
  { src: "/images/workshop/workshop-10.jpg", key: "slidingSaw" },
  { src: "/images/workshop/workshop-11.jpg", key: "fravol" },
  { src: "/images/workshop/workshop-12.jpg", key: "floor" },
] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/about",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const th = await getTranslations("home.about");
  const youtubeVideos = await getLatestYouTubeVideos(3);

  return (
    <>
      <section className="container-page section-px section-py grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] items-center gap-14">
        <div className="flex flex-col gap-5">
          <h1 className="text-[clamp(36px,5vw,64px)] font-bold leading-[1.05] tracking-[-0.03em]">
            {t("title")}
          </h1>
          <p className="max-w-[560px] text-[18px] leading-[1.6] text-ink-soft">
            {th("p1")}
          </p>
          <p className="max-w-[560px] text-[18px] leading-[1.6] text-ink-soft">
            {th("p2")}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-3">
            <Link
              href="/build-at-home"
              className="inline-flex min-h-11 items-center rounded-[10px] bg-brand px-[22px] py-3 font-semibold text-ink hover:text-ink"
            >
              {th("homeCta")}
            </Link>
            <Link
              href="/own-shop"
              className="inline-flex min-h-11 items-center rounded-[10px] bg-ink px-[22px] py-3 font-semibold text-cream hover:text-cream"
            >
              {th("shopCta")}
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-sand">
          <Image
            src="/images/workshop/hero-centered.jpg"
            alt={t("photoAlt")}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="container-page section-px section-py mx-auto max-w-[900px] border-t border-border">
        <p className="mb-6 text-[17px] leading-[1.75] text-ink-soft">{t("storyP1")}</p>
        <p className="text-[17px] leading-[1.75] text-ink-soft">{t("storyP2")}</p>
      </section>

      <section className="container-page section-px section-py grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-10 border-t border-border">
        {(["process", "tools", "community"] as const).map((key) => (
          <div key={key}>
            <h3 className="mb-3 text-[19px] font-bold">{t(`${key}.title`)}</h3>
            <p className="text-[15px] leading-[1.6] text-ink-muted">{t(`${key}.text`)}</p>
          </div>
        ))}
      </section>

      <section className="container-page section-px section-py border-t border-border">
        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl">
          <Image
            src="/images/workshop/workshop-9.jpg"
            alt={t("wideAlt")}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </section>

      <section className="container-page section-px section-py border-t border-border">
        <h2 className="mb-4 text-[clamp(28px,4vw,40px)] font-bold leading-[1.1] tracking-[-0.03em]">
          {t("galleryTitle")}
        </h2>
        <p className="mb-10 max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          {t("galleryText")}
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-x-6 gap-y-8">
          {GALLERY_ITEMS.map((item) => (
            <div key={item.src}>
              <div className="relative mb-3.5 aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={item.src}
                  alt={t(`galleryItems.${item.key}.alt`)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="mb-0.5 text-[15px] font-semibold">
                {t(`galleryItems.${item.key}.title`)}
              </div>
              <div className="text-sm text-ink-muted">
                {t(`galleryItems.${item.key}.category`)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="video" className="container-page section-px section-py border-t border-border">
        <h2 className="mb-4 text-[clamp(28px,4vw,40px)] font-bold leading-[1.1] tracking-[-0.03em]">
          {t("videoTitle")}
        </h2>
        <p className="mb-10 max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          {t("videoText")}
        </p>

        <div className="mb-12">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-2xl font-bold">YouTube</h3>
            <span className="text-[15px] text-ink-muted">@tallwoodmaker</span>
          </div>
          {youtubeVideos ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
              {youtubeVideos.map((video) => (
                <a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-ink hover:text-ink"
                >
                  <div className="mb-3 aspect-video overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="text-[15px] font-semibold">{video.title}</div>
                </a>
              ))}
            </div>
          ) : (
            <a
              href="https://youtube.com/@tallwoodmaker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-7 text-ink hover:text-ink"
            >
              <div className="flex items-center gap-4">
                <YouTubeIcon className="shrink-0 text-ink" />
                <div>
                  <h4 className="mb-1.5 text-xl font-bold">{t("youtubeCardTitle")}</h4>
                  <p className="text-[15px] text-ink-muted">{t("youtubeCardText")}</p>
                </div>
              </div>
              <span className="text-[15px] font-semibold">TallWoodMaker →</span>
            </a>
          )}
        </div>

        <div className="mb-12">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-2xl font-bold">Instagram</h3>
            <span className="text-[15px] text-ink-muted">@tallwoodmaker</span>
          </div>
          <a
            href="https://instagram.com/tallwoodmaker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-7 text-ink hover:text-ink"
          >
            <div className="flex items-center gap-4">
              <InstagramIcon className="shrink-0 text-ink" />
              <div>
                <h4 className="mb-1.5 text-xl font-bold">{t("instagramCardTitle")}</h4>
                <p className="text-[15px] text-ink-muted">{t("instagramCardText")}</p>
              </div>
            </div>
            <span className="text-[15px] font-semibold">@tallwoodmaker →</span>
          </a>
        </div>

        {/* The TikTok embed itself moved to /videos (same lazy-load). */}
        <div className="mb-12">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-2xl font-bold">TikTok</h3>
            <span className="text-[15px] text-ink-muted">@tallwoodmaker</span>
          </div>
          <Link
            href="/videos"
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-7 text-ink hover:text-ink"
          >
            <div className="flex items-center gap-4">
              <TikTokIcon className="shrink-0 text-ink" />
              <div>
                <h4 className="mb-1.5 text-xl font-bold">{t("tiktokCardTitle")}</h4>
                <p className="text-[15px] text-ink-muted">{t("tiktokCardText")}</p>
              </div>
            </div>
            <span className="text-[15px] font-semibold">{t("tiktokCardCta")}</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-7">
          <div>
            <h3 className="mb-1.5 text-xl font-bold">Facebook</h3>
            <p className="text-[15px] text-ink-muted">{t("facebookText")}</p>
          </div>
          <span className="text-[15px] font-semibold">TallWoodMaker →</span>
        </div>
      </section>

      <section className="container-page section-px pb-[clamp(48px,7vw,80px)] text-center">
        <Link
          href="/videos"
          className="inline-flex min-h-11 items-center rounded-[10px] bg-brand px-7 py-3.5 text-[15px] font-bold text-ink hover:text-ink"
        >
          {t("followBuild")}
        </Link>
      </section>
    </>
  );
}
