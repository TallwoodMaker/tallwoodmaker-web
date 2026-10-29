import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import TikTokCreatorEmbed from "@/components/TikTokCreatorEmbed";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/SocialIcons";

// Moved here from the old homepage. Titles are the YouTube titles, so they
// stay in English.
const LONG_FORM_VIDEOS = [
  {
    id: "h_7bRppzupc",
    title: "Inside My €650,000 Dream Woodshop (900m² Full Tour 2025)",
    tag: "Workshop Tour",
    duration: "14:23",
  },
  {
    id: "Lr1ormzIZEo",
    title: "Sunday Reset, CNC Fix & Projects | Day in the Workshop Ep.7",
    tag: "Day in the Workshop",
    duration: "4:00",
  },
  {
    id: "xUvPfp6E0zw",
    title: "23 Minutes from the Life of a Woodworking CNC Operator",
    tag: "Day in the Workshop",
    duration: "23:49",
  },
];

const CHANNELS = [
  {
    key: "youtube",
    label: "YouTube",
    handle: "@tallwoodmaker",
    href: "https://www.youtube.com/@tallwoodmaker",
    Icon: YouTubeIcon,
  },
  {
    key: "instagram",
    label: "Instagram",
    handle: "@tallwoodmaker",
    href: "https://www.instagram.com/tallwoodmaker",
    Icon: InstagramIcon,
  },
  {
    key: "tiktok",
    label: "TikTok",
    handle: "@tallwoodmaker",
    href: "https://www.tiktok.com/@tallwoodmaker",
    Icon: TikTokIcon,
  },
  {
    key: "facebook",
    label: "Facebook",
    handle: "TallWoodMaker",
    href: "https://www.facebook.com/tallwoodmaker",
    Icon: FacebookIcon,
  },
] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/videos">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.videos" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/videos",
    title: t("title"),
    description: t("description"),
  });
}

export default async function VideosPage({ params }: PageProps<"/[locale]/videos">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Videos />;
}

function Videos() {
  const t = useTranslations("videos");

  return (
    <>
      <section className="container-page section-px flex flex-col gap-5 pb-10 pt-[clamp(40px,7vw,72px)]">
        <h1 className="text-[clamp(38px,5vw,64px)] font-bold leading-[1.03] tracking-[-0.03em]">
          {t("title")}
        </h1>
        <p className="max-w-[620px] text-[19px] leading-[1.55] text-ink-soft">
          {t("text")}
        </p>
      </section>

      <section className="container-page section-px flex flex-col gap-6 pb-14">
        <h2 className="text-[clamp(24px,3vw,32px)] font-bold">{t("channelsTitle")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map(({ key, label, handle, href, Icon }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 rounded-[14px] border border-border bg-white p-5 text-ink hover:text-ink"
            >
              <Icon className="text-ink" />
              <span className="font-display text-[20px] font-bold group-hover:underline">
                {label}
              </span>
              <span className="font-mono text-[12px] text-ink-muted">{handle}</span>
              <span className="text-[15px] text-ink-soft">{t(key)}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-white">
        <div className="container-page section-px flex flex-col gap-6 py-14">
          <h2 className="text-[clamp(24px,3vw,32px)] font-bold">{t("longFormTitle")}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LONG_FORM_VIDEOS.map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-ink hover:text-ink"
              >
                <div className="relative mb-3 aspect-video overflow-hidden rounded-xl bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 right-2 rounded bg-ink/80 px-1.5 py-0.5 text-[11px] font-semibold text-cream">
                    {video.duration}
                  </span>
                </div>
                <div className="mb-1 text-[15px] font-semibold group-hover:underline">
                  {video.title}
                </div>
                <div className="text-sm text-ink-muted">{video.tag}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page section-px flex flex-col gap-6 py-14">
        <h2 className="text-[clamp(24px,3vw,32px)] font-bold">{t("tiktokTitle")}</h2>
        <TikTokCreatorEmbed />
      </section>
    </>
  );
}
