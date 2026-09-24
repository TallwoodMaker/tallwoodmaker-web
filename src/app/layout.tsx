import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { ConsentProvider } from "@/components/cookies/ConsentContext";
import { CartProvider } from "@/lib/cart/CartContext";
import CookieBanner from "@/components/cookies/CookieBanner";
import CookiePreferencesModal from "@/components/cookies/CookiePreferencesModal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_URL = "https://www.tallwoodmaker.com";
const SITE_DESCRIPTION =
  "Woodworking content for a growing community on YouTube, Instagram, and TikTok. From first sketch to final finish — the whole process, on camera.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TallWoodMaker",
    template: "%s · TallWoodMaker",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "TallWoodMaker",
    title: "TallWoodMaker",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/images/workshop/hero-panelsaw-centered.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TallWoodMaker",
    description: SITE_DESCRIPTION,
    images: ["/images/workshop/hero-panelsaw-centered.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-cream font-sans text-ink antialiased">
        <ConsentProvider>
          <CartProvider>
            <Analytics />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieBanner />
            <CookiePreferencesModal />
          </CartProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
