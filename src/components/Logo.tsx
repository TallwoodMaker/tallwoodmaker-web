import { Link } from "@/i18n/navigation";

/**
 * Wordmark: black "TallWoodMaker" on a square-cornered yellow block. Use
 * <LogoMark> where it shouldn't be a link (e.g. the footer).
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block bg-brand px-[11px] py-[6px] text-[20px] font-black leading-none tracking-[-0.02em] text-ink sm:px-[13px] sm:py-[7px] sm:text-[24px] ${className}`}
    >
      TallWoodMaker
    </span>
  );
}

/** The wordmark, linking home. */
export default function Logo({ label }: { label: string }) {
  return (
    <Link
      href="/"
      aria-label={label}
      className="flex min-h-11 items-center text-ink hover:text-ink"
    >
      <LogoMark />
    </Link>
  );
}
