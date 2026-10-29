import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import CountdownTimer from "./CountdownTimer";
import WaitlistForm from "./WaitlistForm";
import MagicLinkForm from "./MagicLinkForm";
import { createCheckoutSession } from "./actions";
import { PREMIUM_LAUNCH_DATE, isPremiumLaunched } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { getSubscriberByEmail, hasActiveSubscription } from "@/lib/subscribers";
import { listPublishedContent } from "@/lib/premiumContent";
import ImageSlot from "@/components/ImageSlot";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/premium/subscribe">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.subscribe" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/premium/subscribe",
    title: t("title"),
    description: t("description"),
  });
}

const KNOWN_TYPES = ["article", "video", "plan_download", "announcement"];

// The fallback benefit list and the FAQ live in messages/<locale>.json
// under subscribe.fallbackBenefits / subscribe.faq — edit them there.

export default async function SubscribePage({
  params,
  searchParams,
}: PageProps<"/[locale]/premium/subscribe">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subscribe");
  const tTypes = await getTranslations("premium.types");
  const typeLabel = (type: string) =>
    KNOWN_TYPES.includes(type) ? tTypes(type) : type;
  const launchOpen = isPremiumLaunched();

  if (!launchOpen) {
    return (
      <>
          <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)] text-center">
          <span className="mb-5 inline-block rounded-full bg-ink px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.03em] text-brand">
            {t("badge")}
          </span>
          <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-bold leading-[1.05] tracking-[-0.02em]">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-[520px] text-[17px] leading-[1.6] text-ink-muted">
            {t("waitlistText")}
          </p>
        </section>

        <section className="container-page section-px border-t border-border pb-12 pt-12">
          <CountdownTimer target={PREMIUM_LAUNCH_DATE} />
        </section>

        <section className="container-page section-px flex justify-center pb-[clamp(24px,5vw,64px)]">
          <div className="w-full max-w-[480px] rounded-md border border-border p-8 text-center">
            <span className="mb-4 inline-block rounded-full bg-brand px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.03em] text-ink">
              {t("launchOffer")}
            </span>
            <h2 className="mb-2 text-xl font-bold">
              {t("launchTitle")}
            </h2>
            <p className="mb-6 text-[15px] text-ink-muted">
              {t("launchText")}
            </p>
            <WaitlistForm />
          </div>
        </section>
      </>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email) {
    const subscriber = await getSubscriberByEmail(user.email);
    if (hasActiveSubscription(subscriber)) {
      return redirect({ href: "/premium", locale });
    }
  }

  const { error } = await searchParams;

  // Teaser section only ever shows the most recent few, so the page stays
  // short and visitors reach pricing without endless scrolling.
  const MAX_TEASER_ITEMS = 4;
  const published = (await listPublishedContent())
    .slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, MAX_TEASER_ITEMS);

  return (
    <>
      {/* Hero */}
      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)] text-center">
        <span className="mb-5 inline-block rounded-full bg-ink px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.03em] text-brand">
          {t("badge")}
        </span>
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-bold leading-[1.05] tracking-[-0.02em]">
          {t("title")}
        </h1>
        <p className="mx-auto max-w-[520px] text-[17px] leading-[1.6] text-ink-muted">
          {t("heroText")}
        </p>
      </section>

      {/* What's included */}
      <section className="container-page section-px border-t border-border py-12">
        <h2 className="mb-2 text-center text-2xl font-bold">
          {t("included")}
        </h2>

        {published.length > 0 ? (
          <>
            <p className="mx-auto mb-8 max-w-[560px] text-center text-[15px] leading-[1.6] text-ink-muted">
              {t("previewText")}
            </p>
            <div className="mx-auto grid max-w-[920px] gap-6 sm:grid-cols-2">
              {published.map((entry) => (
                <div
                  key={entry.id}
                  className="overflow-hidden rounded-md border border-border"
                >
                  <div className="relative aspect-video overflow-hidden bg-ink/[0.05]">
                    {entry.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={entry.thumbnail_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageSlot
                        placeholder={KNOWN_TYPES.includes(entry.content_type) ? typeLabel(entry.content_type) : t("preview")}
                        className="h-full w-full"
                      />
                    )}
                    <span className="absolute right-2 top-2 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-brand">
                      {t("membersOnly")}
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="mb-2 inline-block rounded-full bg-ink/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-ink-muted">
                      {typeLabel(entry.content_type)}
                    </span>
                    <h3 className="mb-1 text-[15px] font-bold leading-[1.4] text-ink">
                      {entry.title}
                    </h3>
                    {entry.description && (
                      <p className="text-[13px] leading-[1.5] text-ink-muted">
                        {entry.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <ul className="mx-auto grid max-w-[640px] gap-3.5">
            {(t.raw("fallbackBenefits") as string[]).map((label, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 h-5 w-5 flex-none rounded-full bg-brand text-center text-[13px] font-bold leading-5 text-ink">
                  ✓
                </span>
                <span className="text-[15px] leading-[1.6] text-ink">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Pricing + CTA */}
      <section className="container-page section-px flex justify-center border-t border-border py-[clamp(24px,5vw,64px)]">
        <div className="w-full max-w-[480px] rounded-md border border-border p-8 text-center">
          <span className="mb-4 inline-block rounded-full bg-brand px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.03em] text-ink">
            {t("offerBadge")}
          </span>
          <div className="mb-1 text-[clamp(36px,6vw,48px)] font-extrabold leading-none">
            {t("price")}<span className="text-[18px] font-semibold text-ink-muted">{t("perMonth")}</span>
          </div>
          <p className="mb-6 text-[15px] text-ink-muted">
            {t("codeText")}
          </p>

          {user?.email ? (
            <form action={createCheckoutSession}>
              <label className="mb-4 flex items-start gap-2 text-left text-[12px] leading-[1.5] text-ink-muted">
                <input
                  type="checkbox"
                  name="immediateAccessConsent"
                  value="true"
                  required
                  className="mt-0.5"
                />
                <span>
                  {t.rich("consent", {
                    terms: (chunks) => (
                      <Link href="/terms" className="underline">
                        {chunks}
                      </Link>
                    ),
                  })}
                </span>
              </label>
              {error === "consent" && (
                <p className="mb-3 text-[13px] text-link">
                  {t("consentError")}
                </p>
              )}
              <button
                type="submit"
                className="w-full cursor-pointer rounded bg-brand px-6 py-3.5 text-[16px] font-bold text-ink"
              >
                {t("subscribeCta")}
              </button>
            </form>
          ) : (
            <div>
              <p className="mb-4 text-[15px] font-semibold text-ink">
                {t("signInPrompt")}
              </p>
              <MagicLinkForm />
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page section-px border-t border-border py-[clamp(24px,5vw,64px)]">
        <h2 className="mb-6 text-center text-2xl font-bold">
          {t("faqTitle")}
        </h2>
        <dl className="mx-auto grid max-w-[640px] gap-6">
          {(t.raw("faq") as { q: string; a: string }[]).map((item) => (
            <div key={item.q}>
              <dt className="mb-1 text-[15px] font-bold">{item.q}</dt>
              <dd className="text-[15px] leading-[1.6] text-ink-muted">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
