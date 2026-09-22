"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { getShopProduct } from "@/lib/shopProducts";

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

export async function createShopCheckoutSession(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const product = getShopProduct(productId);
  if (!product) {
    throw new Error(`Unknown shop product: ${productId}`);
  }

  const origin = await getOrigin();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: product.stripePriceId, quantity: 1 }],
    success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop`,
    metadata: { product_id: product.id },
    allow_promotion_codes: true,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  redirect(session.url);
}
