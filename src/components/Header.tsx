"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/nav";

export default function Header() {
  const pathname = usePathname();

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
        </nav>
      </div>
    </header>
  );
}
