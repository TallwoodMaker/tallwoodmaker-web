"use client";

import { useActionState, useEffect, useState } from "react";
import { sendAdminMagicLink, type AdminSignInState } from "./actions";

const initialState: AdminSignInState = { status: "idle" };
const LAST_EMAIL_KEY = "tallwoodmaker:last-email";

export default function SignInForm() {
  const [state, formAction, pending] = useActionState(
    sendAdminMagicLink,
    initialState
  );
  // Starts empty so server and first client render match, then fills in
  // from localStorage after mount. Convenience only, never auto-submitted.
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Deferred via queueMicrotask rather than calling setState synchronously
    // in the effect body — same pattern as CountdownTimer, satisfies
    // react-hooks/set-state-in-effect.
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem(LAST_EMAIL_KEY);
        if (saved) setEmail(saved);
      } catch {
        // Storage unavailable (private browsing, etc.) — prefill just skipped.
      }
    });
  }, []);

  return (
    <div>
      <form
        action={formAction}
        onSubmit={() => {
          try {
            localStorage.setItem(LAST_EMAIL_KEY, email);
          } catch {
            // Ignore — not essential to the sign-in itself.
          }
        }}
        className="flex flex-wrap justify-center gap-3"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
