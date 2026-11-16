/**
 * Traffic-source tracking for leads. A visit with ?ref=ig|tt|yt (social
 * profiles) or ?ref=ad-1|ad-2|ad-3 (paid ads) stores the value in this
 * cookie for 30 days — only with analytics consent
 * (src/components/cookies/RefTracker.tsx). Any lead form submitted meanwhile
 * saves it to leads.ref (src/lib/leads.ts). Other values are ignored.
 *
 * The ad landing pages (/free/...) don't depend on the cookie: their form
 * reads ?ref= straight from the URL (src/lib/freeLeads.ts).
 */
export const REF_COOKIE = "twm_ref";
export const REF_MAX_AGE = 60 * 60 * 24 * 30;
export const REF_VALUES = ["ig", "tt", "yt", "ad-1", "ad-2", "ad-3"] as const;
export type Ref = (typeof REF_VALUES)[number];

export function isRef(value: string | null | undefined): value is Ref {
  return REF_VALUES.includes(value as Ref);
}
