import "server-only";
import type Stripe from "stripe";
import type { Platform } from "@/config/social";
import { PREMIUM_PRICE_ID, stripe } from "@/lib/stripe";
import { SHOP_PRODUCTS } from "@/lib/shopProducts";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Data for the owner dashboard (/admin/dashboard). Everything is computed
 * server-side per request; days and months are in the owner's time zone.
 */

const TZ = "Europe/Bratislava";
const DAY_MS = 24 * 60 * 60 * 1000;

/** YYYY-MM-DD of `date` in the owner's time zone. */
export function dayKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** How far the owner's clock is ahead of UTC at `at`, in ms. */
function tzOffsetMs(at: Date): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(at)
      .map((p) => [p.type, p.value])
  );
  const asUtc = Date.UTC(
    +parts.year,
    +parts.month - 1,
    +parts.day,
    +parts.hour,
    +parts.minute,
    +parts.second
  );
  return asUtc - Math.floor(at.getTime() / 1000) * 1000;
}

/** Local midnight of y-m-d (month 0-based; overflow allowed) as a Date. */
function localMidnight(y: number, m: number, d: number): Date {
  const guess = Date.UTC(y, m, d);
  return new Date(guess - tzOffsetMs(new Date(guess)));
}

export type Periods = {
  now: Date;
  thisMonthStart: Date;
  lastMonthStart: Date;
  weekAgo: Date;
  thirtyDaysAgo: Date;
  /** The last 30 local days, oldest first. */
  last30: string[];
};

export function periods(now = new Date()): Periods {
  const [y, m, d] = dayKey(now).split("-").map(Number);
  const last30 = Array.from({ length: 30 }, (_, i) =>
    dayKey(new Date(localMidnight(y, m - 1, d - 29 + i).getTime() + DAY_MS / 2))
  );
  return {
    now,
    thisMonthStart: localMidnight(y, m - 1, 1),
    lastMonthStart: localMidnight(y, m - 2, 1),
    weekAgo: new Date(now.getTime() - 7 * DAY_MS),
    thirtyDaysAgo: localMidnight(y, m - 1, d - 29),
    last30,
  };
}

type Window = "thisMonth" | "lastMonth";

function windowOf(at: Date, p: Periods): Window | null {
  if (at >= p.thisMonthStart) return "thisMonth";
  if (at >= p.lastMonthStart) return "lastMonth";
  return null;
}

function countBy<T>(rows: T[], key: (row: T) => string): [string, number][] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const k = key(row);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

// ---------------------------------------------------------------- leads

type LeadRow = {
  email: string;
  source: string;
  path: string | null;
  ref: string | null;
  utm_source: string | null;
  segment: string | null;
  marketing_consent: boolean;
  unsubscribed_at: string | null;
  starter_sent_at: string | null;
  starter_downloaded_at: string | null;
  starter_download_locale: string | null;
  created_at: string;
};

