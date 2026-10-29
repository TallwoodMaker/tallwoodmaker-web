"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { joinWaitlist, type WaitlistState } from "./waitlist-actions";

const initialState: WaitlistState = { status: "idle" };

export default function WaitlistForm() {
  const t = useTranslations();
  const [state, formAction, pending] = useActionState(
    joinWaitlist,
    initialState
  );

  if (state.status === "joined") {
    return (
      <p className="text-[15px] font-semibold text-ink">
        {t("subscribe.waitlist.joined")}
      </p>
    );
  }

  return (
    <div>
      <form
        action={formAction}
        className="flex flex-wrap justify-center gap-3"
      >
        <input
          type="email"
          name="email"
          required
          placeholder={t("leadForm.placeholder")}
          aria-label={t("leadForm.emailLabel")}
          className="min-h-11 w-[280px] max-w-full rounded border border-border bg-cream px-4 py-3 text-[15px] text-ink"
        />
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded bg-brand px-6 py-3 text-[15px] font-bold text-ink disabled:cursor-default disabled:opacity-60"
        >
          {pending ? t("subscribe.waitlist.joining") : t("subscribe.waitlist.join")}
        </button>
      </form>
      {state.status === "error" && (
        <p className="mt-4 text-[15px] text-link">{state.message}</p>
      )}
    </div>
  );
}
