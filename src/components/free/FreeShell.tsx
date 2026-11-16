import type { ReactNode } from "react";
import Logo from "@/components/Logo";

/**
 * Page frame of the ad funnel (/free/...): like /start, just the logo and a
 * one-line footer. No navigation and no footer links, so the only way
 * forward is the form or the offer.
 */
export default function FreeShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b border-border">
        <div className="container-page section-px py-4">
          <Logo label="TallWoodMaker home" />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="container-page section-px py-6 text-[13px] text-ink-muted">
        © TallWoodMaker s.r.o.
      </footer>
    </>
  );
}