export async function getLeadStats(p: Periods) {
  const { data, error } = await createAdminClient()
    .from("leads")
    .select(
      "email, source, path, ref, utm_source, segment, marketing_consent, unsubscribed_at, starter_sent_at, starter_downloaded_at, starter_download_locale, created_at"
    )
    .limit(20000);
  if (error) throw error;
  const leads = (data ?? []) as LeadRow[];
  const created = (l: LeadRow) => new Date(l.created_at);

  const starter = leads.filter((l) => l.source === "starter-list");
  const workshop = leads.filter((l) => l.source === "workshop-pricing");
  const consenting = leads.filter(
    (l) => l.marketing_consent && !l.unsubscribed_at
  ).length;
  const sent = starter.filter((l) => l.starter_sent_at);
  const downloaded = starter.filter((l) => l.starter_downloaded_at);

  const daily = new Map(p.last30.map((day) => [day, 0]));
  for (const l of leads) {
    const day = dayKey(created(l));
    if (daily.has(day)) daily.set(day, daily.get(day)! + 1);
  }

  const signups = { thisMonth: 0, lastMonth: 0 };
  const downloads = { thisMonth: 0, lastMonth: 0 };
  for (const l of leads) {
    const w = windowOf(created(l), p);
    if (w) signups[w]++;
    if (l.starter_downloaded_at) {
      const dw = windowOf(new Date(l.starter_downloaded_at), p);
      if (dw) downloads[dw]++;
    }
  }

  const signupsFromPathThisMonth = (path: string) =>
    leads.filter((l) => l.path === path && created(l) >= p.thisMonthStart)
      .length;

  return {
    total: leads.length,
    uniqueEmails: new Set(leads.map((l) => l.email.toLowerCase())).size,
    newWeek: leads.filter((l) => created(l) >= p.weekAgo).length,
    newMonth: signups.thisMonth,
    bySource: countBy(leads, (l) => l.source),
    byRef: countBy(leads, (l) => l.ref ?? "none"),
    byUtmSource: countBy(
      leads.filter((l) => l.utm_source),
      (l) => l.utm_source!
    ),
    consenting,
    starterTotal: starter.length,
    unsubscribed: leads.filter((l) => l.unsubscribed_at).length,
    daily: [...daily.entries()],
    workshopTotal: workshop.length,
    workshopBySegment: countBy(workshop, (l) => l.segment ?? "not given"),
    starterSent: sent.length,
    downloaded: downloaded.length,
    downloadsByFile: countBy(
      downloaded,
      (l) => l.starter_download_locale ?? "?"
    ),
    signups,
    downloads,
    startSignupsThisMonth: signupsFromPathThisMonth("start"),
    workshopSignupsThisMonth: signupsFromPathThisMonth("workshop"),
  };
}

// -------------------------------------------------------------- traffic

type PageViewDay = {
  day: string;
  path: string;
  ref: string;
  utm_source: string;
  referrer_host: string;
  views: number;
  visits: number;
};

/** Where a visit came from: ?ref=, else utm_source, else referring site. */
function visitSource(row: PageViewDay): string {
  if (row.ref) return { ig: "instagram", tt: "tiktok", yt: "youtube" }[row.ref] ?? row.ref;
  if (row.utm_source) return row.utm_source.toLowerCase();
  if (row.referrer_host) {
    const host = row.referrer_host.replace(/^(www|l|m|lm)\./, "");
    if (/instagram\.com$/.test(host)) return "instagram";
    if (/tiktok\.com$/.test(host)) return "tiktok";
    if (/youtube\.com$|youtu\.be$/.test(host)) return "youtube";
    return host;
  }
  return "direct";
}

