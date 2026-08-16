import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscriberByEmail, hasActiveSubscription } from "@/lib/subscribers";
import ImageSlot from "@/components/ImageSlot";

export const metadata: Metadata = {
  title: "Premium",
  description: "Full builds, extended cuts, and shop files for members.",
};

const PREMIUM_VIDEOS = [
  "Full Build: Live Edge Dining Table",
  "Shop Tour & Tool Setup, Start to Finish",
  "CNC Kids Chair — Full Cut List Walkthrough",
  "Finishing Deep Dive: Oils vs. Lacquer",
  "Mortise & Tenon, Every Method Compared",
  "Behind the Scenes: A Week in the Shop",
];

export default async function PremiumPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/premium/subscribe");
  }

  const subscriber = await getSubscriberByEmail(user.email);
  if (!hasActiveSubscription(subscriber)) {
    redirect("/premium/subscribe");
  }

  return (
    <>
      <div className="h-2 bg-brand" />

      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)]">
        <span className="mb-5 inline-block rounded-full bg-ink px-4 py-1.5 text-[13px] font-bold tracking-[0.03em] text-brand">
          PREMIUM
        </span>
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Premium Video
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          Full builds and extended cuts for members. New video added every
          month.
        </p>
      </section>

      <section className="container-page section-px grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-6 gap-y-10 border-t border-border pb-[clamp(24px,5vw,64px)] pt-12">
        {PREMIUM_VIDEOS.map((title) => (
          <div key={title}>
            <div className="mb-3.5 aspect-video">
              <ImageSlot
                placeholder="video thumbnail"
                className="h-full w-full"
              />
            </div>
            <div className="mb-1 text-[15px] font-semibold">{title}</div>
            <div className="text-sm text-ink-muted">Coming soon</div>
          </div>
        ))}
      </section>
    </>
  );
}
