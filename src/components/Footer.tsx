import Link from "next/link";
import CookieSettingsLink from "@/components/cookies/CookieSettingsLink";

const SOCIAL_LINKS = ["YouTube", "Instagram", "TikTok", "Facebook"];

export default function Footer() {
  return (
    <footer className="bg-brand section-px py-12">
      <div className="container-page flex flex-wrap justify-between gap-8">
        <div>
          <div className="mb-2 text-base font-extrabold tracking-[0.03em] text-ink">
            TallWoodMaker
          </div>
          <div className="text-sm text-ink-muted">Build. Share. Inspire.</div>
        </div>
        <div className="flex flex-wrap gap-5 text-sm font-medium">
          {SOCIAL_LINKS.map((label) => (
            <Link key={label} href="/video">
              {label}
            </Link>
          ))}
        </div>
        <div className="text-right text-sm text-ink-muted">
          <div>tom@tallwoodmaker.com</div>
          <div>© 2026 TallWoodMaker</div>
        </div>
      </div>
      <div className="container-page mt-8 flex flex-wrap gap-5 border-t border-ink/15 pt-5 text-[13px] text-ink-muted">
        <Link href="/cookies" className="text-ink-muted hover:text-ink">
          Cookie Policy
        </Link>
        <CookieSettingsLink className="cursor-pointer text-ink-muted underline-offset-2 hover:text-ink hover:underline" />
      </div>
    </footer>
  );
}
