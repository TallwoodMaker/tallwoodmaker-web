import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { Link } from "@/i18n/navigation";
import {
  currentWeekStart,
  getLeadStats,
  getSocialStats,
  getStripeStats,
  getTrafficStats,
  periods,
  type Money,
} from "@/lib/dashboard";
import { PLATFORM_LABELS } from "@/config/social";
import { DailyBars, FollowersChart } from "./charts";
import SocialForm from "./SocialForm";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const nf = new Intl.NumberFormat("en-GB");

/** "1 view", "3 views". */
function count(n: number, word: string) {
  return `${nf.format(n)} ${word}${n === 1 ? "" : "s"}`;
}

function pct(part: number, whole: number) {
  if (!whole) return "—";
  return `${((part / whole) * 100).toFixed(part / whole < 0.1 ? 1 : 0)}%`;
}

function money(m: Money) {
  const entries = Object.entries(m);
  if (entries.length === 0) return "€0";
  return entries
    .map(([currency, cents]) =>
      new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: currency.toUpperCase(),
        maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
      }).format(cents / 100)
    )
    .join(" + ");
}

function shortDate(d: Date) {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Bratislava",
  });
}

async function settle<T>(promise: Promise<T>) {
  try {
    return { ok: true as const, data: await promise };
  } catch (error) {
    console.error("Dashboard data failed:", error);
    return { ok: false as const, message: (error as Error).message ?? String(error) };
  }
}

