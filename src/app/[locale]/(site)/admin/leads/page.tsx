import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";
import { Link } from "@/i18n/navigation";
import { LEAD_MAGNET } from "@/config/leadMagnet";
import SendPendingButton from "./SendPendingButton";

export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

type Lead = {
  id: string;
  email: string;
  source: string;
  path: string | null;
  locale: string | null;
  ref: string | null;
  marketing_consent: boolean;
  starter_sent_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
};

function countBy(leads: Lead[], key: "source" | "locale" | "ref") {
  const counts = new Map<string, number>();
  for (const lead of leads) {
    const value = lead[key] ?? "—";
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

/** Admin-only list of lead magnet / waitlist signups (English, internal). */
export default async function AdminLeadsPage() {
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

  const { data, error } = await createAdminClient()
    .from("leads")
    .select(
      "id, email, source, path, locale, ref, marketing_consent, starter_sent_at, unsubscribed_at, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(5000);

  const leads = (data ?? []) as Lead[];
  const pendingStarter = leads.filter(
    (l) => l.source === "starter-list" && !l.starter_sent_at && !l.unsubscribed_at
  ).length;
  const consenting = leads.filter(
    (l) => l.marketing_consent && !l.unsubscribed_at
  ).length;

  return (
    <section className="container-page section-px py-[clamp(24px,5vw,64px)]">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads ({leads.length})</h1>
        <Link href="/admin/premium-content" className="text-sm text-link">
          Premium content →
        </Link>
      </div>

      <div className="mb-8 flex flex-col gap-2 rounded-xl border border-border bg-white p-5">
        <p className="text-[14px] text-ink-muted">
          Newsletter consent (not unsubscribed): <strong className="text-ink">{consenting}</strong>
        </p>
        <SendPendingButton
          pendingCount={pendingStarter}
          disabledReason={
            LEAD_MAGNET.starterListUrl
              ? undefined
              : "Set starterListUrl in src/config/leadMagnet.ts to enable."
          }
        />
      </div>

      {error && (
        <p className="mb-6 text-link">Couldn&apos;t load leads: {error.message}</p>
      )}

      <div className="mb-10 grid gap-6 sm:grid-cols-3">
        {(["source", "locale", "ref"] as const).map((key) => (
          <div key={key} className="rounded-xl border border-border bg-white p-5">
            <h2 className="mb-3 font-semibold">By {key}</h2>
            <table className="w-full text-[14px]">
              <tbody>
                {countBy(leads, key).map(([value, count]) => (
                  <tr key={value} className="border-t border-border">
                    <td className="py-1.5">{value}</td>
                    <td className="py-1.5 text-right font-semibold">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-sand">
            <tr>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Path</th>
              <th className="px-3 py-2">Locale</th>
              <th className="px-3 py-2">Ref</th>
              <th className="px-3 py-2">Newsletter</th>
              <th className="px-3 py-2">List sent</th>
              <th className="px-3 py-2">Unsubscribed</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-border">
                <td className="px-3 py-2">{lead.email}</td>
                <td className="px-3 py-2">{lead.source}</td>
                <td className="px-3 py-2">{lead.path ?? "—"}</td>
                <td className="px-3 py-2">{lead.locale ?? "—"}</td>
                <td className="px-3 py-2">{lead.ref ?? "—"}</td>
                <td className="px-3 py-2">{lead.marketing_consent ? "yes" : "no"}</td>
                <td className="whitespace-nowrap px-3 py-2">{lead.starter_sent_at ? new Date(lead.starter_sent_at).toISOString().slice(0, 10) : "—"}</td>
                <td className="whitespace-nowrap px-3 py-2">{lead.unsubscribed_at ? new Date(lead.unsubscribed_at).toISOString().slice(0, 10) : "—"}</td>
                <td className="whitespace-nowrap px-3 py-2">
                  {new Date(lead.created_at).toISOString().slice(0, 16).replace("T", " ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
