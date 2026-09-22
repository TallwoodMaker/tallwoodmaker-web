"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/nav";
import { SHOP_ENABLED } from "@/lib/config";
import { useCart } from "@/lib/cart/CartContext";

export default function Header() {
  const pathname = usePathname();
  const { productIds } = useCart();

  return (
    <header className="bg-brand">
      <div className="container-page section-px flex flex-wrap items-center justify-between gap-5 py-7">
        <Link
          href="/"
          className="text-[19px] font-extrabold tracking-[0.03em] text-black hover:text-black"
        >
          TallWoodMaker
        </Link>
        <nav className="flex flex-wrap items-center gap-[clamp(14px,2.4vw,28px)] text-sm font-medium uppercase">
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
              Cart{productIds.length > 0 ? ` (${productIds.length})` : ""}
            </Link>
          )}
          <Link
            href="/premium/subscribe"
            className="inline-flex items-center rounded-full border border-ink px-4 py-2.5 sm:py-1.5 text-black hover:text-black"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
