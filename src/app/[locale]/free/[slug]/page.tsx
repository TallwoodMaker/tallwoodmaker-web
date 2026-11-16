import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/i18n/metadata";
import { PROOF } from "@/config/proof";
import { FREE_MAGNETS, getFreeMagnetBySlug } from "@/config/freeMagnets";
import FreeShell from "@/components/free/FreeShell";
import FreeLeadForm from "@/components/free/FreeLeadForm";

export function generateStaticParams() {
  return FREE_MAGNETS.map((magnet) => ({ slug: magnet.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/free/[slug]">): Promise<Metadata> {
  const magnet = getFreeMagnetBySlug((await params).slug);
  if (!magnet) return {};
  const url = `${SITE_URL}/free/${magnet.slug}`;
  return {
    title: magnet.h1,
    description: magnet.sub,
    alternates: { canonical: url },
    openGraph: { title: magnet.h1, description: magnet.sub, url },
    // Ad landing page: reached from ads only, kept out of search results.
    robots: { index: false, follow: false },
  };
}

/**
 * Landing page of one paid ad (English only): headline, three bullets and
 * the email form for the free PDF. Lives outside the (site) group like
 * /start, so it has no navigation or footer links.
 */
export default async function FreeMagnetPage({
  params,
}: PageProps<"/[locale]/free/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const magnet = getFreeMagnetBySlug(slug);
  if (!magnet) notFound();

  const followers =
    PROOF.followers !== null
      ? `${Math.floor(PROOF.followers / 1000)}K+ followers`
      : null;

  return (
    <FreeShell>
      <section className="container-page section-px flex max-w-[860px] flex-col gap-6 py-[clamp(32px,6vw,64px)]">
        <h1 className="text-[clamp(34px,5.2vw,58px)] font-bold leading-[1.05] tracking-[-0.03em]">
          {magnet.h1}
        </h1>
        <p className="text-[18px] leading-[1.55] text-ink-soft">{magnet.sub}</p>
        <ul className="flex flex-col gap-2.5 text-[17px] leading-[1.45]">
          {magnet.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-[9px] h-2.5 w-2.5 flex-none bg-brand"
              />
              {bullet}
            </li>
          ))}
        </ul>
      </section>
      <section className="bg-brand">
        <div className="container-page section-px flex max-w-[860px] flex-col gap-4 py-[clamp(32px,5vw,56px)]">
          <FreeLeadForm source={magnet.source} />
          {magnet.formNote && (
            <p className="text-[15px] font-semibold">{magnet.formNote}</p>
          )}
          <p className="text-[15px]">
            Tom · {PROOF.years ?? 15} years as a pro woodworker
            {followers ? ` · ${followers}` : ""}
          </p>
        </div>
      </section>
    </FreeShell>
  );
}
