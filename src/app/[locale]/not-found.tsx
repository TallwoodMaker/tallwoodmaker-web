import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <>
      <TopBar />
      <Header />
      <main className="container-page section-px flex flex-1 flex-col items-start justify-center gap-4 py-24">
        <h1 className="text-[clamp(32px,5vw,48px)] font-bold tracking-[-0.02em]">
          {t("title")}
        </h1>
        <p className="text-[17px] text-ink-muted">{t("text")}</p>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-[10px] bg-ink px-5 font-semibold text-cream hover:text-cream"
        >
          {t("home")}
        </Link>
      </main>
      <Footer />
    </>
  );
}
