import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function HomeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="8" width="18" height="12" rx="1" />
      <path d="M7 8V5h10v3" />
      <path d="M3 13h18" />
    </svg>
  );
}

/** "Where are you right now?" — the two big path link cards. */
export default function PathCards() {
  const t = useTranslations("pathCards");

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[15px] font-semibold">{t("question")}</div>
      <div className="flex flex-wrap gap-3.5">
        <Link
          href="/build-at-home"
          className="flex min-w-0 flex-[1_1_240px] items-center gap-3.5 rounded-xl border-[1.5px] border-ink bg-white p-[18px] text-ink hover:text-ink"
        >
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[10px] bg-brand text-ink">
            <HomeIcon />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-[16px] font-semibold">{t("home.title")}</span>
            <span className="text-[14px] text-ink-muted">{t("home.text")}</span>
          </span>
          <span aria-hidden="true" className="ml-auto text-[18px]">
            →
          </span>
        </Link>
        <Link
          href="/own-shop"
          className="flex min-w-0 flex-[1_1_240px] items-center gap-3.5 rounded-xl border-[1.5px] border-ink bg-ink p-[18px] text-cream hover:text-cream"
        >
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[10px] bg-cream text-ink">
            <ShopIcon />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-[16px] font-semibold">{t("shop.title")}</span>
            <span className="text-[14px] text-on-dark">{t("shop.text")}</span>
          </span>
          <span aria-hidden="true" className="ml-auto text-[18px]">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
