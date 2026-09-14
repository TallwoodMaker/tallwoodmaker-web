import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { confirmSignIn } from "./actions";

export const metadata: Metadata = {
  title: "Confirm sign-in",
  robots: { index: false, follow: false },
};

/**
 * Landing point for the magic-link email. Deliberately does NOT verify the
 * token on load — it just renders a button, and verification only happens
 * from the form's POST in actions.ts. See that file's comment for why: a
 * GET-verifies design lets email link-scanners burn the one-time token
 * before the real user clicks it.
 */
export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{
    token_hash?: string;
    type?: string;
    next?: string;
  }>;
}) {
  const { token_hash, type, next: nextParam } = await searchParams;
  const next = nextParam ?? "/premium/subscribe";

  // No token at all — malformed or already-stripped link. Nothing to
  // verify, so nothing is spent by redirecting here.
  if (!token_hash || !type) {
    redirect(`${next}?error=link_expired`);
  }

  return (
    <>
      <div className="h-2 bg-brand" />
      <section className="container-page section-px flex min-h-[60vh] flex-col items-center justify-center gap-6 py-[clamp(24px,5vw,64px)] text-center">
        <h1 className="text-2xl font-bold">Confirm sign-in</h1>
        <p className="max-w-[420px] text-[15px] leading-[1.6] text-ink-muted">
          For your security, we only sign you in once you click below — this
          stops email link scanners from using up the link before you do.
        </p>
        <form action={confirmSignIn}>
          <input type="hidden" name="token_hash" value={token_hash} />
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="next" value={next} />
          <button
            type="submit"
            className="cursor-pointer rounded bg-brand px-6 py-3 text-[15px] font-bold text-ink"
          >
            Confirm sign-in
          </button>
        </form>
      </section>
    </>
  );
}
