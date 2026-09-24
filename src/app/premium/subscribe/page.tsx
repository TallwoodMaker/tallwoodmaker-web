import type { Metadata } from "next";
import { redirect } from "next/navigation";
import CountdownTimer from "./CountdownTimer";
import WaitlistForm from "./WaitlistForm";
import MagicLinkForm from "./MagicLinkForm";
import { createCheckoutSession } from "./actions";
import { PREMIUM_LAUNCH_DATE, isPremiumLaunched } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { getSubscriberByEmail, hasActiveSubscription } from "@/lib/subscribers";
import { listPublishedContent } from "@/lib/premiumContent";
import ImageSlot from "@/components/ImageSlot";

export const metadata: Metadata = {
  title: "Premium",
  description:
    "Full builds, extended cuts, and shop files for TallWoodMaker Premium members. €9/month, cancel anytime.",
};

const TYPE_LABEL: Record<string, string> = {
  video: "Video",
  plan_download: "Download",
  announcement: "Update",
  article: "Article",
};

// Shown under "What's included" until real premium_content entries are
// published (see src/lib/premiumContent.ts) — replace/edit freely.
const FALLBACK_BENEFITS = [
  "Full build videos, start to finish — every step, not just the highlights",
  "Extended cuts and shop tours beyond what's on YouTube",
  "Downloadable plans and cut lists for select builds",
  "New content added every month",
  "Cancel anytime, no long-term commitment",
];

const FAQ_ITEMS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your account whenever you like — you'll keep access until the end of the billing period you already paid for.",
  },
  {
    q: "How does billing work?",
    a: "€9/month, billed automatically until you cancel. No annual contract.",
  },
  {
    q: "What happens right after I sign up?",
    a: "You'll get a sign-in link by email, then land straight on checkout. Access unlocks as soon as payment completes.",
  },
  {
    q: "What do I actually get?",
    a: "Everything in \"What's included\" below, plus anything new added to Premium during your membership.",
  },
];

export default async function SubscribePage() {
  const launchOpen = isPremiumLaunched();

  if (!launchOpen) {
    return (
      <>
        <div className="h-2 bg-brand" />

        <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)] text-center">
          <span className="mb-5 inline-block rounded-full bg-ink px-4 py-1.5 text-[13px] font-bold tracking-[0.03em] text-brand">
            PREMIUM
          </span>
          <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
            TallWoodMaker Premium
          </h1>
          <p className="mx-auto max-w-[520px] text-[17px] leading-[1.6] text-ink-muted">
            Full builds, extended cuts, and shop files for members. Premium
            access opens soon — join the waitlist to be first in line.
          </p>
        </section>

        <section className="container-page section-px border-t border-border pb-12 pt-12">
          <CountdownTimer target={PREMIUM_LAUNCH_DATE} />
        </section>

        <section className="container-page section-px flex justify-center pb-[clamp(24px,5vw,64px)]">
          <div className="w-full max-w-[480px] rounded-md border border-border p-8 text-center">
            <span className="mb-4 inline-block rounded-full bg-brand px-4 py-1.5 text-[13px] font-bold tracking-[0.03em] text-ink">
              LAUNCH OFFER
            </span>
            <h2 className="mb-2 text-xl font-bold">
              Sign up now and get 50% off your first 3 months
            </h2>
            <p className="mb-6 text-[15px] text-ink-muted">
              Waitlist members get first access when doors open, plus the
              discount applied automatically at checkout.
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
      redirect("/premium");
    }
  }

  const published = await listPublishedContent();

  return (
    <>
      <div className="h-2 bg-brand" />

      {/* Hero */}
      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)] text-center">
        <span className="mb-5 inline-block rounded-full bg-ink px-4 py-1.5 text-[13px] font-bold tracking-[0.03em] text-brand">
          PREMIUM
        </span>
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          TallWoodMaker Premium
        </h1>
        <p className="mx-auto max-w-[520px] text-[17px] leading-[1.6] text-ink-muted">
          Full builds, extended cuts, and shop files — the stuff that doesn&apos;t
          fit on YouTube. Join for €9/month and get access right away.
        </p>
      </section>

      {/* What's included */}
      <section className="container-page section-px border-t border-border py-12">
        <h2 className="mb-2 text-center text-2xl font-bold">
          What&apos;s included
        </h2>

        {published.length > 0 ? (
          <>
            <p className="mx-auto mb-8 max-w-[560px] text-center text-[15px] leading-[1.6] text-ink-muted">
              A preview of what&apos;s waiting inside — new content added
              every month.
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
                        placeholder={TYPE_LABEL[entry.content_type] ?? "preview"}
                        className="h-full w-full"
                      />
                    )}
                    <span className="absolute right-2 top-2 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-brand">
                      Members only
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="mb-2 inline-block rounded-full bg-ink/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-ink-muted">
                      {TYPE_LABEL[entry.content_type] ?? entry.content_type}
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
            {FALLBACK_BENEFITS.map((label, i) => (
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
          <span className="mb-4 inline-block rounded-full bg-brand px-4 py-1.5 text-[13px] font-bold tracking-[0.03em] text-ink">
            LAUNCH OFFER — 50% OFF YOUR FIRST 3 MONTHS
          </span>
          <div className="mb-1 text-[clamp(36px,6vw,48px)] font-extrabold leading-none">
            €9<span className="text-[18px] font-semibold text-ink-muted">/month</span>
          </div>
          <p className="mb-6 text-[15px] text-ink-muted">
            Have a launch code? Enter it at checkout for 50% off your first 3
            months.
          </p>

          {user?.email ? (
            <form action={createCheckoutSession}>
              <button
                type="submit"
                className="w-full cursor-pointer rounded bg-brand px-6 py-3.5 text-[16px] font-bold text-ink"
              >
                Subscribe now — €9/month
              </button>
            </form>
          ) : (
            <div>
              <p className="mb-4 text-[15px] font-semibold text-ink">
                Enter your email to sign in and continue to checkout
              </p>
              <MagicLinkForm />
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page section-px border-t border-border py-[clamp(24px,5vw,64px)]">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Good to know
        </h2>
        <dl className="mx-auto grid max-w-[640px] gap-6">
          {FAQ_ITEMS.map((item) => (
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
