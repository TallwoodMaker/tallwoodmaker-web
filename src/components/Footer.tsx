import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import CookieSettingsLink from "@/components/cookies/CookieSettingsLink";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/tallwoodmaker" },
  { label: "YouTube", href: "https://www.youtube.com/@tallwoodmaker" },
  { label: "TikTok", href: "https://www.tiktok.com/@tallwoodmaker" },
];

const LINK_CLASS =
  "inline-flex min-h-11 items-center text-on-dark hover:text-cream hover:underline";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-ink text-on-dark">
      <div className="container-page section-px flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pb-6 pt-12 text-[14px]">
        <span className="font-display text-[18px] font-bold text-cream">
          TallWoodMaker
        </span>
        <nav className="flex flex-wrap gap-x-5">
          {SOCIAL_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              {label}
            </a>
          ))}
          <Link href="/for-brands" className={LINK_CLASS}>
            {t("forBrands")}
          </Link>
          <Link href="/contact" className={LINK_CLASS}>
            {t("contact")}
          </Link>
        </nav>
        <span>{t("copyright", { year: new Date().getFullYear() })}</span>
      </div>
      <div className="container-page section-px">
        <div className="flex flex-wrap gap-x-5 border-t border-line-dark py-3 text-[13px]">
          <Link href="/terms" className={LINK_CLASS}>
            {t("terms")}
          </Link>
          <Link href="/privacy" className={LINK_CLASS}>
            {t("privacy")}
          </Link>
          <Link href="/cookies" className={LINK_CLASS}>
            {t("cookiePolicy")}
          </Link>
          <CookieSettingsLink className={`${LINK_CLASS} cursor-pointer`} />
        </div>
      </div>
    </footer>
  );
}
