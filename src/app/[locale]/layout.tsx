import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Space_Grotesk, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import Analytics from "@/components/Analytics";
import { ConsentProvider } from "@/components/cookies/ConsentContext";
import { CartProvider } from "@/lib/cart/CartContext";
import CookieBanner from "@/components/cookies/CookieBanner";
import CookiePreferencesModal from "@/components/cookies/CookiePreferencesModal";
import RefTracker from "@/components/cookies/RefTracker";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/i18n/metadata";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700"],
});

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext"],
  weight: ["500"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const description = t("siteDescription");
  const ogImage = "/images/workshop/hero-panelsaw-centered.jpg";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "TallWoodMaker",
      template: "%s · TallWoodMaker",
    },
    description,
    openGraph: {
      type: "website",
      siteName: "TallWoodMaker",
      title: "TallWoodMaker",
      description,
      locale,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: "TallWoodMaker",
      description,
      images: [ogImage],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${grotesk.variable} ${plex.variable} ${jetbrains.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-cream font-sans text-ink antialiased">
        <NextIntlClientProvider>
          <ConsentProvider>
            <CartProvider>
              <Analytics />
              <RefTracker />
              {children}
              <CookieBanner />
              <CookiePreferencesModal />
            </CartProvider>
          </ConsentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
