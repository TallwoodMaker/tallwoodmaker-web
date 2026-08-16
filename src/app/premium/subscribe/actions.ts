"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe, PREMIUM_PRICE_ID } from "@/lib/stripe";
import { getSubscriberByEmail } from "@/lib/subscribers";

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

export type MagicLinkState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

export async function sendMagicLink(
  _prevState: MagicLinkState,
  formData: FormData
): Promise<MagicLinkState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { status: "error", message: "Enter a valid email address." };
  }

  const origin = await getOrigin();
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/premium/subscribe`,
    },
  });

  if (error) {
    return {
      status: "error",
      message: "Couldn't send the link. Please try again.",
    };
  }

  return { status: "sent", message: `Check ${email} for a sign-in link.` };
}

export async function createCheckoutSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/premium/subscribe");
  }

  const origin = await getOrigin();
  const existing = await getSubscriberByEmail(user.email);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: PREMIUM_PRICE_ID, quantity: 1 }],
    customer: existing?.stripe_customer_id ?? undefined,
    customer_email: existing?.stripe_customer_id ? undefined : user.email,
    client_reference_id: user.id,
    success_url: `${origin}/premium`,
    cancel_url: `${origin}/premium/subscribe`,
    metadata: { supabase_user_id: user.id, email: user.email },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  redirect(session.url);
}
