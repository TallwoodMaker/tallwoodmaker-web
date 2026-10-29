/**
 * The 10-tool starter list (lead magnet).
 *
 * starterListUrl: public URL of the PDF. While null, the welcome email says
 * the list will follow within a few days. Once set, new signups get a
 * download button straight away (and starter_sent_at is recorded), and the
 * "Send starter list to pending" button in /admin/leads emails everyone who
 * signed up before it existed.
 */
export const LEAD_MAGNET: { starterListUrl: string | null } = {
  starterListUrl: null,
};
