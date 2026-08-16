import "server-only";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Premium membership, €9/month.
// TEMP: test-mode price for checkout testing — swap back to the live price
// before deploying: price_1U3KJzCa2aoiD18ooxt0VZyn
export const PREMIUM_PRICE_ID = "price_1U3uxdCa2aoiD18oC6VHbaMb";
