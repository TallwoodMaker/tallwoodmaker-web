"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/nav";
import { SHOP_ENABLED } from "@/lib/config";
import { useCart } from "@/lib/cart/CartContext";

function CartIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="m6 6-1-3H2" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { productIds } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = productIds.length;

  return (
    <header className="bg-brand">
      <div className="container-page section-px flex items-center justify-between gap-5 py-7">
        <Link
          href="/"
          className="text-[19px] font-extrabold tracking-[0.03em] text-black hover:text-black"
        >
          TallWoodMaker
        </Link>

        {/* Desktop nav — unchanged, just hidden below md */}
        <nav className="hidden flex-wrap items-center gap-[clamp(14px,2.4vw,28px)] text-sm font-medium uppercase md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            const isPremium = link.href === "/premium";

            if (isPremium) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center rounded-full bg-ink px-4 py-2.5 sm:py-1.5 text-brand hover:text-brand ${active ? "underline underline-offset-2" : ""}`}
                >
                  {link.label}
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center py-2.5 sm:py-0 text-black hover:text-black ${active ? "underline underline-offset-2" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
          {SHOP_ENABLED && (
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 rounded-full border border-ink px-4 py-2.5 sm:py-1.5 text-black hover:text-black"
            >
              <CartIcon />
              Cart{cartCount > 0 ? ` (${cartCount})` : ""}
            </Link>
          )}
          <Link
            href="/premium/subscribe"
            className="inline-flex items-center rounded-full border border-ink px-4 py-2.5 sm:py-1.5 text-black hover:text-black"
          >
            Sign in
          </Link>
        </nav>

        {/* Mobile controls — cart (with badge) + hamburger; full link list
            moves into the collapsible panel below. */}
        <div className="flex items-center gap-3 md:hidden">
          {SHOP_ENABLED && (
            <Link
              href="/cart"
              aria-label={`Cart${cartCount > 0 ? `, ${cartCount} item${cartCount === 1 ? "" : "s"}` : ""}`}
              className="relative inline-flex items-center rounded-full border border-ink p-2 text-black"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-brand">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-full border border-ink p-2 text-black"
          >
            {mobileOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-black/10 md:hidden">
          <nav className="container-page section-px flex flex-col divide-y divide-black/10 py-2 text-sm font-medium uppercase">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              const isPremium = link.href === "/premium";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center py-3.5 text-black ${
                    isPremium ? "font-bold" : ""
                  } ${active ? "underline underline-offset-2" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
            {SHOP_ENABLED && (
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-3.5 text-black"
              >
                <CartIcon />
                Cart{cartCount > 0 ? ` (${cartCount})` : ""}
              </Link>
            )}
            <Link
              href="/premium/subscribe"
              onClick={() => setMobileOpen(false)}
              className="flex items-center py-3.5 font-bold text-black"
            >
              Sign in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
