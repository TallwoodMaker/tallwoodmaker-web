import { Link } from "@/i18n/navigation";

/** "TW" mark + wordmark, linking home. */
export default function Logo({ label }: { label: string }) {
  return (
    <Link
      href="/"
      aria-label={label}
      className="flex min-h-11 items-center gap-2.5 text-ink hover:text-ink"
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink font-display text-[15px] font-bold text-brand"
      >
        TW
      </span>
      <span className="font-display text-[19px] font-bold">TallWoodMaker</span>
    </Link>
  );
}
