import "server-only";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { COURSE_WAITLIST_SOURCE, FREE_MAGNETS } from "@/config/freeMagnets";

/**
 * Numbers for the paid-ad test, per lead source, shown on /admin/leads.
 * This is the source of truth for the test: the Meta Pixel only sees
 * visitors who accepted marketing cookies, these numbers count everyone.
 */

/** Sources with a page of their own, and that page's path in page_views. */
const SOURCE_PAGES: Record<string, string> = {
  ...Object.fromEntries(FREE_MAGNETS.map((m) => [m.source, `/free/${m.slug}`])),
  [COURSE_WAITLIST_SOURCE]: "/course",
};

/** Offer checkouts are looked up from this date on (start of the test). */
const OFFER_SINCE = Math.floor(Date.UTC(2026, 10, 1) / 1000);
const MAX_SESSIONS = 3000;

export type SourceLead = {
  source: string;
  marketing_consent: boolean;
  unsubscribed_at: string | null;
  course_waitlist: boolean;
};

export type SourceRow = {
  source: string;
  page: string | null;
  /** Page views of the source's page (cookieless counter); null = no page. */
  views: number | null;
  leads: number;
  consenting: number;
  courseWaitlist: number;
  purchases: number;
  /** Offer revenue in cents, per currency (normally just "eur"). */
  revenue: Record<string, number>;
};

async function pageViews(): Promise<Map<string, number>> {
  const { data, error } = await createAdminClient()
    .from("page_view_daily")
    .select("path, views")
    .in("path", Object.values(SOURCE_PAGES))
    .limit(50000);
  if (error) throw error;
  const views = new Map<string, number>();
  for (const row of data ?? []) {
    views.set(row.path, (views.get(row.path) ?? 0) + Number(row.views));
  }
  return views;
}

/** Paid offer checkouts, grouped by metadata.lead_source. */
async function offerPurchases(): Promise<
  Map<string, { purchases: number; revenue: Record<string, number> }>
> {
  const bySource = new Map<
    string,
    { purchases: number; revenue: Record<string, number> }
  >();
  let seen = 0;
  for await (const session of stripe.checkout.sessions.list({
    limit: 100,
    status: "complete",
    created: { gte: OFFER_SINCE },
  })) {
    if (++seen > MAX_SESSIONS) break;
    const source = session.metadata?.lead_source;
    if (!source || session.payment_status !== "paid") continue;
    const entry = bySource.get(source) ?? { purchases: 0, revenue: {} };
    entry.purchases++;
    const currency = session.currency ?? "eur";
    entry.revenue[currency] =
      (entry.revenue[currency] ?? 0) + (session.amount_total ?? 0);
    bySource.set(source, entry);
  }
  return bySource;
}

export async function getSourceOverview(leads: SourceLead[]): Promise<{
  rows: SourceRow[];
  /** Set when a part couldn't be loaded; the rest is still shown. */
  viewsError: boolean;
  purchasesError: boolean;
}> {
  const [views, purchases] = await Promise.allSettled([
    pageViews(),
    offerPurchases(),
  ]);
  if (views.status === "rejected") {
    console.error("Ad test: page views failed:", views.reason);
  }
  if (purchases.status === "rejected") {
    console.error("Ad test: Stripe purchases failed:", purchases.reason);
  }
  const viewsByPath = views.status === "fulfilled" ? views.value : new Map();
  const purchasesBySource =
    purchases.status === "fulfilled" ? purchases.value : new Map();

  // The test's sources always get a row (even at zero); other sources are
  // listed after them when they have leads or purchases.
  const sources = [
    ...Object.keys(SOURCE_PAGES),
    ...new Set(
      [...leads.map((l) => l.source), ...purchasesBySource.keys()].filter(
        (source) => !(source in SOURCE_PAGES)
      )
    ),
  ];

  const rows = sources.map((source): SourceRow => {
    const own = leads.filter((l) => l.source === source);
    const page = SOURCE_PAGES[source] ?? null;
    const bought = purchasesBySource.get(source);
    return {
      source,
      page,
      views: page ? (viewsByPath.get(page) ?? 0) : null,
      leads: own.length,
      consenting: own.filter((l) => l.marketing_consent && !l.unsubscribed_at)
        .length,
      courseWaitlist: own.filter((l) => l.course_waitlist).length,
      purchases: bought?.purchases ?? 0,
      revenue: bought?.revenue ?? {},
    };
  });

  return {
    rows,
    viewsError: views.status === "rejected",
    purchasesError: purchases.status === "rejected",
  };
}
