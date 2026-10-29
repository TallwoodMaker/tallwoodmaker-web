"use client";

import { useActionState, useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  submitLead,
  type LeadPath,
  type LeadSource,
  type LeadState,
} from "@/lib/leads";

const initialState: LeadState = { status: "idle" };

/**
 * Email capture for the lead magnet / workshop waitlist. Saves to the
 * `leads` table via the submitLead server action. `tone` matches the
 * section it sits on: "light" for the yellow bands, "dark" for black boxes.
 */
export default function LeadForm({
  source,
  path,
  submitLabel,
  tone = "light",
}: {
  source: LeadSource;
  path: LeadPath;
  submitLabel: string;
  tone?: "light" | "dark";
}) {
  const t = useTranslations("leadForm");
  const locale = useLocale();
  const id = useId();
  const [state, formAction, pending] = useActionState(submitLead, initialState);

  if (state.status === "success") {
    return (
      <p
        role="status"
        className={`text-[18px] font-semibold ${tone === "dark" ? "text-cream" : "text-ink"}`}
      >
        {source === "workshop-pricing" ? t("waitlistSuccess") : t("success")}
      </p>
    );
  }

  const errorId = `${id}-error`;
  const hasError = state.status === "invalid" || state.status === "error";

  return (
    <div className="w-full">
      <form action={formAction} className="flex flex-col gap-3" noValidate>
        <input type="hidden" name="source" value={source} />
        <input type="hidden" name="path" value={path} />
        <input type="hidden" name="locale" value={locale} />
        {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor={`${id}-company`}>{t("honeypot")}</label>
          <input
            id={`${id}-company`}
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-wrap gap-2.5">
          <label htmlFor={`${id}-email`} className="sr-only">
            {t("emailLabel")}
          </label>
          <input
            id={`${id}-email`}
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={t("placeholder")}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? errorId : undefined}
            className={`h-[52px] min-w-0 flex-[1_1_240px] rounded-[10px] border-[1.5px] bg-white px-4 text-[16px] text-ink placeholder:text-ink-muted ${
              tone === "dark" ? "border-cream bg-cream" : "border-ink"
            }`}
          />
          <button
            type="submit"
            disabled={pending}
            className={`h-[52px] cursor-pointer rounded-[10px] px-6 text-[16px] font-semibold disabled:cursor-default disabled:opacity-70 ${
              tone === "dark" ? "bg-brand text-ink" : "bg-ink text-cream"
            }`}
          >
            {pending ? t("sending") : submitLabel}
          </button>
        </div>
        {/* Optional newsletter consent: unticked by default, never required.
            The list itself is sent either way. */}
        <label
          className={`flex min-h-11 cursor-pointer items-start gap-2.5 text-[14px] leading-[1.45] ${
            tone === "dark" ? "text-on-dark" : "text-ink"
          }`}
        >
          <input
            type="checkbox"
            name="marketingConsent"
            className={`mt-0.5 h-5 w-5 flex-none cursor-pointer ${tone === "dark" ? "accent-brand" : "accent-ink"}`}
          />
          <span>{t("consent")}</span>
        </label>
      </form>
      {hasError && (
        <p
          id={errorId}
          role="alert"
          className={`mt-2.5 text-[15px] font-medium ${tone === "dark" ? "text-brand" : "text-ink"}`}
        >
          {state.status === "invalid" ? t("invalidEmail") : t("error")}
        </p>
      )}
    </div>
  );
}
