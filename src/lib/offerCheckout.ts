"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { getShopProduct } from "@/lib/shopProducts";
import { createAdminClient } from "@/lib/supabase/admin";
import { getFreeMagnetByOffer } from "@/config/freeMagnets";
import { FREE_OFFERS } from "@/config/freeOffers";
import { offerStripePriceId } from "@/lib/offers";

// Same shape as the leads.offer_token default (64 hex chars).
const TOKEN_RE = /^[a-f0-9]{32,128}$/;

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

export type OfferCheckoutState = {
  status: "idle" | "error";
  message?: string;
};

/**
 * Checkout for the "New subscriber price" offer on /free/thanks. Same Stripe
 * Checkout as the shop cart (one-time payment, downloads on /shop/success),
 * but with the offer prices, no promotion codes, and the lead behind the
 * page's token: its email is prefilled and its source goes into
 * metadata.lead_source, so purchases can be counted per ad in /admin/leads.
 * The token is looked up here on the server; the email never is in the URL.
 */
export async function createOfferCheckoutSession(
  _prevState: OfferCheckoutState,
  formData: FormData
): Promise<OfferCheckoutState> {
  const offerKey = String(formData.get("offer") ?? "");
  const offer = FREE_OFFERS[offerKey as keyof typeof FREE_OFFERS];
  const magnet = getFreeMagnetByOffer(offerKey);
  const mainPrice = offer && offerStripePriceId(offer);
  if (!offer || !magnet || !mainPrice) {
    return {
      status: "error",
      message: "This offer is not available right now.",
    };
  }

  // Digital content is delivered instantly, which under EU consumer law
  // needs the buyer's express consent and acknowledgment that the right of
  // withdrawal is lost (Terms, Section 4). Re-checked here because a server
  // action can be called directly, bypassing the form's `required`.
  if (formData.get("withdrawalConsent") !== "true") {
    return {
      status: "error",
      message:
        "Please confirm you want immediate access to your digital purchase to continue.",
    };
  }

  const items: { productId: string; price: string }[] = [
    { productId: offer.productId, price: mainPrice },
  ];
  const addonPrice = offer.addon && offerStripePriceId(offer.addon);
  if (offer.addon && addonPrice && formData.get("addon") === "on") {
    items.push({ productId: offer.addon.productId, price: addonPrice });
  }
  if (items.some((item) => !getShopProduct(item.productId)?.available)) {
    return {
      status: "error",
      message: "This offer is not available right now.",
    };
  }

  const token = String(formData.get("token") ?? "");
  let lead: { email: string; source: string } | null = null;
  if (TOKEN_RE.test(token)) {
    const { data } = await createAdminClient()
      .from("leads")
      .select("email, source")
      .eq("offer_token", token)
      .maybeSingle();
    lead = data;
  }

  const origin = await getOrigin();
  const back = `${origin}/free/thanks?t=${offerKey}${lead ? `&l=${token}` : ""}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: items.map((item) => ({ price: item.price, quantity: 1 })),
    success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: back,
    customer_email: lead?.email,
    metadata: {
      product_ids: JSON.stringify(items.map((item) => item.productId)),
      // Which lead magnet the buyer came from; falls back to the page's own
      // magnet when the page was opened without a (valid) token.
      lead_source: lead?.source ?? magnet.source,
      offer: offerKey,
    },
    locale: "en",
  });

  if (!session.url) {
    return {
      status: "error",
      message: "Stripe did not return a checkout URL. Please try again.",
    };
  }

  redirect(session.url);
}
