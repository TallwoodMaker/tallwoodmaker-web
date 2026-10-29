import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/** How long list-only signups (no newsletter consent) are kept. */
export const RETENTION_MONTHS = 12;

/**
 * Data retention for `leads`, as promised in the privacy policy (Section 7):
 *
 * 1. Signups without newsletter consent are deleted 12 months after the
 *    starter list was sent (starter_sent_at), or 12 months after signup
 *    (created_at) when nothing was ever sent (e.g. the workshop waitlist).
 * 2. Unsubscribed rows are stripped down to the email address and the
 *    unsubscribe date (plus the columns the table requires), so we never
 *    email them again by mistake. They are not deleted: they are the
 *    suppression list.
 *
 * Rows with active newsletter consent are untouched. Run daily by the
 * /api/cron/cleanup-leads Vercel cron.
 */
export async function applyLeadRetention(now = new Date()): Promise<{
  deleted: number;
  minimized: number;
}> {
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS);
  const before = cutoff.toISOString();

  const supabase = createAdminClient();

  const { data: deleted, error: deleteError } = await supabase
    .from("leads")
    .delete()
    .eq("marketing_consent", false)
    .is("unsubscribed_at", null)
    .or(
      `starter_sent_at.lt.${before},and(starter_sent_at.is.null,created_at.lt.${before})`
    )
    .select("id");
  if (deleteError) throw deleteError;

  const { data: minimized, error: minimizeError } = await supabase
    .from("leads")
    .update({
      path: null,
      locale: null,
      ref: null,
      marketing_consent: false,
      consent_at: null,
      consent_text: null,
      starter_sent_at: null,
    })
    .not("unsubscribed_at", "is", null)
    .or(
      "path.not.is.null,locale.not.is.null,ref.not.is.null,marketing_consent.eq.true,consent_at.not.is.null,consent_text.not.is.null,starter_sent_at.not.is.null"
    )
    .select("id");
  if (minimizeError) throw minimizeError;

  return { deleted: deleted.length, minimized: minimized.length };
}
