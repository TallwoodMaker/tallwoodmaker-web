import "server-only";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Premium membership, €9/month (live).
export const PREMIUM_PRICE_ID = "price_1U3KJzCa2aoiD18ooxt0VZyn";
