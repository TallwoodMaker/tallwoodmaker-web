"use client";

import { useActionState } from "react";
import { joinWaitlist, type WaitlistState } from "./waitlist-actions";

const initialState: WaitlistState = { status: "idle" };

export default function WaitlistForm() {
  const [state, formAction, pending] = useActionState(
    joinWaitlist,
    initialState
  );

  if (state.status === "joined") {
    return (
      <p className="text-[15px] font-semibold text-ink">
        You&apos;re on the list — we&apos;ll email you September 11.
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
          placeholder="your@email.com"
          className="w-[280px] rounded border border-border bg-cream px-4 py-3 text-[15px] text-ink"
        />
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded bg-brand px-6 py-3 text-[15px] font-bold text-ink disabled:cursor-default disabled:opacity-60"
        >
          {pending ? "Joining…" : "Join the waitlist"}
        </button>
      </form>
      {state.status === "error" && (
        <p className="mt-4 text-[15px] text-link">{state.message}</p>
      )}
    </div>
  );
}
