"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart/CartContext";
import { getShopProduct, type ShopProduct } from "@/lib/shopProducts";
import { formatPrice } from "@/lib/format";
import ProductThumbnail from "../shop/ProductThumbnail";
import { createCartCheckoutSession, type CartCheckoutState } from "./actions";

const initialState: CartCheckoutState = { status: "idle" };

export default function CartPageClient() {
  const t = useTranslations("cart");
  const tc = useTranslations("productCard");
  const locale = useLocale();
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
    <section className="container-page section-px py-[clamp(40px,7vw,72px)]">
      <h1 className="mb-8 text-[clamp(30px,4vw,44px)] font-bold leading-[1.1] tracking-[-0.02em]">
        {t("title")}
      </h1>

      {!ready ? null : items.length === 0 ? (
        <div>
          <p className="mb-4 text-[15px] text-ink-muted">{t("empty")}</p>
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center text-sm font-semibold underline-offset-4 hover:underline"
          >
            {t("back")}
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
                    {formatPrice(locale, product.priceEur)}
                    {locale !== "en" && ` · ${tc("pdfInEnglish")}`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  className="min-h-11 cursor-pointer px-2 text-sm font-semibold underline-offset-4 hover:underline"
                >
                  {t("remove")}
                </button>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-xl border border-border bg-white p-6">
            <div className="mb-4 flex justify-between text-[15px] font-bold">
              <span>{t("subtotal")}</span>
              <span>{formatPrice(locale, Number(subtotal.toFixed(2)))}</span>
            </div>
            <form action={formAction}>
              <input type="hidden" name="locale" value={locale} />
              {items.map((product) => (
                <input
                  key={product.id}
                  type="hidden"
                  name="productId"
                  value={product.id}
                />
              ))}
              <label className="mb-3 flex items-start gap-2 text-[12px] leading-[1.5] text-ink-muted">
                <input
                  type="checkbox"
                  name="withdrawalConsent"
                  value="true"
                  required
                  className="mt-0.5"
                />
                <span>
                  {t.rich("consent", {
                    terms: (chunks) => (
                      <Link href="/terms" className="underline">
                        {chunks}
                      </Link>
                    ),
                  })}
                </span>
              </label>
              <button
                type="submit"
                disabled={pending}
                className="min-h-11 w-full cursor-pointer rounded-[10px] bg-brand px-6 py-3.5 text-[15px] font-bold text-ink disabled:cursor-default disabled:opacity-60"
              >
                {pending ? t("redirecting") : t("checkout")}
              </button>
            </form>
            {state.status === "error" && (
              <p role="alert" className="mt-3 text-[13px] text-link">
                {state.message}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
