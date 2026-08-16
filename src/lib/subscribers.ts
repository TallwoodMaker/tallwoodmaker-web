import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type Subscriber = {
  id: string;
  email: string;
  stripe_customer_id: string | null;
  subscription_status: string | null;
  subscription_current_period_end: string | null;
  created_at: string;
};

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

export async function getSubscriberByEmail(
  email: string
): Promise<Subscriber | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("subscribers")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  return data;
}

export function hasActiveSubscription(
  subscriber: Subscriber | null
): boolean {
  if (!subscriber?.subscription_status) return false;
  if (!ACTIVE_STATUSES.has(subscriber.subscription_status)) return false;

  if (subscriber.subscription_current_period_end) {
    return (
      new Date(subscriber.subscription_current_period_end).getTime() >
      Date.now()
    );
  }

  return true;
}

export async function upsertSubscriber(
  email: string,
  fields: Partial<
    Pick<
      Subscriber,
      | "stripe_customer_id"
      | "subscription_status"
      | "subscription_current_period_end"
    >
  >
) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("subscribers")
    .upsert({ email, ...fields }, { onConflict: "email" });

  if (error) throw error;
}

export async function updateSubscriberByStripeCustomerId(
  stripeCustomerId: string,
  fields: Partial<
    Pick<Subscriber, "subscription_status" | "subscription_current_period_end">
  >
) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("subscribers")
    .update(fields)
    .eq("stripe_customer_id", stripeCustomerId);

  if (error) throw error;
}
