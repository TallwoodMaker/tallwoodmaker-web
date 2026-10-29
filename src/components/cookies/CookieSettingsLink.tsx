"use client";

import { useTranslations } from "next-intl";
import { useConsent } from "./ConsentContext";

export default function CookieSettingsLink({
  className = "cursor-pointer underline underline-offset-2",
}: {
  className?: string;
}) {
  const { openPreferences } = useConsent();
  const t = useTranslations("footer");

  return (
    <button type="button" onClick={openPreferences} className={className}>
      {t("cookieSettings")}
    </button>
  );
}
