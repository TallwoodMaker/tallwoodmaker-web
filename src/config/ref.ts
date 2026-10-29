/**
 * Traffic-source tracking for leads. A visit with ?ref=ig|tt|yt stores the
 * value in this cookie for 30 days (src/proxy.ts); any lead form submitted
 * meanwhile saves it to leads.ref (src/lib/leads.ts). Other values are ignored.
 */
export const REF_COOKIE = "twm_ref";
export const REF_MAX_AGE = 60 * 60 * 24 * 30;
export const REF_VALUES = ["ig", "tt", "yt"] as const;
export type Ref = (typeof REF_VALUES)[number];

export function isRef(value: string | null | undefined): value is Ref {
  return REF_VALUES.includes(value as Ref);
}
