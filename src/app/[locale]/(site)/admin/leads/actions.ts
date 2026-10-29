"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";
import { LEAD_MAGNET } from "@/config/leadMagnet";
import { sendLeadEmail } from "@/lib/email/leadEmails";

export type SendPendingState = {
  status: "idle" | "done" | "error";
  message?: string;
};

// Resend's default rate limit is 2 requests/second.
const SEND_INTERVAL_MS = 600;

/**
 * Emails the starter list to every starter-list lead that hasn't had it yet
 * and hasn't unsubscribed, then stamps starter_sent_at. Admin only; refuses
 * while LEAD_MAGNET.starterListUrl is still null.
 */
export async function sendStarterToPending(): Promise<SendPendingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdmin(user?.email)) {
    return { status: "error", message: "Not authorized." };
  }
  if (!LEAD_MAGNET.starterListUrl) {
    return {
      status: "error",
      message: "Set starterListUrl in src/config/leadMagnet.ts first.",
    };
  }

  const admin = createAdminClient();
  const { data: pending, error } = await admin
    .from("leads")
    .select("id, email, source, locale, marketing_consent, unsubscribe_token")
    .eq("source", "starter-list")
    .is("starter_sent_at", null)
    .is("unsubscribed_at", null);

  if (error) return { status: "error", message: error.message };

  let sent = 0;
  let failed = 0;
  for (const lead of pending ?? []) {
    const result = await sendLeadEmail(lead, "starter-ready");
    if (result.sentStarterList) {
      await admin
        .from("leads")
        .update({ starter_sent_at: new Date().toISOString() })
        .eq("id", lead.id);
      sent++;
    } else {
      failed++;
    }
    await new Promise((r) => setTimeout(r, SEND_INTERVAL_MS));
  }

  revalidatePath("/[locale]/admin/leads", "page");
  return {
    status: "done",
    message: `Sent ${sent}${failed ? `, failed ${failed}` : ""}.`,
  };
}
