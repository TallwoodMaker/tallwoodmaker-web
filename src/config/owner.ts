/**
 * Marks the owner's own devices so their page views aren't counted on
 * /admin/dashboard. src/proxy.ts sets it on any page load by the signed-in
 * admin; it outlives the login, so a device stays excluded after signing
 * out. src/app/api/pv skips requests that carry it.
 */
export const OWNER_COOKIE = "twm_owner";
export const OWNER_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2;
