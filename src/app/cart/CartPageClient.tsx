"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { getShopProduct, type ShopProduct } from "@/lib/shopProducts";
import ProductThumbnail from "../shop/ProductThumbnail";
import { createCartCheckoutSession, type CartCheckoutState } from "./actions";

const initialState: CartCheckoutState = { status: "idle" };

export default function CartPageClient() {
  const { productIds, ready, remove } = useCart();
  const [state, formAction, pending] = useActionState(
    createCartCheckoutSession,
    initialState
  );

  const items = productIds
    .map((id) => getShopProduct(id))
    .filter((p): p is ShopProduct => !!p);

  const subtotal = items.reduce((sum, p) => sum + p.priceEur, 0);

  return (
    <>
      <div className="h-2 bg-brand" />

      <section className="container-page section-px py-[clamp(24px,5vw,64px)]">
        <h1 className="mb-8 text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Your cart
        </h1>

        {!ready ? null : items.length === 0 ? (
          <div>
            <p className="mb-4 text-[15px] text-ink-muted">
              Your cart is empty.
            </p>
            <Link
              href="/shop"
              className="text-sm font-semibold text-link"
            >
              ← Back to shop
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-[1fr_320px]">
            <div className="grid gap-6">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 border-b border-border pb-6"
                >
                  <div className="relative h-24 w-16 flex-none overflow-hidden rounded">
                    <ProductThumbnail product={product} sizes="64px" />
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/shop/${product.id}`}
                      className="text-[15px] font-semibold text-ink hover:underline"
                    >
                      {product.title}
                    </Link>
                    <div className="text-sm text-ink-muted">
                      €{product.priceEur}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    className="cursor-pointer text-sm font-semibold text-link"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-md border border-border p-6">
              <div className="mb-4 flex justify-between text-[15px] font-bold">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <form action={formAction}>
                {items.map((product) => (
                  <input
                    key={product.id}
                    type="hidden"
                    name="productId"
                    value={product.id}
                  />
                ))}
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full cursor-pointer rounded bg-brand px-6 py-3.5 text-[15px] font-bold text-ink disabled:cursor-default disabled:opacity-60"
                >
                  {pending ? "Redirecting…" : "Checkout"}
                </button>
              </form>
              {state.status === "error" && (
                <p className="mt-3 text-[13px] text-link">{state.message}</p>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
