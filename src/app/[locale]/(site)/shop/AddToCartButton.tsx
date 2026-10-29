"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart/CartContext";

export default function AddToCartButton({
  productId,
  compact = false,
}: {
  productId: string;
  compact?: boolean;
}) {
  const t = useTranslations("shop");
  const { isInCart, toggle } = useCart();
  const inCart = isInCart(productId);

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      className={`min-h-11 w-full cursor-pointer rounded-[10px] font-bold transition-colors ${
        compact ? "px-3 py-2 text-[13px]" : "px-7 py-3.5 text-[15px]"
      } ${
        inCart
          ? "border border-ink text-ink hover:bg-ink hover:text-brand"
          : "bg-brand text-ink"
      }`}
    >
      {inCart ? t("inCartRemove") : t("addToCart")}
    </button>
  );
}
