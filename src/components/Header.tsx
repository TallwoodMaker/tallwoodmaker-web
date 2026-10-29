"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/nav";
import { SHOP_ENABLED } from "@/lib/config";
import { useCart } from "@/lib/cart/CartContext";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { productIds } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = productIds.length;

  const cartLink = SHOP_ENABLED && (
    <Link
      href="/cart"
      aria-label={t("cartAria", { count: cartCount })}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#d6d0c0] text-ink hover:text-ink"
    >
      <CartIcon />
      {cartCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-bold text-brand">
          {cartCount}
        </span>
      )}
    </Link>
  );

  return (
    <header className="border-b border-border bg-cream">
      <div className="container-page section-px flex items-center justify-between gap-4 py-4">
        <Logo label={t("homeLink")} />

        {/* Desktop navigation */}
        <nav
          aria-label={t("mainLabel")}
          className="hidden flex-wrap items-center justify-end gap-x-4 gap-y-2 text-[15px] xl:flex"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center whitespace-nowrap text-ink hover:text-ink ${
                  active
                    ? "underline decoration-brand decoration-[3px] underline-offset-[6px]"
                    : "hover:underline hover:underline-offset-[6px]"
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
          <LanguageSwitcher />
          {cartLink}
          {/* Only on wide screens: longer languages (de, pl…) would wrap the
              row, and the top bar already carries the same link. */}
          <Link
            href="/#start"
            className="hidden min-h-11 items-center whitespace-nowrap rounded-lg bg-ink px-[18px] font-semibold text-cream hover:text-cream 2xl:inline-flex"
          >
            {t("getFreeList")}
          </Link>
        </nav>

        {/* Mobile controls — the links and the language list move into the
            collapsible panel below. */}
        <div className="flex items-center gap-2 xl:hidden">
          {cartLink}
          <button
            type="button"
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-[#d6d0c0] text-ink"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-border xl:hidden">
          <nav
            aria-label={t("mainLabel")}
            className="container-page section-px flex flex-col gap-5 py-4"
          >
            <div className="flex flex-col divide-y divide-border">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`flex min-h-12 items-center text-[16px] text-ink hover:text-ink ${
                      active ? "font-semibold" : ""
                    }`}
                  >
                    {t(link.key)}
                  </Link>
                );
              })}
            </div>
            <LanguageSwitcher
              variant="list"
              onNavigate={() => setMobileOpen(false)}
            />
            <Link
              href="/#start"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-12 items-center justify-center rounded-lg bg-ink px-5 font-semibold text-cream hover:text-cream"
            >
              {t("getFreeList")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
