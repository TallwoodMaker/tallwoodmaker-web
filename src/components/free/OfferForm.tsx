"use client";

import { useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import {
  createOfferCheckoutSession,
  type OfferCheckoutState,
} from "@/lib/offerCheckout";

const initialState: OfferCheckoutState = { status: "idle" };

/**
 * Buy button of the "New subscriber price" offer: optional add-on checkbox
 * (kitchen offer only), the same immediate-delivery consent as the cart, and
 * a button that goes to Stripe Checkout. No timer, no popup.
 */
export default function OfferForm({
  offer,
  token,
  priceEur,
  addon,
}: {
  offer: string;
  token?: string;
  priceEur: number;
  addon?: { title: string; priceEur: number; regularEur: number };
}) {
  const [withAddon, setWithAddon] = useState(false);
  const [state, formAction, pending] = useActionState(
    createOfferCheckoutSession,
    initialState
  );
  const total = priceEur + (withAddon && addon ? addon.priceEur : 0);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="offer" value={offer} />
      {token && <input type="hidden" name="token" value={token} />}
      {addon && (
        <label className="flex min-h-11 cursor-pointer items-start gap-2.5 rounded-[10px] border-[1.5px] border-ink bg-cream p-3.5 text-[15px] leading-[1.45]">
          <input
            type="checkbox"
            name="addon"
            checked={withAddon}
            onChange={(e) => setWithAddon(e.target.checked)}
            className="mt-0.5 h-5 w-5 flex-none cursor-pointer accent-ink"
          />
          <span>
            Add the {addon.title} for {formatPrice("en", addon.priceEur)}{" "}
            (normally {formatPrice("en", addon.regularEur)})
          </span>
        </label>
      )}
      <label className="flex items-start gap-2 text-[12px] leading-[1.5] text-ink-muted">
        <input
          type="checkbox"
          name="withdrawalConsent"
          value="true"
          required
          className="mt-0.5"
        />
        <span>
          I want immediate access to this digital content and I acknowledge
          that I lose my right of withdrawal once delivery begins. I agree to
          the{" "}
          <Link href="/terms" target="_blank" className="underline">
            Terms of Service
          </Link>
          .
        </span>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="min-h-[52px] cursor-pointer self-start rounded-[10px] bg-ink px-7 text-[16px] font-semibold text-cream disabled:cursor-default disabled:opacity-70"
      >
        {pending ? "Redirecting…" : `Get it for ${formatPrice("en", total)}`}
      </button>
      {state.status === "error" && (
        <p role="alert" className="text-[14px] font-medium text-link">
          {state.message}
        </p>
      )}
    </form>
  );
}
