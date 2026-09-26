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
  // A single sample page image from the actual PDF (e.g.
  // "/shop/ebook-kitchen-from-scratch-sample.png"), shown on the product
  // page so buyers can see real inside pages before purchasing. Optional —
  // extracted from the real file per product, never a placeholder.
  samplePageUrl?: string;
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
      "Four kitchen cabinet types, one module system — dimensioned plans and cut lists for base, wall, tall/pantry, and corner cabinets that all fit together.",
    type: "plan",
    category: "plans",
    priceEur: 24,
    stripePriceId: "price_1UIrXCCa2aoiD18oRZbgyz6V",
    storagePath: "plans/kitchen-cabinet-library.pdf",
    fileName: "tallwoodmaker-kitchen-cabinet-library-plan.pdf",
    imageUrl: "/shop/kitchen-cabinet-library-cover.png",
    whatYouLearn: [
      "Build all four core cabinet types — base, wall, tall/pantry, and corner cabinets — as one matched module system, not four separate one-off builds.",
      "Get a full cutting list and dimensioned drawing for every module — nothing guessed, nothing left to figure out on the workshop floor.",
      "Order the right hardware the first time — confirmat screws, cam locks, hinges, and adjustable feet, sized correctly for each cabinet type.",
      "Handle the corner cabinet with confidence — the one part of most kitchens that trips people up, planned and drawn like every other module.",
      "Finish cabinets that hold up to daily use — the surface and maintenance steps that keep a kitchen looking right for years.",
    ],
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
    samplePageUrl: "/shop/kitchen-from-scratch-sample.png",
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
      "Three wardrobe systems, one guide — built-in sliding-door, freestanding hinged, and walk-in open shelving, planned, built, and fitted.",
    type: "ebook",
    category: "ebooks",
    priceEur: 19,
    stripePriceId: "price_1UIrXFCa2aoiD18oFhBzlEwG",
    storagePath: "ebooks/wardrobes-closets-en.pdf",
    fileName: "wardrobes-closets.pdf",
    imageUrl: "/shop/wardrobes-closets-cover.png",
    samplePageUrl: "/shop/wardrobes-closets-sample.png",
    whatYouLearn: [
      "Choose the right system for your space — built-in sliding-door, freestanding hinged-door, or walk-in open shelving, compared by the depth and clearance each one actually needs.",
      "Build a built-in sliding wardrobe into an alcove — using the walls and ceiling as structure, with the header rail and track sized right.",
      "Build a freestanding hinged wardrobe from a full six-sided carcass — with the correct hinge count for the door height, not guessed.",
      "Lay out the inside properly — hanging heights, rail specs, and shelf spacing that actually fit clothes, not just look right on paper.",
      "Fit the hardware and finish the job — sliding door tracks, drawers, and accessories, through to a final install-day checklist.",
    ],
    available: true,
  },
  {
    id: "plan-kids-bunk-bed",
    title: "Kids' Bunk Bed",
    description:
      "A twin-over-full solid pine bunk bed, built safe from the start — fixed ladder, full-height guard rail, complete cut list, and step-by-step assembly.",
    type: "plan",
    category: "plans",
    priceEur: 4.9,
    // Stripe product prod_VJXRX1r8w7gpze
    stripePriceId: "price_1UIuMUCa2aoiD18o7BxIZ3Wn",
    storagePath: "plans/kids-bunk-bed-en.pdf",
    fileName: "tallwoodmaker-kids-bunk-bed-plan.pdf",
    imageUrl: "/shop/kids-bunk-bed-cover.png",
    samplePageUrl: "/shop/kids-bunk-bed-sample.png",
    whatYouLearn: [
      "Build a complete twin-over-full bunk bed — a narrower single bed up top, a wider bed below, from one solid pine cutting list.",
      "Follow a full cutting list and dimensioned drawing — 13 rows, 50 parts, front and side views with every measurement called out.",
      "Assemble it in the right order — base frame, slats, upper frame, slats, guard rail and ladder, then a final check, step by step.",
      "Fit a fixed ladder and a full-height guard rail — built in from the start, not bolted on as an afterthought.",
      "Finish it safe for kids — the guard-rail spacing and age guidance to check against your local safety standard before it's used.",
    ],
    available: true,
  },
];

export function getShopProduct(id: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((product) => product.id === id);
}

export function getAvailableShopProducts(): ShopProduct[] {
  return SHOP_PRODUCTS.filter((product) => product.available);
}
