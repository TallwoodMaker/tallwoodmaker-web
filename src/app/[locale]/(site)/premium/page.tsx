import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { getSubscriberByEmail, hasActiveSubscription } from "@/lib/subscribers";
import { listPublishedContent, type PremiumContent } from "@/lib/premiumContent";
import { renderMarkdown } from "@/lib/markdown";
import PremiumFeed, { type FeedEntry } from "./PremiumFeed";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/premium">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.premium" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/premium",
    title: t("title"),
    description: t("description"),
    noindex: true,
  });
}

function byRecency(a: PremiumContent, b: PremiumContent) {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

export default async function PremiumPage({ params }: PageProps<"/[locale]/premium">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("premium");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return redirect({ href: "/premium/subscribe", locale });
  }

  const subscriber = await getSubscriberByEmail(user.email);
  if (!hasActiveSubscription(subscriber)) {
    return redirect({ href: "/premium/subscribe", locale });
  }

  const entries = await listPublishedContent();

  // Announcements stay pinned above the tabs/feed regardless of which tab
  // is active — top 3, most recent first.
  const announcements = entries
    .filter((e) => e.content_type === "announcement")
    .sort(byRecency)
    .slice(0, 3);

  // Everything else feeds the tab bar (All/Articles/Videos/Downloads),
  // most-recent-first across the whole mixed set. Article bodies are
  // rendered to HTML here (server-side) rather than shipping markdown-it
  // to every visitor's client bundle.
  const feedEntries: FeedEntry[] = entries
    .filter((e) => e.content_type !== "announcement")
    .sort(byRecency)
    .map((e) =>
      e.content_type === "article"
        ? { ...e, bodyHtml: renderMarkdown(e.body_markdown ?? "") }
        : e
    );

  return (
    <>
      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)]">
        <span className="mb-5 inline-block rounded-full bg-ink px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.03em] text-brand">
          {t("badge")}
        </span>
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-bold leading-[1.05] tracking-[-0.03em]">
          {t("title")}
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          {t("text")}
        </p>
      </section>

      {entries.length === 0 ? (
        <section className="container-page section-px border-t border-border pb-[clamp(24px,5vw,64px)] pt-12">
          <p className="text-[15px] text-ink-muted">
            {t("empty")}
          </p>
        </section>
      ) : (
        <div className="border-t border-border pb-[clamp(24px,5vw,64px)] pt-12">
          {announcements.length > 0 && (
            <section className="container-page section-px mb-12">
              <h2 className="mb-4 text-xl font-bold">{t("announcements")}</h2>
              <div className="grid gap-3 rounded-md bg-ink p-5 text-brand">
                {announcements.map((entry) => (
                  <div key={entry.id}>
                    <div className="font-semibold">{entry.title}</div>
                    {entry.description && (
                      <div className="text-[14px] text-brand/80">
                        {entry.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="container-page section-px">
            <PremiumFeed entries={feedEntries} />
          </section>
        </div>
      )}
    </>
  );
}
