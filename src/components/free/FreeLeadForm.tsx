"use client";

import { useActionState, useEffect, useId } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { submitFreeLead, type FreeLeadState } from "@/lib/freeLeads";
import type { FreeSource } from "@/config/freeMagnets";
import { MetaPixelEvent } from "@/components/MetaPixel";

const initialState: FreeLeadState = { status: "idle" };

const URL_FIELDS = [
  "ref",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

/**
 * Email form of the ad landing pages (/free/...): email + the same optional
 * newsletter checkbox as /start. ?ref= and UTM tags are copied from the
 * page URL into the submission (no cookie involved). On success the visitor
 * goes on to the offer page.
 */
export default function FreeLeadForm({ source }: { source: FreeSource }) {
  const t = useTranslations("leadForm");
  const id = useId();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    submitFreeLead,
    initialState
  );

  useEffect(() => {
    if (state.status === "success" && state.next) router.push(state.next);
  }, [state, router]);

  if (state.status === "success") {
    return (
      <p role="status" className="text-[18px] font-semibold text-ink">
        {state.source && (
          <MetaPixelEvent event="Lead" params={{ content_name: state.source }} />
        )}
        {t("success")}{" "}
        {state.next && (
          <Link href={state.next} className="underline underline-offset-4">
            Continue →
          </Link>
        )}
      </p>
    );
  }

  const errorId = `${id}-error`;
  const hasError = state.status === "invalid" || state.status === "error";

  return (
    <div className="w-full">
      <form
        action={(formData) => {
          const params = new URLSearchParams(window.location.search);
          for (const key of URL_FIELDS) {
            const value = params.get(key);
            if (value) formData.set(key, value);
          }
          formAction(formData);
        }}
        className="flex flex-col gap-3"
        noValidate
      >
        <input type="hidden" name="source" value={source} />
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
            className="h-[52px] min-w-0 flex-[1_1_240px] rounded-[10px] border-[1.5px] border-ink bg-white px-4 text-[16px] text-ink placeholder:text-ink-muted"
          />
          <button
            type="submit"
            disabled={pending}
            className="h-[52px] cursor-pointer rounded-[10px] bg-ink px-6 text-[16px] font-semibold text-cream disabled:cursor-default disabled:opacity-70"
          >
            {pending ? t("sending") : "Send me the PDF"}
          </button>
        </div>
        {/* Optional newsletter consent: unticked by default, never required.
            The PDF is sent either way. */}
        <label className="flex min-h-11 cursor-pointer items-start gap-2.5 text-[14px] leading-[1.45] text-ink">
          <input
            type="checkbox"
            name="marketingConsent"
            className="mt-0.5 h-5 w-5 flex-none cursor-pointer accent-ink"
          />
          <span>{t("consent")}</span>
        </label>
      </form>
      {hasError && (
        <p
          id={errorId}
          role="alert"
          className="mt-2.5 text-[15px] font-medium text-ink"
        >
          {state.status === "invalid" ? t("invalidEmail") : t("error")}
        </p>
      )}
    </div>
  );
}
