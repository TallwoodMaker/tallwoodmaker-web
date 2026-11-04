import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import WorkshopWaitlistForm from "./WorkshopWaitlistForm";

const BULLETS = ["forgottenCosts", "hourlyRate", "reserve", "profit"] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/workshop">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.workshop" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/workshop",
    title: t("title"),
    description: t("description"),
  });
}

export default async function WorkshopPage({
  params,
}: PageProps<"/[locale]/workshop">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Workshop />;
}

// Waitlist for the "Price a Job With Profit" online workshop. Mobile first:
// most visitors arrive from Instagram on a phone. No prices on this page.
function Workshop() {
  const t = useTranslations("workshop");

  return (
    <section className="bg-ink text-cream">
      <div className="container-page section-px grid grid-cols-1 items-start gap-10 pb-[clamp(48px,8vw,88px)] pt-[clamp(32px,6vw,72px)] lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-6">
          <span className="eyebrow self-start rounded-full bg-brand px-3 py-1.5 text-[12px] leading-[1.3] text-ink">
            {t("label")}
          </span>
          <h1 className="text-[clamp(40px,7vw,72px)] font-bold leading-[1.02] tracking-[-0.03em]">
            {t("title")}
          </h1>
          <p className="max-w-[620px] text-[18px] leading-[1.55] text-on-dark sm:text-[19px]">
            {t("subtitle")}
          </p>
          <a
            href="#join"
            className="inline-flex min-h-[52px] items-center justify-center self-stretch rounded-[10px] bg-brand px-6 text-[17px] font-bold text-ink hover:text-ink sm:self-start lg:hidden"
          >
            {t("form.submit")}
          </a>

          <div className="mt-2 flex flex-col gap-4">
            <div className="eyebrow text-brand">{t("learnTitle")}</div>
            <ol className="flex flex-col gap-3">
              {BULLETS.map((key, i) => (
                <li
                  key={key}
                  className="flex items-start gap-4 rounded-[14px] border border-line-dark p-4 sm:p-5"
                >
                  <span className="flex-none pt-0.5 font-mono text-[14px] text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[17px] font-semibold leading-[1.4]">
                    {t(`bullets.${key}`)}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <p className="text-[16px] leading-[1.5] text-on-dark">
            {t("audience")}
          </p>
        </div>

        <div
          id="join"
          className="scroll-mt-4 rounded-[20px] bg-cream p-[clamp(20px,5vw,32px)] text-ink lg:sticky lg:top-6"
        >
          <WorkshopWaitlistForm />
        </div>
      </div>
    </section>
  );
}
