/**
 * Proof stats shown on the homepage proof strip and /for-brands.
 * `null` hides a stat entirely — never put a guessed number here.
 */
export const PROOF: {
  followers: number | null;
  monthlyReach: number | null;
  years: number | null;
  workshopM2: number | null;
} = {
  // Instagram 12 600 + TikTok 10 500 + YouTube 1 217 (2026-10-29)
  followers: 24317,
  monthlyReach: null,
  years: 15,
  workshopM2: 900,
};

/**
 * Brand logos for the "Worked with" row under the proof strip. The row is
 * hidden while this is empty. `src` is a path under public/.
 */
export const BRAND_LOGOS: { name: string; src: string }[] = [];
