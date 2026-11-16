"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/components/cookies/ConsentContext";
import {
  META_PIXEL_ID,
  disableMetaPixel,
  enableMetaPixel,
  trackPixel,
  type PixelEvent,
} from "@/lib/metaPixel";

/**
 * Meta Pixel, strictly behind the cookie banner: nothing from Meta is
 * requested until the visitor accepts marketing cookies, and tracking stops
 * if they withdraw. Sends PageView on every page. Renders nothing, and does
 * nothing at all until NEXT_PUBLIC_META_PIXEL_ID is set.
 *
 * Because the pixel only sees visitors who consented, /admin/leads (not
 * Ads Manager) is the source of truth for the ad test.
 */
export default function MetaPixel() {
  const { ready, consent } = useConsent();
  const pathname = usePathname();

  useEffect(() => {
    if (!META_PIXEL_ID || !ready) return;
    if (consent.marketing) {
      enableMetaPixel();
      trackPixel("PageView");
    } else {
      disableMetaPixel();
    }
  }, [ready, consent.marketing, pathname]);

  return null;
}

/**
 * Sends one pixel event when rendered (and marketing consent is given).
 * With `onceKey`, the event is sent at most once per browser, so reloading
 * the order confirmation page doesn't count the purchase twice.
 */
export function MetaPixelEvent({
  event,
  params,
  onceKey,
}: {
  event: PixelEvent;
  params?: Record<string, unknown>;
  onceKey?: string;
}) {
  const { ready, consent } = useConsent();
  const serialized = JSON.stringify(params ?? null);

  useEffect(() => {
    if (!META_PIXEL_ID || !ready || !consent.marketing) return;
    const storageKey = onceKey ? `twm_px_${onceKey}` : null;
    try {
      if (storageKey && localStorage.getItem(storageKey)) return;
      if (storageKey) localStorage.setItem(storageKey, "1");
    } catch {
      // Storage blocked: send anyway, eventID still lets Meta deduplicate.
    }
    // Rendered after <MetaPixel> in the tree, so the pixel is already on.
    enableMetaPixel();
    trackPixel(event, JSON.parse(serialized) ?? undefined, onceKey);
  }, [ready, consent.marketing, event, serialized, onceKey]);

  return null;
}
