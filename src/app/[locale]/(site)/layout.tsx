import { setRequestLocale } from "next-intl/server";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function SiteLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  // Needed in every layout for static rendering (next-intl reads the locale
  // from here instead of from request headers).
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <TopBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
