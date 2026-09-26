// Browsable grouping, shown as filter pills on /shop — distinct from `type`
// below, which drives presentation (placeholder copy) rather than browsing.
// Add more as the catalog grows (e.g. a future "kitchen-plans").
export type ShopProductCategory = "ebooks" | "plans";

export type ShopCategoryDef = { id: ShopProductCategory; label: string };

export const SHOP_CATEGORIES: ShopCategoryDef[] = [
  { id: "ebooks", label: "Ebooks" },
  { id: "plans", label: "Plans" },
];

export type ShopProduct = {
  id: string;
  title: string;
  description: string;
  type: "plan" | "ebook";
  category: ShopProductCategory;
  priceEur: number;
  stripePriceId: string;
  storagePath: string;
  fileName: string;
  // Real product photo/cover, e.g. "/shop/zero-to-first-client-cover.png"
  // (served from public/). Optional — falls back to the ImageSlot
  // placeholder when unset.
  imageUrl?: string;
  // Outcome-focused bullets shown on the product page under the
  // description — "what you'll know how to do" after reading, not a table
  // of contents. Each string's lead-in phrase (before the em dash) is
  // rendered bold. Optional — omit for products that don't have this yet.
  whatYouLearn?: string[];
  // False hides the product from /shop and refuses checkout for it — for a
  // product whose Stripe Price exists but whose file isn't uploaded to
  // shop-files yet. Flip to true once storagePath is actually in the bucket.
  available: boolean;
};

// Copy is still placeholder wording — edit freely. Prices are real, live
// Stripe Prices (EUR, one-time): product "Kids' Chair — Plan & Cut List"
// (prod_VJ43moKwPvMnfB) and "Zero to First Client" (prod_VJ43n66Hlmtmrf).
//
// Small standalone plans (as opposed to a larger/bundled product) belong
// under €5 — the kids' chair plan was repriced from €12 to €4.99 for this
// reason; its old price (price_1UIRv6Ca2aoiD18o8756Wuj8) is archived in
// Stripe, not deleted, for the order-history record.
export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "plan-kids-chair",
    title: "Kids' Chair — Plan & Cut List",
    description:
      "Full dimensioned plan and cut list for a simple, sturdy kids' chair — beginner-friendly, no jigs required.",
    type: "plan",
    category: "plans",
    priceEur: 4.99,
    stripePriceId: "price_1UIS0OCa2aoiD18oHS8iwiTY",
    storagePath: "plans/kids-chair.pdf",
    fileName: "tallwoodmaker-kids-chair-plan.pdf",
    // Stripe product/price are real and live; the PDF isn't uploaded to
    // shop-files yet. Hidden until it is — see chat history.
    available: false,
  },
  {
    id: "ebook-zero-to-first-client",
    title: "Zero to First Client",
    description:
      "How I went from making things for myself to landing my first paying woodworking client — the exact steps, in order.",
    type: "ebook",
    category: "ebooks",
    priceEur: 19,
    stripePriceId: "price_1UIRv7Ca2aoiD18osZlUAuYB",
    storagePath: "ebooks/zero-to-first-client-en.pdf",
    fileName: "zero-to-first-client.pdf",
    imageUrl: "/shop/zero-to-first-client-cover.png",
    available: true,
  },
  // Stripe product prod_VJUW7uQYLWl0Ce, prod_VJUW7DXpAlKaQM, prod_VJUWmpeon9p1Wi
  {
    id: "plan-kitchen-cabinet-library",
    title: "Kitchen Cabinet Library",
    description:
      "Dimensioned plans and cut lists for all four kitchen cabinet types — base, wall, tall/pantry, and corner — as one module system.",
    type: "plan",
    category: "plans",
    priceEur: 24,
    stripePriceId: "price_1UIrXCCa2aoiD18oRZbgyz6V",
    storagePath: "plans/kitchen-cabinet-library.pdf",
    fileName: "tallwoodmaker-kitchen-cabinet-library-plan.pdf",
    imageUrl: "/shop/kitchen-cabinet-library-cover.png",
    available: true,
  },
  {
    id: "ebook-kitchen-from-scratch",
    title: "My First Kitchen — Built Without a Workshop",
    description:
      "Everything I wish I knew before building my first kitchen — measuring, cutting, installing, and finishing, start to end, without a professional workshop.",
    type: "ebook",
    category: "ebooks",
    priceEur: 19,
    stripePriceId: "price_1UIrXECa2aoiD18oqBLxjvVW",
    storagePath: "ebooks/kitchen-from-scratch-en.pdf",
    fileName: "kitchen-from-scratch.pdf",
    imageUrl: "/shop/kitchen-from-scratch-cover.png",
    whatYouLearn: [
      "Read any kitchen — measure a room, set a story pole, and lay out a work triangle that actually works before you cut a single board.",
      "Turn a layout into a real order — merge cut lists, count boards, and order the hardware you need, with nothing guessed and nothing wasted.",
      "Build and install cabinets that sit right — batch-build the boxes, then level, join, and scribe a run of base and wall cabinets so they sit solid and square.",
      "Template and fit a worktop yourself — including sink and hob cutouts, joins, and sealing, without paying a fabricator to do it for you.",
      "Finish it like a pro — doors hung straight in one pass, plinths fitted, lighting wired in, and a final checklist so nothing gets missed.",
    ],
    available: true,
  },
  {
    id: "ebook-wardrobes-closets",
    title: "Wardrobes & Closets",
    description:
      "Built-in sliding-door wardrobes, freestanding hinged wardrobes, and open walk-in systems — how to plan, build, and fit all three.",
    type: "ebook",
    category: "ebooks",
    priceEur: 19,
    stripePriceId: "price_1UIrXFCa2aoiD18oFhBzlEwG",
    storagePath: "ebooks/wardrobes-closets-en.pdf",
    fileName: "wardrobes-closets.pdf",
    imageUrl: "/shop/wardrobes-closets-cover.png",
    available: true,
  },
  {
    id: "plan-kids-bunk-bed",
    title: "Kids' Bunk Bed",
    description:
      "Twin-over-full solid pine bunk bed with a fixed ladder and full-height guard rail — cut list, dimensioned drawing, and step-by-step assembly.",
    type: "plan",
    category: "plans",
    priceEur: 4.9,
    // Stripe product prod_VJXRX1r8w7gpze
    stripePriceId: "price_1UIuMUCa2aoiD18o7BxIZ3Wn",
    storagePath: "plans/kids-bunk-bed-en.pdf",
    fileName: "tallwoodmaker-kids-bunk-bed-plan.pdf",
    imageUrl: "/shop/kids-bunk-bed-cover.png",
    available: true,
  },
];

export function getShopProduct(id: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((product) => product.id === id);
}

export function getAvailableShopProducts(): ShopProduct[] {
  return SHOP_PRODUCTS.filter((product) => product.available);
}
