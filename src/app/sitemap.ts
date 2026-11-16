import type { MetadataRoute } from "next";
import { getAvailableShopProducts } from "@/lib/shopProducts";
import { alternatesFor, localizedUrl, SITE_URL } from "@/i18n/metadata";
import { COURSE_ENABLED } from "@/lib/config";
import { LOCALES } from "@/i18n/routing";

// Static marketing pages, plus every available shop product (so new plans
// and ebooks show up here automatically as they're added to
// shopProducts.ts). Each page is listed once per language, with hreflang
// alternates (incl. x-default → English). /cart, /premium (redirect-only),
// /start (link-in-bio duplicate of the homepage), /free/* (ad landing
// pages) and auth/admin routes are intentionally left out. /course is
// English only, so it is listed once, without alternates.
const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/build-at-home", changeFrequency: "monthly", priority: 0.9 },
  { path: "/own-shop", changeFrequency: "monthly", priority: 0.9 },
  { path: "/workshop", changeFrequency: "monthly", priority: 0.8 },
  { path: "/shop", changeFrequency: "weekly", priority: 0.9 },
  { path: "/videos", changeFrequency: "weekly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/premium/subscribe", changeFrequency: "monthly", priority: 0.8 },
  { path: "/for-brands", changeFrequency: "monthly", priority: 0.5 },
  { path: "/collaborate", changeFrequency: "monthly", priority: 0.5 },
  { path: "/benefits", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...STATIC_ROUTES,
    ...getAvailableShopProducts().map((product) => ({
      path: `/shop/${product.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  const englishOnly: MetadataRoute.Sitemap = COURSE_ENABLED
    ? [
        {
          url: `${SITE_URL}/course`,
          changeFrequency: "monthly",
          priority: 0.8,
        },
      ]
    : [];

  const localized = routes.flatMap(({ path, changeFrequency, priority }) =>
    LOCALES.map((locale) => ({
      url: localizedUrl(locale, path),
      changeFrequency,
      priority,
      alternates: {
        languages: alternatesFor(locale, path)?.languages as Record<
          string,
          string
        >,
      },
    }))
  );

  return [...localized, ...englishOnly];
}
