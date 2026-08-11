type ImageSlotProps = {
  placeholder: string;
  className?: string;
};

/**
 * Static stand-in for a real photo. Swap for a next/image once real
 * photography is available; the dashed frame matches the design's
 * empty-state so pages read correctly before assets are dropped in.
 */
export default function ImageSlot({ placeholder, className = "" }: ImageSlotProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-ink/30 bg-ink/[0.05] px-3 text-center ${className}`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-ink/45"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span className="text-[13px] font-medium text-ink/70">{placeholder}</span>
    </div>
  );
}
