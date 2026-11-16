import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { freePdfPath, getFreeMagnetByOffer } from "@/config/freeMagnets";
import FreeShell from "@/components/free/FreeShell";

export const metadata: Metadata = {
  title: "Check your inbox",
  robots: { index: false, follow: false },
};

/**
 * Where the ad landing pages send people after the form
 * (/free/thanks?t=build|paid|kitchen&l=<offer token>): confirmation and a
 * direct download link for the PDF.
 */
export default async function FreeThanksPage({
  params,
  searchParams,
}: PageProps<"/[locale]/free/thanks">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { t } = await searchParams;
  const magnet = typeof t === "string" ? getFreeMagnetByOffer(t) : undefined;
  if (!magnet) notFound();

  return (
    <FreeShell>
      <section className="container-page section-px flex max-w-[860px] flex-col gap-4 py-[clamp(32px,6vw,64px)]">
        <h1 className="text-[clamp(30px,4.4vw,46px)] font-bold leading-[1.08] tracking-[-0.03em]">
          Check your inbox. The PDF is on its way.
        </h1>
        <p className="text-[17px] leading-[1.55] text-ink-soft">
          Or download it right now:{" "}
          <a
            href={freePdfPath(magnet)}
            target="_blank"
            rel="noopener"
            className="font-semibold text-ink underline underline-offset-4"
          >
            {magnet.pdfTitle} (PDF)
          </a>
        </p>
      </section>
    </FreeShell>
  );
}
