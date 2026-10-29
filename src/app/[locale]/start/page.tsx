import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/Logo";
import PathCards from "@/components/site/PathCards";
import LeadForm from "@/components/LeadForm";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/start">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.start" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/start",
    title: t("title"),
    description: t("description"),
  });
}

/**
 * Link-in-bio landing page. Lives outside the (site) group on purpose: no
 * top bar, main navigation or big footer — just the logo, the two paths and
 * the lead magnet.
 */
export default async function StartPage({ params }: PageProps<"/[locale]/start">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Start />;
}

function Start() {
  const t = useTranslations("start");
  const tn = useTranslations("nav");

  return (
    <>
      <header className="border-b border-border">
        <div className="container-page section-px py-4">
          <Logo label={tn("homeLink")} />
        </div>
      </header>
      <main className="flex-1">
        <section className="container-page section-px flex max-w-[860px] flex-col gap-6 py-[clamp(40px,7vw,72px)]">
          <h1 className="text-[clamp(38px,5.6vw,64px)] font-bold leading-[1.03] tracking-[-0.03em]">
            {t.rich("title", {
              mark: (chunks) => <span className="highlight">{chunks}</span>,
            })}
          </h1>
          <p className="text-[18px] leading-[1.55] text-ink-soft">{t("text")}</p>
          <PathCards />
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center self-start text-[15px] text-ink-muted underline-offset-4 hover:text-ink hover:underline"
          >
            {t("shopLink")}
          </Link>
        </section>
        <section id="start" className="bg-brand">
          <div className="container-page section-px flex max-w-[860px] flex-col gap-4 py-[clamp(40px,6vw,64px)]">
            <h2 className="text-[clamp(28px,3.4vw,40px)] font-bold leading-[1.05] tracking-[-0.03em]">
              {t("leadTitle")}
            </h2>
            <p className="text-[18px] leading-[1.5]">{t("leadText")}</p>
            <LeadForm source="starter-list" path="general" submitLabel={t("submit")} />
          </div>
        </section>
      </main>
      <footer className="container-page section-px py-6 text-[13px] text-ink-muted">
        © TallWoodMaker s.r.o.
      </footer>
    </>
  );
}
