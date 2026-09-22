export type ShopProduct = {
  id: string;
  title: string;
  description: string;
  type: "plan" | "ebook";
  priceEur: number;
  stripePriceId: string;
  storagePath: string;
  fileName: string;
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
    priceEur: 4.99,
    stripePriceId: "price_1UIS0OCa2aoiD18oHS8iwiTY",
    storagePath: "plans/kids-chair.pdf",
    fileName: "tallwoodmaker-kids-chair-plan.pdf",
  },
  {
    id: "ebook-zero-to-first-client",
    title: "Zero to First Client",
    description:
      "How I went from making things for myself to landing my first paying woodworking client — the exact steps, in order.",
    type: "ebook",
    priceEur: 19,
    stripePriceId: "price_1UIRv7Ca2aoiD18osZlUAuYB",
    storagePath: "ebooks/zero-to-first-client-en.pdf",
    fileName: "zero-to-first-client.pdf",
  },
];

export function getShopProduct(id: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((product) => product.id === id);
}
