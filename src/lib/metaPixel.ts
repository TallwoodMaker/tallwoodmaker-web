/**
 * Meta Pixel helpers (client-only). The pixel script is loaded by
 * <MetaPixel> and only after the visitor has accepted marketing cookies;
 * until then window.fbq doesn't exist and every call here does nothing.
 */

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

// False again after marketing consent is withdrawn on a page where the
// pixel was already loaded.
let enabled = false;

/** Loads the pixel (once) and turns tracking on. Call only with consent. */
export function enableMetaPixel(): void {
  if (!META_PIXEL_ID || typeof window === "undefined") return;
  if (!window.fbq) {
    // Meta's standard bootstrap: a queueing stub until fbevents.js arrives.
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as Fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
    fbq("init", META_PIXEL_ID);
  } else if (!enabled) {
    // Back on after a withdrawal on this same page.
    window.fbq("consent", "grant");
  }
  enabled = true;
}

/** Stops tracking after consent is withdrawn. */
export function disableMetaPixel(): void {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("consent", "revoke");
  enabled = false;
}

export type PixelEvent =
  | "PageView"
  | "Lead"
  | "InitiateCheckout"
  | "Purchase";

/**
 * Sends a standard event if the pixel is on; otherwise does nothing.
 * `eventId` lets Meta drop a repeated event (e.g. a reloaded page).
 */
export function trackPixel(
  event: PixelEvent,
  params?: Record<string, unknown>,
  eventId?: string
): void {
  if (!enabled || typeof window === "undefined" || !window.fbq) return;
  if (eventId) window.fbq("track", event, params ?? {}, { eventID: eventId });
  else if (params) window.fbq("track", event, params);
  else window.fbq("track", event);
}
