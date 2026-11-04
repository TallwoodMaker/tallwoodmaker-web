"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useId,
  useRef,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { joinWorkshopWaitlist, type WorkshopWaitlistState } from "@/lib/leads";

const initialState: WorkshopWaitlistState = { status: "idle" };

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

const SEGMENTS = [
  { value: "own-shop", key: "ownShop" },
  { value: "starting-shop", key: "startingShop" },
  { value: "home", key: "home" },
] as const;

/** Copies the page's ?utm_* tags into the submission. */
function withUtm(
  prevState: WorkshopWaitlistState,
  formData: FormData,
): Promise<WorkshopWaitlistState> {
  const params = new URLSearchParams(window.location.search);
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) formData.set(key, value);
  }
  return joinWorkshopWaitlist(prevState, formData);
}

/**
 * /workshop waitlist form: email, optional first name, "I am..." and the
 * required workshop-email consent. Saves through joinWorkshopWaitlist and
 * swaps itself for the thank-you message on success.
 */
export default function WorkshopWaitlistForm() {
  const t = useTranslations("workshop");
  const locale = useLocale();
  const id = useId();
  const thanksRef = useRef<HTMLHeadingElement>(null);
  const [state, formAction, pending] = useActionState(withUtm, initialState);

  useEffect(() => {
    if (state.status === "success") thanksRef.current?.focus();
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col gap-3">
        <h2
          ref={thanksRef}
          tabIndex={-1}
          className="text-[28px] font-bold leading-[1.1] tracking-[-0.02em] outline-none"
        >
          {t("thanks.title")}
        </h2>
        <p className="text-[16px] leading-[1.55] text-ink-soft">
          {t("thanks.text")}
        </p>
        <Link
          href="/own-shop"
          className="mt-1 inline-flex min-h-11 items-center self-start text-[15px] font-semibold underline underline-offset-4"
        >
          {t("thanks.link")}
        </Link>
      </div>
    );
  }

  const errorId = `${id}-error`;
  const emailError = state.status === "invalid";
  const consentError = state.status === "consent";
  const inputClass =
    "h-[52px] w-full rounded-[10px] border-[1.5px] border-ink bg-white px-4 text-[16px] text-ink placeholder:text-ink-muted";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-[26px] font-bold leading-[1.1] tracking-[-0.02em]">
          {t("form.title")}
        </h2>
        <p className="text-[16px] leading-[1.5]">
          <span className="highlight font-semibold">{t("perk")}</span>
        </p>
      </div>
      {/* Submitted via onSubmit, not action={...}: React resets a form after
          an action, which would wipe everything on a "tick the box" error. */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          startTransition(() => formAction(formData));
        }}
        className="flex flex-col gap-4"
        noValidate
      >
        <input type="hidden" name="locale" value={locale} />
        {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor={`${id}-company`}>{t("form.honeypot")}</label>
          <input
            id={`${id}-company`}
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-email`} className="text-[14px] font-semibold">
            {t("form.email")}
          </label>
          <input
            id={`${id}-email`}
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder={t("form.emailPlaceholder")}
            aria-invalid={emailError || undefined}
            aria-describedby={emailError ? errorId : undefined}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-name`} className="text-[14px] font-semibold">
            {t("form.firstName")}{" "}
            <span className="font-normal text-ink-muted">
              {t("form.optional")}
            </span>
          </label>
          <input
            id={`${id}-name`}
            type="text"
            name="firstName"
            autoComplete="given-name"
            maxLength={80}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${id}-segment`}
            className="text-[14px] font-semibold"
          >
            {t("form.segment")}
          </label>
          <select
            id={`${id}-segment`}
            name="segment"
            defaultValue=""
            className={`${inputClass} cursor-pointer`}
          >
            <option value="" disabled>
              {t("form.segmentPlaceholder")}
            </option>
            {SEGMENTS.map(({ value, key }) => (
              <option key={value} value={value}>
                {t(`form.segments.${key}`)}
              </option>
            ))}
          </select>
        </div>

        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-[14px] leading-[1.45]">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={consentError || undefined}
            aria-describedby={consentError ? errorId : undefined}
            className="mt-0.5 h-5 w-5 flex-none cursor-pointer accent-ink"
          />
          <span>{t("form.consent")}</span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="h-[56px] w-full cursor-pointer rounded-[10px] bg-brand px-6 text-[17px] font-bold text-ink disabled:cursor-default disabled:opacity-70"
        >
          {pending ? t("form.sending") : t("form.submit")}
        </button>

        {(emailError || consentError || state.status === "error") && (
          <p
            id={errorId}
            role="alert"
            className="text-[15px] font-semibold text-link"
          >
            {emailError
              ? t("form.invalidEmail")
              : consentError
                ? t("form.consentRequired")
                : t("form.error")}
          </p>
        )}
      </form>
    </div>
  );
}
