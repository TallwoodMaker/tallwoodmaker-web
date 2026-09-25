"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { getShopProduct, type ShopProduct } from "@/lib/shopProducts";

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

export type CartCheckoutState = {
  status: "idle" | "error";
  message?: string;
};

export async function createCartCheckoutSession(
  _prevState: CartCheckoutState,
  formData: FormData
): Promise<CartCheckoutState> {
  // Never trust the client-side cart array blindly — re-validate every id
  // against the real catalog (and its availability) server-side. Unknown
  // or unavailable ids are silently dropped rather than failing the whole
  // checkout; only an empty result after filtering is an error.
  const rawIds = formData.getAll("productId").map(String);
  const uniqueIds = Array.from(new Set(rawIds));
  const products = uniqueIds
    .map((id) => getShopProduct(id))
    .filter((p): p is ShopProduct => !!p && p.available);

  if (products.length === 0) {
    return {
      status: "error",
      message:
        "Your cart is empty, or everything in it is no longer available.",
    };
  }

  // Digital content is delivered instantly on payment, which under EU
  // consumer law (Terms of Service, Section 4) requires the buyer's prior
  // express consent to immediate delivery and acknowledgment that they
  // lose their 14-day right of withdrawal. The checkbox in the checkout
  // form is `required` client-side; this re-checks it server-side since a
  // server action can be invoked directly, bypassing HTML validation.
  if (formData.get("withdrawalConsent") !== "true") {
    return {
      status: "error",
      message:
        "Please confirm you want immediate access to your digital purchase to continue.",
    };
  }

  const origin = await getOrigin();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: products.map((product) => ({
      price: product.stripePriceId,
      quantity: 1,
    })),
    success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    metadata: { product_ids: JSON.stringify(products.map((p) => p.id)) },
    allow_promotion_codes: true,
  });

  if (!session.url) {
    return {
      status: "error",
      message: "Stripe did not return a checkout URL. Please try again.",
    };
  }

  redirect(session.url);
}
