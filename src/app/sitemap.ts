import type { MetadataRoute } from "next";
import { getAvailableShopProducts } from "@/lib/shopProducts";

const SITE_URL = "https://www.tallwoodmaker.com";

// Static marketing pages, plus every available shop product (so new plans
// and ebooks show up here automatically as they're added to
// shopProducts.ts). /cart, /premium (redirect-only), /course (disabled
// feature) and auth/admin routes are intentionally left out.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/shop`, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${SITE_URL}/premium/subscribe`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/collaborate`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    { url: `${SITE_URL}/benefits`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const productRoutes: MetadataRoute.Sitemap = getAvailableShopProducts().map(
    (product) => ({
      url: `${SITE_URL}/shop/${product.id}`,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  return [...staticRoutes, ...productRoutes];
}
