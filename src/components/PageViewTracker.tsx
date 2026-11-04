"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// The first view since the page was loaded is the visit's landing page;
// later client-side navigations are further pages of the same visit.
let firstView = true;

/**
 * Cookieless page view beacon for /admin/dashboard (src/app/api/pv). Sends
 * the path on every navigation, plus the query string and referrer on the
 * landing page so the visit can be attributed to Instagram/TikTok/YouTube.
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const entry = firstView;
    firstView = false;
    const body = JSON.stringify({
      p: pathname,
      e: entry,
      s: entry ? window.location.search : "",
      r: entry ? document.referrer : "",
    });
    if (!navigator.sendBeacon?.("/api/pv", body)) {
      fetch("/api/pv", { method: "POST", body, keepalive: true }).catch(
        () => {}
      );
    }
  }, [pathname]);

  return null;
}
