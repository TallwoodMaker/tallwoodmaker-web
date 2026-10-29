import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { confirmSignIn } from "./actions";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/auth/confirm">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.confirmSignIn" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/auth/confirm",
    title: t("title"),
    noindex: true,
  });
}

/**
 * Landing point for the magic-link email. Deliberately does NOT verify the
 * token on load — it just renders a button, and verification only happens
 * from the form's POST in actions.ts. See that file's comment for why: a
 * GET-verifies design lets email link-scanners burn the one-time token
 * before the real user clicks it.
 */
export default async function ConfirmPage({
  params,
  searchParams,
}: PageProps<"/[locale]/auth/confirm">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("confirmSignIn");
  const query = await searchParams;
  const pick = (v: string | string[] | undefined) =>
    typeof v === "string" ? v : undefined;
  const token_hash = pick(query.token_hash);
  const type = pick(query.type);
  const nextParam = pick(query.next);
  const next = nextParam ?? "/premium/subscribe";

  // No token at all — malformed or already-stripped link. Nothing to
  // verify, so nothing is spent by redirecting here.
  if (!token_hash || !type) {
    redirect(`${next}?error=link_expired`);
  }

  return (
    <>
      <section className="container-page section-px flex min-h-[60vh] flex-col items-center justify-center gap-6 py-[clamp(24px,5vw,64px)] text-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="max-w-[420px] text-[15px] leading-[1.6] text-ink-muted">
          {t("text")}
        </p>
        <form action={confirmSignIn}>
          <input type="hidden" name="token_hash" value={token_hash} />
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="next" value={next} />
          <button
            type="submit"
            className="cursor-pointer rounded bg-brand px-6 py-3 text-[15px] font-bold text-ink"
          >
            {t("button")}
          </button>
        </form>
      </section>
    </>
  );
}
