import type { Metadata } from "next";
import CountdownTimer from "./CountdownTimer";
import WaitlistForm from "./WaitlistForm";
import { PREMIUM_LAUNCH_DATE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Premium — Launching Soon",
  description:
    "TallWoodMaker Premium launches September 11, 2026. Join the waitlist for early access and a launch discount.",
};

export default function SubscribePage() {
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
          access opens on September 11, 2026 — join the waitlist to be first
          in line.
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
