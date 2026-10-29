"use client";

import { useActionState } from "react";
import {
  sendStarterToPending,
  type SendPendingState,
} from "./actions";

const initialState: SendPendingState = { status: "idle" };

export default function SendPendingButton({
  pendingCount,
  disabledReason,
}: {
  pendingCount: number;
  disabledReason?: string;
}) {
  const [state, formAction, pending] = useActionState(
    sendStarterToPending,
    initialState
  );

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Send the starter list to ${pendingCount} pending lead(s) now?`
          )
        ) {
          e.preventDefault();
        }
      }}
      className="flex flex-wrap items-center gap-3"
    >
      <button
        type="submit"
        disabled={pending || pendingCount === 0 || !!disabledReason}
        className="min-h-11 cursor-pointer rounded-[10px] bg-ink px-5 font-semibold text-cream disabled:cursor-default disabled:opacity-50"
      >
        {pending ? "Sending…" : `Send starter list to pending (${pendingCount})`}
      </button>
      {disabledReason && (
        <span className="text-[14px] text-ink-muted">{disabledReason}</span>
      )}
      {state.message && (
        <span
          role="status"
          className={`text-[14px] ${state.status === "error" ? "text-link" : "text-ink"}`}
        >
          {state.message}
        </span>
      )}
    </form>
  );
}
