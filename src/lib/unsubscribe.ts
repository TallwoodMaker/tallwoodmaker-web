import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncResendContact } from "@/lib/email/leadEmails";

// Tokens are 64 hex chars (see the leads migration); anything else is
// rejected before touching the database.
const TOKEN_RE = /^[a-f0-9]{32,128}$/;

/**
 * Unsubscribes the person behind an unsubscribe token: every lead row with
 * that email gets unsubscribed_at (they asked for no more email, from any
 * list), and their Resend contact is marked unsubscribed.
 */
export async function unsubscribeByToken(
  token: string | null | undefined
): Promise<"ok" | "invalid" | "error"> {
  if (!token || !TOKEN_RE.test(token)) return "invalid";

  const supabase = createAdminClient();
  const { data: lead, error } = await supabase
    .from("leads")
    .select("email")
    .eq("unsubscribe_token", token)
    .maybeSingle();

  if (error) {
    console.error("Unsubscribe lookup failed:", error);
    return "error";
  }
  if (!lead) return "invalid";

  const { error: updateError } = await supabase
    .from("leads")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("email", lead.email)
    .is("unsubscribed_at", null);

  if (updateError) {
    console.error("Unsubscribe update failed:", updateError);
    return "error";
  }

  await syncResendContact(lead.email, true);
  return "ok";
}

/** True when the token belongs to a lead (used to render the page). */
export async function isValidUnsubscribeToken(
  token: string | null | undefined
): Promise<boolean> {
  if (!token || !TOKEN_RE.test(token)) return false;
  const { data } = await createAdminClient()
    .from("leads")
    .select("id")
    .eq("unsubscribe_token", token)
    .limit(1)
    .maybeSingle();
  return !!data;
}
