import type { OfferKey } from "./freeMagnets";

/**
 * "New subscriber price" offers shown on /free/thanks after someone asks for
 * a free PDF: one ebook for €6 instead of €19, and for the kitchen offer an
 * optional add-on (Kitchen Cabinet Library for €14 instead of €24).
 *
 * These are extra Stripe Prices on the existing shop products; the regular
 * shop prices in src/lib/shopProducts.ts are untouched. Each price exists
 * twice, once per Stripe mode, and the one matching STRIPE_SECRET_KEY is
 * used (src/lib/offerCheckout.ts). While a `live` id is null, that offer is
 * simply not shown on the live site.
 */
export type OfferPrice = {
  /** Product id from src/lib/shopProducts.ts. */
  productId: string;
  /** Name shown in the offer (the ebook is renamed site-wide later). */
  title: string;
  priceEur: number;
  stripePriceId: { test: string; live: string | null };
};

export type FreeOffer = OfferPrice & { addon?: OfferPrice };

export const FREE_OFFERS: Record<OfferKey, FreeOffer> = {
  build: {
    productId: "ebook-wardrobes-closets",
    title: "Wardrobes & Closets",
    priceEur: 6,
    stripePriceId: { test: "price_1UcLfICa2aoiD18ocXwPIGVQ", live: null },
  },
  paid: {
    productId: "ebook-zero-to-first-client",
    title: "Zero to First Client",
    priceEur: 6,
    stripePriceId: { test: "price_1UcLfJCa2aoiD18o6ZNnjtAi", live: null },
  },
  kitchen: {
    productId: "ebook-kitchen-from-scratch",
    title: "Kitchen from Scratch",
    priceEur: 6,
    stripePriceId: { test: "price_1UcLfJCa2aoiD18oNFQnfmuF", live: null },
    addon: {
      productId: "plan-kitchen-cabinet-library",
      title: "Kitchen Cabinet Library",
      priceEur: 14,
      stripePriceId: { test: "price_1UcLfJCa2aoiD18o6DehDqzU", live: null },
    },
  },
};

/** Every offer price (both modes) → product id, for the owner dashboard. */
export function offerPriceIds(): Map<string, string> {
  const ids = new Map<string, string>();
  for (const offer of Object.values(FREE_OFFERS)) {
    for (const price of [offer, offer.addon]) {
      if (!price) continue;
      ids.set(price.stripePriceId.test, price.productId);
      if (price.stripePriceId.live) {
        ids.set(price.stripePriceId.live, price.productId);
      }
    }
  }
  return ids;
}
