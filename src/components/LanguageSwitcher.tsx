"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LOCALES, LOCALE_NAMES } from "@/i18n/routing";

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
    </svg>
  );
}

/**
 * Globe + language code button with a dropdown of languages named in their
 * own language. Each option is a real link to the same page in that
 * language; next-intl's Link also stores the choice in the locale cookie,
 * which then wins over the browser language on later visits.
 *
 * `variant="list"` renders the options inline (used in the mobile menu).
 */
export default function LanguageSwitcher({
  variant = "dropdown",
  onNavigate,
}: {
  variant?: "dropdown" | "list";
  onNavigate?: () => void;
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const options = LOCALES.map((code) => {
    const current = code === locale;
    return (
      <Link
        key={code}
        href={pathname}
        locale={code}
        prefetch={false}
        hrefLang={code}
        lang={code}
        aria-current={current ? "true" : undefined}
        onClick={() => {
          setOpen(false);
          onNavigate?.();
        }}
        className={`flex min-h-11 items-center justify-between gap-3 rounded-md px-3 text-[14px] text-ink hover:bg-sand hover:text-ink ${
          current ? "bg-[#f4efdf] font-semibold" : ""
        }`}
      >
        <span>{LOCALE_NAMES[code]}</span>
        <span className="font-mono text-[12px] uppercase text-ink-muted">
          {code}
        </span>
      </Link>
    );
  });

  if (variant === "list") {
    return (
      <div>
        <div className="eyebrow mb-2 flex items-center gap-2 text-ink-muted">
          <GlobeIcon />
          {t("language")}
        </div>
        <div className="grid grid-cols-2 gap-1">{options}</div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={t("changeLanguage")}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 cursor-pointer items-center gap-1.5 rounded-lg border border-[#d6d0c0] px-3 text-[14px] font-semibold uppercase text-ink"
      >
        <GlobeIcon />
        {locale}
        <span aria-hidden="true" className="text-[10px]">
          ▾
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-[50px] z-30 flex w-[200px] flex-col rounded-[10px] border border-border bg-white p-1.5 shadow-lg">
          {options}
        </div>
      )}
    </div>
  );
}
