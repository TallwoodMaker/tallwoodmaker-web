import "server-only";
import type { OfferPrice } from "@/config/freeOffers";

/** Stripe mode of the configured secret key. */
function stripeMode(): "test" | "live" {
  return /^(sk|rk)_test_/.test(process.env.STRIPE_SECRET_KEY ?? "")
    ? "test"
    : "live";
}

/**
 * The Stripe Price of an offer in the current mode. Null while the price
 * hasn't been created in that mode: the offer is then not shown or sold.
 */
export function offerStripePriceId(price: OfferPrice): string | null {
  return price.stripePriceId[stripeMode()];
}
