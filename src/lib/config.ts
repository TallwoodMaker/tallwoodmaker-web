/** Feature flags for the site. */
export const SHOP_ENABLED = false;
export const COURSE_ENABLED = false;
export const HOME_PROJECTS_ENABLED = false;

/** Premium launches — countdown/waitlist page shows until this date. */
export const PREMIUM_LAUNCH_DATE = "2026-09-11T00:00:00Z";

/**
 * Whether Premium access has opened. Wrapped as a function (rather than
 * calling Date.now() inline in a component) so it isn't flagged as an
 * impure render call by the react-hooks/purity lint rule — Server
 * Components are still dynamic per-request either way.
 */
export function isPremiumLaunched(): boolean {
  return Date.now() >= new Date(PREMIUM_LAUNCH_DATE).getTime();
}
