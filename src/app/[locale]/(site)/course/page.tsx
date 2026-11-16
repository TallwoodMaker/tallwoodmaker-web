import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/i18n/metadata";
import { COURSE_ENABLED } from "@/lib/config";
import { COURSE_NAME } from "@/config/freeMagnets";
import CourseWaitlistForm from "./CourseWaitlistForm";

const SUB =
  "The online course: from the first drawing to the installed piece, and on to your first paying client. Opens in January.";

export const metadata: Metadata = {
  title: `${COURSE_NAME}: the online course`,
  description: SUB,
  // English only (src/proxy.ts), so no hreflang alternates.
  alternates: { canonical: `${SITE_URL}/course` },
  openGraph: {
    title: `${COURSE_NAME}: the online course`,
    description: SUB,
    url: `${SITE_URL}/course`,
  },
};

/**
 * Waitlist for the course "Furniture Without a Big Shop" (opens in
 * January). English only. The free PDFs and /free/thanks link here.
 */
export default async function CoursePage({
  params,
}: PageProps<"/[locale]/course">) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!COURSE_ENABLED) notFound();

  return (
    <>
      <section className="container-page section-px flex max-w-[860px] flex-col gap-6 py-[clamp(40px,7vw,72px)]">
        <p className="self-start rounded-full bg-ink px-4 py-1.5 text-[13px] font-bold tracking-[0.03em] text-brand">
          Online course · opens in January
        </p>
        <h1 className="text-[clamp(38px,5.6vw,64px)] font-bold leading-[1.03] tracking-[-0.03em]">
          {COURSE_NAME}
        </h1>
        <p className="text-[18px] leading-[1.55] text-ink-soft">{SUB}</p>
      </section>
      <section className="bg-brand">
        <div className="container-page section-px flex max-w-[860px] flex-col gap-4 py-[clamp(40px,6vw,64px)]">
          <h2 className="text-[clamp(24px,3vw,32px)] font-bold leading-[1.1] tracking-[-0.02em]">
            Join the waitlist
          </h2>
          <CourseWaitlistForm />
        </div>
      </section>
    </>
  );
}
