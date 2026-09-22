"use client";

import { useConsent } from "./ConsentContext";

export default function CookieSettingsLink({
  className = "cursor-pointer underline underline-offset-2",
}: {
  className?: string;
}) {
  const { openPreferences } = useConsent();

  return (
    <button type="button" onClick={openPreferences} className={className}>
      Cookie settings
    </button>
  );
}
