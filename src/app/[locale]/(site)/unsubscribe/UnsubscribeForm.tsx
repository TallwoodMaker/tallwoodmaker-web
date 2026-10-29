"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { unsubscribe, type UnsubscribeState } from "./actions";

const initialState: UnsubscribeState = { status: "idle" };

export default function UnsubscribeForm({ token }: { token: string }) {
  const t = useTranslations("unsubscribe");
  const [state, formAction, pending] = useActionState(unsubscribe, initialState);

  if (state.status === "done") {
    return (
      <div role="status" className="flex flex-col gap-3">
        <h2 className="text-[clamp(24px,3vw,32px)] font-bold">{t("doneTitle")}</h2>
        <p className="text-[17px] leading-[1.6] text-ink-soft">{t("doneText")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col items-start gap-4">
      <input type="hidden" name="token" value={token} />
      <p className="text-[17px] leading-[1.6] text-ink-soft">{t("text")}</p>
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 cursor-pointer rounded-[10px] bg-ink px-6 font-semibold text-cream disabled:opacity-70"
      >
        {t("button")}
      </button>
      {state.status !== "idle" && (
        <p role="alert" className="text-[15px] text-link">
          {state.status === "invalid" ? t("invalid") : t("error")}
        </p>
      )}
    </form>
  );
}
