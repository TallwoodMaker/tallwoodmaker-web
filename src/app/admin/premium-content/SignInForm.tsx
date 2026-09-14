"use client";

import { useActionState } from "react";
import { sendAdminMagicLink, type AdminSignInState } from "./actions";

const initialState: AdminSignInState = { status: "idle" };

export default function SignInForm() {
  const [state, formAction, pending] = useActionState(
    sendAdminMagicLink,
    initialState
  );

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
          {pending ? "Sending…" : "Email me a link"}
        </button>
      </form>
      {state.status !== "idle" && (
        <p
          className={`mt-4 text-[15px] ${
            state.status === "error" ? "text-link" : "text-ink-muted"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
