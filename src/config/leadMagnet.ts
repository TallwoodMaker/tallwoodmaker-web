import type { Locale } from "@/i18n/routing";

const STARTER_LIST_BASE =
  "https://tallwoodmaker.com/downloads/starter-list/tallwoodmaker-starter-list";

/**
 * The 10-tool starter list (lead magnet), one PDF per language, served
 * from public/downloads/starter-list/.
 *
 * starterListUrls: language → PDF URL. While null, the welcome email says
 * the list will follow within a few days. Once set, signups get a download
 * button in the language they picked (plus an English link) straight away
 * and starter_sent_at is recorded; the "Send starter list to pending"
 * button in /admin/leads emails everyone who signed up before.
 */
export const LEAD_MAGNET: {
  starterListUrls: Record<Locale, string> | null;
} = {
  starterListUrls: {
    en: `${STARTER_LIST_BASE}-en.pdf`,
    de: `${STARTER_LIST_BASE}-de.pdf`,
    es: `${STARTER_LIST_BASE}-es.pdf`,
    pt: `${STARTER_LIST_BASE}-pt.pdf`,
    fr: `${STARTER_LIST_BASE}-fr.pdf`,
    pl: `${STARTER_LIST_BASE}-pl.pdf`,
    cs: `${STARTER_LIST_BASE}-cs.pdf`,
    sk: `${STARTER_LIST_BASE}-sk.pdf`,
  },
};
