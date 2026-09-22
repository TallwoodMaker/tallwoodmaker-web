"use client";

import { useCart } from "@/lib/cart/CartContext";

export default function AddToCartButton({
  productId,
  compact = false,
}: {
  productId: string;
  compact?: boolean;
}) {
  const { isInCart, toggle } = useCart();
  const inCart = isInCart(productId);

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      className={`w-full cursor-pointer rounded font-bold transition-colors ${
        compact ? "px-3 py-1.5 text-[12px]" : "px-7 py-3.5 text-[15px]"
      } ${
        inCart
          ? "border border-ink text-ink hover:bg-ink hover:text-brand"
          : "bg-brand text-ink"
      }`}
    >
      {inCart ? "In cart · Remove" : "Add to cart"}
    </button>
  );
}
