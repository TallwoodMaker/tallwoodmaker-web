import type { Metadata } from "next";
import CookieSettingsLink from "@/components/cookies/CookieSettingsLink";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What cookies TallWoodMaker uses, and why.",
};

const CATEGORIES = [
  {
    name: "Necessary",
    blurb: "Required for the site to work. These are always on.",
    cookies: [
      {
        name: "sb-*-auth-token",
        purpose: "Supabase — keeps you signed in.",
        duration: "Up to 400 days",
      },
      {
        name: "__stripe_mid / __stripe_sid",
        purpose: "Stripe — fraud prevention during checkout.",
        duration: "Session to 1 year",
      },
      {
        name: "twm-cookie-consent",
        purpose: "Remembers your cookie choice so we don't ask again.",
        duration: "1 year",
      },
    ],
  },
  {
    name: "Analytics",
    blurb: "Only set if you opt in. Helps us understand how the site is used.",
    cookies: [
      {
        name: "_ga",
        purpose: "Google Analytics — distinguishes visitors.",
        duration: "2 years",
      },
      {
        name: "_ga_*",
        purpose: "Google Analytics — persists session state.",
        duration: "2 years",
      },
    ],
  },
  {
    name: "Marketing",
    blurb: "Only set if you opt in. Used to measure and personalize ads.",
    cookies: [
      {
        name: "_fbp",
        purpose: "Meta Pixel — ad measurement and personalization.",
        duration: "3 months",
      },
    ],
  },
];

export default function CookiesPage() {
  return (
    <>
      <div className="h-2 bg-brand" />

      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)]">
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Cookie Policy
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          This page lists the cookies TallWoodMaker uses, grouped by category.
          Analytics and marketing cookies are only ever set after you opt in.
        </p>
      </section>

      <section className="container-page section-px grid gap-10 border-t border-border pb-[clamp(24px,5vw,64px)] pt-12">
        {CATEGORIES.map((category) => (
          <div key={category.name}>
            <h2 className="mb-1 text-xl font-bold">{category.name}</h2>
            <p className="mb-4 text-sm text-ink-muted">{category.blurb}</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-left text-[14px]">
                <thead>
                  <tr className="border-b border-border text-[12px] font-bold uppercase tracking-[0.05em] text-ink-muted">
                    <th className="py-2 pr-4">Cookie</th>
                    <th className="py-2 pr-4">Purpose</th>
                    <th className="py-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {category.cookies.map((cookie) => (
                    <tr key={cookie.name} className="border-b border-border">
                      <td className="py-3 pr-4 font-mono text-[13px]">
                        {cookie.name}
                      </td>
                      <td className="py-3 pr-4 text-ink-muted">
                        {cookie.purpose}
                      </td>
                      <td className="py-3 text-ink-muted">
                        {cookie.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div>
          <CookieSettingsLink className="cursor-pointer rounded-full border border-ink px-5 py-2.5 text-[14px] font-semibold text-ink" />
        </div>
      </section>
    </>
  );
}
