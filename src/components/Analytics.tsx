"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useConsent } from "@/components/cookies/ConsentContext";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics via Consent Mode v2: gtag.js always loads (with consent
 * defaulted to denied), and an explicit gtag('consent','update', …) fires
 * once the visitor has made a choice or changes it — this is the
 * Google-recommended pattern for staying compliant while still using GA in
 * the EEA. Renders nothing until NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 *
 * Meta Pixel (or any other marketing pixel) should follow this same shape
 * when added: always load the base script, but gate its actual tracking
 * calls on consent.marketing via the same useConsent() check below — never
 * fire pixel events before the visitor has granted marketing consent.
 */
export default function Analytics() {
  const { ready, consent } = useConsent();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!gaId || !ready || typeof window.gtag !== "function") return;
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
    });
  }, [ready, consent, gaId]);

  if (!gaId) return null;

  return (
    <>
      {/*
        eslint-disable-next-line @next/next/no-before-interactive-script-outside-document --
        False positive: this rule's path check only recognizes files under
        src/app/, but Analytics.tsx (src/components/) is rendered directly
        from the App Router root layout (src/app/layout.tsx), which Next's
        own docs confirm is the correct place for beforeInteractive scripts
        in App Router — "cookie consent managers" is even their example.
      */}
      <Script id="consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = function(){ window.dataLayer.push(arguments); };
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
