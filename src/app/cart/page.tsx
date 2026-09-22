import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SHOP_ENABLED } from "@/lib/config";
import CartPageClient from "./CartPageClient";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  if (!SHOP_ENABLED) {
    notFound();
  }

  return <CartPageClient />;
}
