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
        <nav className="flex flex-wrap gap-[clamp(14px,2.4vw,28px)] text-sm font-medium">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-black hover:text-black ${active ? "underline underline-offset-2" : ""}`}
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
