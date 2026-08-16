import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  upsertSubscriber,
  updateSubscriberByStripeCustomerId,
} from "@/lib/subscribers";

// Billing periods live on subscription items (not the subscription itself)
// as of the current Stripe API version — see node_modules/stripe's
// SubscriptionItems types.
function periodEnd(subscription: Stripe.Subscription): string | null {
  const seconds = subscription.items.data[0]?.current_period_end;
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Invalid signature: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email =
        session.customer_details?.email ?? session.metadata?.email ?? null;
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (email && customerId && subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        await upsertSubscriber(email, {
          stripe_customer_id: customerId,
          subscription_status: subscription.status,
          subscription_current_period_end: periodEnd(subscription),
        });
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      await updateSubscriberByStripeCustomerId(customerId, {
        subscription_status: subscription.status,
        subscription_current_period_end: periodEnd(subscription),
      });
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
