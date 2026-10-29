import type { MetadataRoute } from "next";

const SITE_URL = "https://www.tallwoodmaker.com";

// Private routes, in English (unprefixed) and every other language (/de/cart…).
const PRIVATE = ["/cart", "/admin", "/auth", "/api"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...PRIVATE, ...PRIVATE.filter((p) => p !== "/api").map((p) => `/*${p}`)],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
