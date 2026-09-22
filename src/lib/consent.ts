/**
 * First-party cookie consent storage. Client-only (document.cookie) — every
 * export here is guarded for typeof document === "undefined" so it's safe
 * to import from a "use client" component that also renders server-side.
 */

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export type StoredConsent = ConsentState & {
  version: number;
  updatedAt: string;
};

export const CONSENT_COOKIE_NAME = "twm-cookie-consent";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 365;

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const escaped = name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeDays: number): void {
  if (typeof document === "undefined") return;
  const maxAge = maxAgeDays * 24 * 60 * 60;
  // Secure only over https — a plain "Secure" cookie is silently rejected
  // by the browser on http (local dev), which would otherwise break the
  // banner locally.
  const secure =
    typeof location !== "undefined" && location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

function isStoredConsent(value: unknown): value is StoredConsent {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    v.necessary === true &&
    typeof v.analytics === "boolean" &&
    typeof v.marketing === "boolean" &&
    typeof v.version === "number" &&
    typeof v.updatedAt === "string"
  );
}

export function readStoredConsent(): StoredConsent | null {
  const raw = getCookie(CONSENT_COOKIE_NAME);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isStoredConsent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStoredConsent(
  choice: Pick<ConsentState, "analytics" | "marketing">
): StoredConsent {
  const stored: StoredConsent = {
    necessary: true,
    analytics: choice.analytics,
    marketing: choice.marketing,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
  setCookie(CONSENT_COOKIE_NAME, JSON.stringify(stored), CONSENT_MAX_AGE_DAYS);
  return stored;
}
