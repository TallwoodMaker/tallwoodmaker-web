"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart/CartContext";

// Rendered only in the actual success branch below (payment_status ===
// "paid" with at least one deliverable) — never on the "not confirmed" or
// "trouble" branches, so a cancelled/failed checkout leaves the cart intact.
export default function ClearCartOnSuccess() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return null;
}