export async function getTrafficStats(p: Periods) {
  const supabase = createAdminClient();
  const [{ data, error }, first] = await Promise.all([
    supabase
      .from("page_view_daily")
      .select("day, path, ref, utm_source, referrer_host, views, visits")
      .gte("day", dayKey(p.lastMonthStart))
      .limit(50000),
    supabase
      .from("page_views")
      .select("created_at")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);
  if (error) throw error;
  const rows = ((data ?? []) as PageViewDay[]).map((r) => ({
    ...r,
    views: Number(r.views),
    visits: Number(r.visits),
  }));
  const thisMonthKey = dayKey(p.thisMonthStart);
  const last30Start = p.last30[0];
  const recent = rows.filter((r) => r.day >= last30Start);

  const daily = new Map(p.last30.map((day) => [day, 0]));
  for (const r of recent) daily.set(r.day, (daily.get(r.day) ?? 0) + r.visits);

  const sum = <K extends "views" | "visits">(list: PageViewDay[], key: K) =>
    list.reduce((n, r) => n + r[key], 0);

  const pages = new Map<string, { views: number; visits: number }>();
  for (const r of recent) {
    const page = pages.get(r.path) ?? { views: 0, visits: 0 };
    page.views += r.views;
    page.visits += r.visits;
    pages.set(r.path, page);
  }

  const sources = new Map<string, number>();
  for (const r of recent) {
    if (!r.visits) continue;
    const s = visitSource(r);
    sources.set(s, (sources.get(s) ?? 0) + r.visits);
  }

  const visitsThisMonth = (path?: string) =>
    sum(
      rows.filter(
        (r) => r.day >= thisMonthKey && (path === undefined || r.path === path)
      ),
      "visits"
    );
  // Page views, not visits, for per-page conversion: someone landing on the
  // homepage and then opening /workshop still counts for /workshop.
  const viewsThisMonth = (path: string) =>
    sum(
      rows.filter((r) => r.day >= thisMonthKey && r.path === path),
      "views"
    );

  return {
    since: first.data?.created_at ? new Date(first.data.created_at) : null,
    visits30: sum(recent, "visits"),
    views30: sum(recent, "views"),
    daily: [...daily.entries()],
    topPages: [...pages.entries()]
      .sort((a, b) => b[1].views - a[1].views)
      .slice(0, 10),
    bySource: [...sources.entries()].sort((a, b) => b[1] - a[1]),
    visits: {
      thisMonth: visitsThisMonth(),
      lastMonth: sum(
        rows.filter((r) => r.day < thisMonthKey),
        "visits"
      ),
    },
    startViewsThisMonth: viewsThisMonth("/start"),
    workshopViewsThisMonth: viewsThisMonth("/workshop"),
  };
}

// --------------------------------------------------------------- stripe

/** Amounts in cents, per currency (normally just "eur"). */
export type Money = Record<string, number>;

function add(money: Money, currency: string, cents: number) {
  money[currency] = (money[currency] ?? 0) + cents;
}

const MAX_OBJECTS = 5000;

async function listAll<T>(list: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = [];
  for await (const item of list) {
    out.push(item);
    if (out.length >= MAX_OBJECTS) break;
  }
  return out;
}

/** Monthly value of one subscription, in cents. */
function monthlyCents(subscription: Stripe.Subscription): number {
  let total = 0;
  for (const item of subscription.items.data) {
    const price = item.price;
    const amount = (price.unit_amount ?? 0) * (item.quantity ?? 1);
    const every = price.recurring?.interval_count ?? 1;
    const perMonth = PER_MONTH[price.recurring?.interval ?? "month"];
    total += (amount * perMonth) / every;
  }
  return total;
}

const PER_MONTH: Record<Stripe.Price.Recurring.Interval, number> = {
  day: 365 / 12,
  week: 52 / 12,
  month: 1,
  year: 1 / 12,
};

const WORKSHOP_PRODUCT = /workshop|price a job/i;

// The Stripe account is shared with MebCut, so only TallWoodMaker's own
// prices count: the shop products (incl. ones no longer for sale) and
// Premium. The workshop is matched by name until it has a price here.
const SHOP_PRICES = new Map(
  SHOP_PRODUCTS.map((product) => [product.stripePriceId, product.title])
);

function isPremium(subscription: Stripe.Subscription) {
  return subscription.items.data.some(
    (item) => item.price.id === PREMIUM_PRICE_ID
  );
}

export async function getStripeStats(p: Periods) {
  const [sessions, allSubscriptions] = await Promise.all([
    listAll(
      stripe.checkout.sessions.list({
        limit: 100,
        status: "complete",
        expand: ["data.line_items"],
      })
    ),
    listAll(stripe.subscriptions.list({ limit: 100, status: "all" })),
  ]);
  const subscriptions = allSubscriptions.filter(isPremium);

  const revenue = {
    thisMonth: {} as Money,
    last30: {} as Money,
    allTime: {} as Money,
  };
  const addRevenue = (at: Date, currency: string, cents: number) => {
    add(revenue.allTime, currency, cents);
    if (at >= p.thirtyDaysAgo) add(revenue.last30, currency, cents);
    if (at >= p.thisMonthStart) add(revenue.thisMonth, currency, cents);
  };

  // Shop + workshop: one-time checkouts, only TallWoodMaker line items.
  const purchases = { thisMonth: 0, lastMonth: 0 };
  const products = new Map<string, { orders: number; revenue: Money }>();
  const workshop = { orders: 0, revenue: {} as Money };
  for (const session of sessions) {
    if (session.payment_status !== "paid") continue;
    const at = new Date(session.created * 1000);
    const items = (session.line_items?.data ?? []).filter((item) => {
      const priceId = item.price?.id ?? "";
      return (
        SHOP_PRICES.has(priceId) ||
        priceId === PREMIUM_PRICE_ID ||
        WORKSHOP_PRODUCT.test(item.description ?? "")
      );
    });
    if (items.length === 0) continue; // a MebCut checkout
    const w = windowOf(at, p);
    if (w) purchases[w]++;
    if (session.mode !== "payment") continue; // Premium: counted via invoices
    for (const item of items) {
      const name =
        SHOP_PRICES.get(item.price?.id ?? "") ??
        item.description ??
        "Unknown product";
      const product = products.get(name) ?? { orders: 0, revenue: {} };
      product.orders += item.quantity ?? 1;
      add(product.revenue, item.currency, item.amount_total);
      products.set(name, product);
      addRevenue(at, item.currency, item.amount_total);
      if (WORKSHOP_PRODUCT.test(name)) {
        workshop.orders += item.quantity ?? 1;
        add(workshop.revenue, item.currency, item.amount_total);
      }
    }
  }

  // Premium: every paid invoice (first month and renewals).
  const invoices = (
    await Promise.all(
      subscriptions.slice(0, 200).map((s) =>
        listAll(
          stripe.invoices.list({ subscription: s.id, status: "paid", limit: 100 })
        )
      )
    )
  ).flat();
  const premiumRevenue: Money = {};
  for (const invoice of invoices) {
    const paidAt = invoice.status_transitions?.paid_at ?? invoice.created;
    addRevenue(new Date(paidAt * 1000), invoice.currency, invoice.amount_paid);
    add(premiumRevenue, invoice.currency, invoice.amount_paid);
  }

  const active = subscriptions.filter(
    (s) => s.status === "active" || s.status === "trialing"
  );
  const mrr: Money = {};
  for (const s of active) add(mrr, s.currency, monthlyCents(s));
  const canceledIn = (w: Window) =>
    subscriptions.filter(
      (s) => s.canceled_at && windowOf(new Date(s.canceled_at * 1000), p) === w
    ).length;

  return {
    revenue,
    purchases,
    products: [...products.entries()].sort(
      (a, b) => b[1].orders - a[1].orders
    ),
    workshop,
    premiumRevenue,
    activeSubscribers: active.length,
    mrr,
    cancellations: {
      thisMonth: canceledIn("thisMonth"),
      lastMonth: canceledIn("lastMonth"),
      scheduled: active.filter((s) => s.cancel_at_period_end).length,
    },
    truncated:
      sessions.length >= MAX_OBJECTS ||
      allSubscriptions.length >= MAX_OBJECTS,
  };
}

// --------------------------------------------------------------- social

export type SocialRow = {
  id: string;
  week_start: string;
  platform: Platform;
  followers: number | null;
  best_post_url: string | null;
  views: number | null;
  saves: number | null;
  comments: number | null;
  profile_visits: number | null;
  link_clicks: number | null;
};

export async function getSocialStats(): Promise<SocialRow[]> {
  const { data, error } = await createAdminClient()
    .from("social_stats")
    .select(
      "id, week_start, platform, followers, best_post_url, views, saves, comments, profile_visits, link_clicks"
    )
    .order("week_start", { ascending: true })
    .limit(1000);
  if (error) throw error;
  return (data ?? []) as SocialRow[];
}

/** Monday of the current week (owner's time zone), YYYY-MM-DD. */
export function currentWeekStart(now = new Date()): string {
  const [y, m, d] = dayKey(now).split("-").map(Number);
  const weekday = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
  return new Date(Date.UTC(y, m - 1, d - weekday)).toISOString().slice(0, 10);
}
