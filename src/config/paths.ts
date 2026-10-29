/**
 * The two learning paths: "Build at home" (/build-at-home) and "Your own
 * shop" (/own-shop). Step copy lives in messages/<locale>.json; this file
 * only wires steps to products and (optional) free videos.
 */

export const MEBCUT_URL = "https://mebcut.com";

export type PathStep = {
  /** Message key under buildAtHome.steps / ownShop.steps. */
  key: string;
  /** Shop product linked from this step, if any. */
  productId?: string;
  /** Free video for this step. Empty = the "Free video" button is hidden. */
  videoUrl: string;
};

export const HOME_STEPS: PathStep[] = [
  { key: "measure", productId: "ebook-kitchen-from-scratch", videoUrl: "" },
  { key: "order", productId: "plan-kitchen-cabinet-library", videoUrl: "" },
  { key: "boxes", productId: "plan-kitchen-cabinet-library", videoUrl: "" },
  { key: "install", productId: "ebook-kitchen-from-scratch", videoUrl: "" },
  { key: "finish", videoUrl: "" },
];

export const SHOP_STEPS: PathStep[] = [
  { key: "space", videoUrl: "" },
  { key: "machines", videoUrl: "" },
  { key: "cutting", videoUrl: "" },
  { key: "pricing", videoUrl: "" },
  { key: "clients", productId: "ebook-zero-to-first-client", videoUrl: "" },
  { key: "evenings", videoUrl: "" },
];

/** Products listed on each path page, in display order (first = featured). */
export const HOME_PATH_PRODUCT_IDS = [
  "bundle-kitchen-starter",
  "plan-kitchen-cabinet-library",
  "ebook-kitchen-from-scratch",
  "ebook-wardrobes-closets",
  "plan-wardrobe-cabinet-library",
  "plan-kids-bunk-bed",
];

export const SHOP_PATH_PRODUCT_IDS = [
  "bundle-complete-builder",
  "ebook-zero-to-first-client",
];

/** Products featured on the homepage "Plans & guides" section. */
export const HOME_FEATURED_PRODUCT_IDS = [
  "bundle-kitchen-starter",
  "bundle-complete-builder",
  "plan-kitchen-cabinet-library",
];

export type PathKey = "home" | "shop";

/** Which path a product belongs to, for the small "Build at home · Plan" line. */
export function productPath(productId: string): PathKey | null {
  if (HOME_PATH_PRODUCT_IDS.includes(productId)) return "home";
  if (SHOP_PATH_PRODUCT_IDS.includes(productId)) return "shop";
  return null;
}
