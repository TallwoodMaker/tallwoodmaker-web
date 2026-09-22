"use client";

import Link from "next/link";
import { useConsent } from "./ConsentContext";

export default function CookieBanner() {
  const {
    showBanner,
    showPreferences,
    acceptAll,
    rejectNonEssential,
    openPreferences,
  } = useConsent();

  // Hide behind the preferences modal rather than stacking both — showBanner
  // itself stays derived purely from ready/hasDecision in ConsentContext.
  if (!showBanner || showPreferences) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pb-4 sm:pb-6">
      <div className="container-page section-px">
        <div className="flex flex-col gap-4 rounded-2xl bg-ink px-6 py-6 text-cream shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] leading-[1.6] text-cream/85">
            We use cookies to keep the site running and, with your consent,
            to understand how it&apos;s used. See our{" "}
            <Link
              href="/cookies"
              className="text-cream underline underline-offset-2 hover:text-brand"
            >
              Cookie Policy
            </Link>{" "}
            for details.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openPreferences}
              className="cursor-pointer text-[14px] font-semibold text-cream underline underline-offset-2 hover:text-brand"
            >
              Manage preferences
            </button>
            <button
              type="button"
              onClick={rejectNonEssential}
              className="cursor-pointer rounded-full border border-cream/30 px-5 py-2.5 text-[14px] font-semibold text-cream hover:border-cream"
            >
              Reject non-essential
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="cursor-pointer rounded-full bg-brand px-5 py-2.5 text-[14px] font-bold text-ink"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