function Section({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold tracking-[-0.02em]">{title}</h2>
        {note && <p className="text-[13px] leading-[1.45] text-ink-muted">{note}</p>}
      </div>
      {children}
    </section>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 rounded-[14px] border border-border bg-white p-4 sm:p-5 ${className}`}>
      {children}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <Card>
      <div className="eyebrow text-[11px] text-ink-muted">{label}</div>
      <div className="mt-1 font-display text-[26px] leading-[1.1] tracking-[-0.02em]">{value}</div>
      {sub && <div className="mt-1 text-[13px] text-ink-muted">{sub}</div>}
    </Card>
  );
}

function Breakdown({ title, rows, empty = "Nothing yet." }: { title: string; rows: [string, ReactNode][]; empty?: string }) {
  return (
    <Card>
      <h3 className="mb-2 text-[15px] font-bold">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-[14px] text-ink-muted">{empty}</p>
      ) : (
        <table className="w-full text-[14px]">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} className="border-t border-border first:border-t-0">
                <td className="py-1.5 pr-3 break-all">{label}</td>
                <td className="py-1.5 text-right font-semibold whitespace-nowrap">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

function Failed({ what, message }: { what: string; message: string }) {
  return (
    <Card className="border-link">
      <p className="text-[14px]">
        Couldn&apos;t load {what}: <span className="text-ink-muted">{message}</span>
      </p>
    </Card>
  );
}

const grid2 = "grid grid-cols-2 gap-3 lg:grid-cols-4";
const gridCards = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3";

/** Owner dashboard (English, internal). Admin only, like /admin/leads. */
export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAdmin(user.email)) {
    return (
      <section className="container-page section-px flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-2xl font-bold">Not authorized</h1>
        <Link href="/admin/premium-content" className="text-link">
          Sign in on the admin page →
        </Link>
      </section>
    );
  }

  const p = periods();
  const [leads, traffic, money$, social] = await Promise.all([
    settle(getLeadStats(p)),
    settle(getTrafficStats(p)),
    settle(getStripeStats(p)),
    settle(getSocialStats()),
  ]);

  const L = leads.ok ? leads.data : null;
  const T = traffic.ok ? traffic.data : null;
  const S = money$.ok ? money$.data : null;

  const funnel: { label: string; thisMonth?: number; lastMonth?: number }[] = [
    { label: "Website visits", thisMonth: T?.visits.thisMonth, lastMonth: T?.visits.lastMonth },
    { label: "Email signups", thisMonth: L?.signups.thisMonth, lastMonth: L?.signups.lastMonth },
    { label: "Starter list downloads", thisMonth: L?.downloads.thisMonth, lastMonth: L?.downloads.lastMonth },
    { label: "Purchases", thisMonth: S?.purchases.thisMonth, lastMonth: S?.purchases.lastMonth },
  ];
  const fmt = (n?: number) => (n === undefined ? "—" : nf.format(n));

  return (
    <div className="container-page section-px flex flex-col gap-10 py-[clamp(24px,5vw,56px)]">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(28px,4vw,40px)] font-bold tracking-[-0.03em]">Dashboard</h1>
          <p className="text-[13px] text-ink-muted">
            Live data · {p.now.toLocaleString("en-GB", { timeZone: "Europe/Bratislava", dateStyle: "medium", timeStyle: "short" })} (Bratislava time)
          </p>
        </div>
        <nav className="flex gap-4 text-[14px]">
          <Link href="/admin/leads" className="text-link">Leads →</Link>
          <Link href="/admin/premium-content" className="text-link">Premium content →</Link>
        </nav>
      </header>

      <Section
        title="Funnel"
        note={`This month (from 1 ${p.thisMonthStart.toLocaleDateString("en-GB", { month: "long", timeZone: "Europe/Bratislava" })}) vs last month. Each arrow is the share that made it to the next step.`}
      >
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {funnel.map((step, i) => {
            const prev = funnel[i - 1];
            return (
              <li key={step.label}>
                <Card className="h-full">
                  <div className="eyebrow text-[11px] text-ink-muted">
                    {String(i + 1).padStart(2, "0")} · {step.label}
                  </div>
                  <div className="mt-1 font-display text-[30px] leading-[1.1]">{fmt(step.thisMonth)}</div>
                  <div className="mt-1 text-[13px] text-ink-muted">Last month: {fmt(step.lastMonth)}</div>
                  {prev && (
                    <div className="mt-2 text-[13px]">
                      ↳ {pct(step.thisMonth ?? 0, prev.thisMonth ?? 0)} of step {i}
                      <span className="text-ink-muted"> (last month {pct(step.lastMonth ?? 0, prev.lastMonth ?? 0)})</span>
                    </div>
                  )}
                </Card>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section title="Emails">
        {!L ? (
          <Failed what="leads" message={leads.ok ? "" : leads.message} />
        ) : (
          <>
            <div className={grid2}>
              <Stat label="Total leads" value={nf.format(L.total)} sub={`${nf.format(L.uniqueEmails)} unique emails`} />
              <Stat label="New" value={nf.format(L.newWeek)} sub={`last 7 days · ${nf.format(L.newMonth)} this month`} />
              <Stat label="Newsletter consent" value={nf.format(L.consenting)} sub={`${pct(L.consenting, L.starterTotal)} of starter list signups`} />
              <Stat label="Unsubscribed" value={nf.format(L.unsubscribed)} sub={pct(L.unsubscribed, L.total) + " of leads"} />
            </div>
            <Card>
              <h3 className="mb-2 text-[15px] font-bold">Signups per day · last 30 days</h3>
              <DailyBars data={L.daily} unit="signups" />
            </Card>
            <div className={gridCards}>
              <Breakdown title="By source" rows={L.bySource.map(([k, v]) => [k, nf.format(v)])} />
              <Breakdown
                title="By ref (?ref= link)"
                rows={L.byRef.map(([k, v]) => [{ ig: "ig · Instagram", tt: "tt · TikTok", yt: "yt · YouTube" }[k] ?? k, nf.format(v)])}
              />
              <Breakdown title="By utm_source" rows={L.byUtmSource.map(([k, v]) => [k, nf.format(v)])} empty="No UTM-tagged signups yet." />
              <Breakdown
                title={`Workshop waitlist (${nf.format(L.workshopTotal)})`}
                rows={L.workshopBySegment.map(([k, v]) => [
                  { "own-shop": "Runs own shop", "starting-shop": "Starting a shop", home: "Builds at home" }[k] ?? k,
                  nf.format(v),
                ])}
                empty="No workshop signups yet."
              />
            </div>
          </>
        )}
      </Section>

      <Section
        title="Starter list downloads"
        note="Counted when someone opens the PDF from the email link (first open per person). Emails sent before 4 Nov 2026 linked straight to the PDF, so those opens aren't counted."
      >
        {!L ? (
          <Failed what="downloads" message={leads.ok ? "" : leads.message} />
        ) : (
          <div className={gridCards}>
            <Stat
              label="Downloaded"
              value={nf.format(L.downloaded)}
              sub={`${pct(L.downloaded, L.starterSent)} of ${nf.format(L.starterSent)} leads who got the list`}
            />
            <Breakdown
              title="Per file (language)"
              rows={L.downloadsByFile.map(([k, v]) => [`tallwoodmaker-starter-list-${k}.pdf`, nf.format(v)])}
              empty="No tracked downloads yet."
            />
          </div>
        )}
      </Section>

      <Section title="Revenue (Stripe)" note="TallWoodMaker only (MebCut shares the Stripe account and is left out). Amounts paid incl. VAT, before refunds. Purchases = completed checkouts (shop + Premium).">
        {!S ? (
          <Failed what="Stripe" message={money$.ok ? "" : money$.message} />
        ) : (
          <>
            <div className={grid2}>
              <Stat label="This month" value={money(S.revenue.thisMonth)} />
              <Stat label="Last 30 days" value={money(S.revenue.last30)} />
              <Stat label="All time" value={money(S.revenue.allTime)} sub={S.truncated ? "first 5,000 checkouts only" : `incl. ${money(S.premiumRevenue)} Premium`} />
              <Stat label="Workshop" value={S.workshop.orders ? money(S.workshop.revenue) : "Not on sale yet"} sub={S.workshop.orders ? `${nf.format(S.workshop.orders)} sold` : "Shows up once the workshop is sold through Stripe"} />
            </div>
            <div className={grid2}>
              <Stat label="Active Premium" value={nf.format(S.activeSubscribers)} sub="subscribers" />
              <Stat label="MRR" value={money(S.mrr)} sub="monthly recurring revenue" />
              <Stat label="Cancellations" value={nf.format(S.cancellations.thisMonth)} sub={`this month · ${nf.format(S.cancellations.lastMonth)} last month`} />
              <Stat label="Cancelling" value={nf.format(S.cancellations.scheduled)} sub="active, set to end at period end" />
            </div>
            <Breakdown
              title="Orders by product (shop)"
              rows={S.products.map(([name, v]) => [name, `${nf.format(v.orders)} · ${money(v.revenue)}`])}
              empty="No shop orders yet."
            />
          </>
        )}
      </Section>

      <Section
        title="Website traffic"
        note={
          T?.since
            ? `First-party, cookieless page views since ${shortDate(T.since)}. A visit = a landing on the site from outside. Bots, admin pages, preview deploys and your own devices (any device you've used while signed in as admin) aren't counted.`
            : "First-party, cookieless page views. Nothing recorded yet: counting starts with this deploy."
        }
      >
        {!T ? (
          <Failed what="traffic" message={traffic.ok ? "" : traffic.message} />
        ) : (
          <>
            <div className={grid2}>
              <Stat label="Visits" value={nf.format(T.visits30)} sub="last 30 days" />
              <Stat label="Page views" value={nf.format(T.views30)} sub="last 30 days" />
              <Stat
                label="/start conversion"
                value={pct(L?.startSignupsThisMonth ?? 0, T.startViewsThisMonth)}
                sub={`${count(L?.startSignupsThisMonth ?? 0, "signup")} / ${count(T.startViewsThisMonth, "view")} this month`}
              />
              <Stat
                label="/workshop conversion"
                value={pct(L?.workshopSignupsThisMonth ?? 0, T.workshopViewsThisMonth)}
                sub={`${count(L?.workshopSignupsThisMonth ?? 0, "signup")} / ${count(T.workshopViewsThisMonth, "view")} this month`}
              />
            </div>
            <Card>
              <h3 className="mb-2 text-[15px] font-bold">Visits per day · last 30 days</h3>
              <DailyBars data={T.daily} unit="visits" />
            </Card>
            <div className={gridCards}>
              <Breakdown
                title="Top pages · last 30 days"
                rows={T.topPages.map(([path, v]) => [path, count(v.views, "view")])}
                empty="No page views yet."
              />
              <Breakdown
                title="Visits by source · last 30 days"
                rows={T.bySource.map(([k, v]) => [k, nf.format(v)])}
                empty="No visits yet."
              />
            </div>
          </>
        )}
      </Section>

      <Section title="Social" note="Enter each platform's numbers once a week (Monday = start of the week).">
        {!social.ok ? (
          <Failed what="social stats" message={social.message} />
        ) : (
          <>
            <Card>
              <h3 className="mb-3 text-[15px] font-bold">Followers</h3>
              <FollowersChart rows={social.data} />
            </Card>
            <Card>
              <h3 className="mb-3 text-[15px] font-bold">Add this week</h3>
              <SocialForm weekStart={currentWeekStart(p.now)} />
            </Card>
            {social.data.length > 0 && (
              <Card className="overflow-x-auto">
                <h3 className="mb-2 text-[15px] font-bold">Weekly entries</h3>
                <table className="w-full min-w-[640px] text-left text-[13px]">
                  <thead className="text-ink-muted">
                    <tr>
                      {["Week", "Platform", "Followers", "Views", "Saves", "Comments", "Profile visits", "Link clicks", "Best post"].map((h) => (
                        <th key={h} className="py-1.5 pr-3 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...social.data].reverse().slice(0, 24).map((r) => (
                      <tr key={r.id} className="border-t border-border">
                        <td className="py-1.5 pr-3 whitespace-nowrap">{r.week_start}</td>
                        <td className="py-1.5 pr-3">{PLATFORM_LABELS[r.platform]}</td>
                        {[r.followers, r.views, r.saves, r.comments, r.profile_visits, r.link_clicks].map((v, i) => (
                          <td key={i} className="py-1.5 pr-3 text-right">{v === null ? "—" : nf.format(v)}</td>
                        ))}
                        <td className="py-1.5 pr-3">
                          {r.best_post_url ? (
                            <a href={r.best_post_url} target="_blank" rel="noopener noreferrer" className="text-link underline">
                              link
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
          </>
        )}
      </Section>
    </div>
  );
}
