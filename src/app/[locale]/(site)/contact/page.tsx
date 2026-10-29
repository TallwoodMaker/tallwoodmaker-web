import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.contact" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  return (
    <>
      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)]">
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-bold leading-[1.05] tracking-[-0.03em]">
          {t("title")}
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          {t("text")}
        </p>
      </section>

      <section className="container-page section-px grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-14 pb-[clamp(24px,5vw,64px)]">
        <form className="flex max-w-[480px] flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">{t("name")}</label>
            <input
              type="text"
              placeholder={t("namePlaceholder")}
              className="rounded border border-border bg-cream px-3 py-3 text-[15px] text-ink"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">{t("email")}</label>
            <input
              type="email"
              placeholder={t("emailPlaceholder")}
              className="rounded border border-border bg-cream px-3 py-3 text-[15px] text-ink"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">{t("message")}</label>
            <textarea
              rows={5}
              placeholder={t("messagePlaceholder")}
              className="resize-y rounded border border-border bg-cream px-3 py-3 text-[15px] text-ink"
            />
          </div>
          <button
            type="button"
            className="w-fit cursor-pointer rounded bg-brand px-7 py-3.5 text-[15px] font-bold text-ink"
          >
            {t("send")}
          </button>
        </form>

        <div>
          <div className="mb-7">
            <h3 className="mb-2 text-[15px] font-bold uppercase tracking-[0.05em] text-ink-muted">
              {t("emailHeading")}
            </h3>
            <a href="mailto:tom@tallwoodmaker.com" className="text-[17px] font-medium">
              tom@tallwoodmaker.com
            </a>
          </div>
          <div className="mb-7">
            <h3 className="mb-2 text-[15px] font-bold uppercase tracking-[0.05em] text-ink-muted">
              {t("workshopHeading")}
            </h3>
            <div className="text-[17px] text-ink">{t("workshopValue")}</div>
          </div>
          <div>
            <h3 className="mb-2 text-[15px] font-bold uppercase tracking-[0.05em] text-ink-muted">
              {t("socialHeading")}
            </h3>
            <div className="flex flex-col gap-2 text-[17px] font-medium">
              <a
                href="https://www.youtube.com/@tallwoodmaker"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube · @tallwoodmaker
              </a>
              <a
                href="https://www.instagram.com/tallwoodmaker"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram · @tallwoodmaker
              </a>
              <a
                href="https://www.tiktok.com/@tallwoodmaker"
                target="_blank"
                rel="noopener noreferrer"
              >
                TikTok · @tallwoodmaker
              </a>
              <a
                href="https://www.facebook.com/tallwoodmaker"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook · TallWoodMaker
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
