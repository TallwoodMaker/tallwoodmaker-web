"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useConsent } from "./ConsentContext";

function ToggleSwitch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-6 w-11 flex-none rounded-full transition-colors ${
        checked ? "bg-brand" : "bg-ink/20"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-cream transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function CookiePreferencesModal() {
  const {
    showPreferences,
    consent,
    closePreferences,
    acceptAll,
    rejectNonEssential,
    savePreferences,
  } = useConsent();
  const t = useTranslations("cookies");

  const [analytics, setAnalytics] = useState(consent.analytics);
  const [marketing, setMarketing] = useState(consent.marketing);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Re-sync the draft toggles to the saved consent each time the modal opens
  // (not on every consent change, so mid-edit toggling isn't clobbered).
  useEffect(() => {
    // Deferred via queueMicrotask rather than calling setState synchronously
    // in the effect body — same pattern as CountdownTimer, satisfies
    // react-hooks/set-state-in-effect.
    queueMicrotask(() => {
      if (showPreferences) {
        setAnalytics(consent.analytics);
        setMarketing(consent.marketing);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPreferences]);

  useEffect(() => {
    if (!showPreferences) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closePreferences();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showPreferences, closePreferences]);

  if (!showPreferences) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4"
      onMouseDown={(e) => {
        if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
          closePreferences();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        className="w-full max-w-[480px] rounded-md bg-cream p-6 shadow-xl"
      >
        <h2 id="cookie-preferences-title" className="mb-1 text-xl font-bold">
          {t("modalTitle")}
        </h2>
        <p className="mb-6 text-[14px] text-ink-muted">
          {t("modalText")}
        </p>

        <div className="mb-6 grid gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-semibold">{t("necessary.title")}</div>
              <p className="text-[13px] text-ink-muted">
                {t("necessary.text")}
              </p>
            </div>
            <ToggleSwitch checked disabled label={t("necessary.label")} />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-semibold">{t("analytics.title")}</div>
              <p className="text-[13px] text-ink-muted">
                {t("analytics.text")}
              </p>
            </div>
            <ToggleSwitch
              checked={analytics}
              onChange={setAnalytics}
              label={t("analytics.label")}
            />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-semibold">{t("marketing.title")}</div>
              <p className="text-[13px] text-ink-muted">
                {t("marketing.text")}
              </p>
            </div>
            <ToggleSwitch
              checked={marketing}
              onChange={setMarketing}
              label={t("marketing.label")}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={rejectNonEssential}
            className="cursor-pointer rounded-full border border-border px-5 py-2.5 text-[14px] font-semibold text-ink"
          >
            {t("reject")}
          </button>
          <button
            type="button"
            onClick={() => savePreferences({ analytics, marketing })}
            className="cursor-pointer rounded-full border border-ink px-5 py-2.5 text-[14px] font-semibold text-ink"
          >
            {t("save")}
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="cursor-pointer rounded-full bg-brand px-5 py-2.5 text-[14px] font-bold text-ink"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
