import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Yellow announcement strip above the header, pointing at the lead magnet. */
export default function TopBar() {
  const t = useTranslations("topBar");

  return (
    <div className="bg-brand px-4 py-2.5 text-center text-[14px] font-medium text-ink">
      {t("text")}{" "}
      <Link
        href="/#start"
        className="ml-1.5 inline-block font-semibold underline-offset-2 hover:underline"
      >
        {t("cta")} →
      </Link>
    </div>
  );
}
