import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getShopProduct } from "@/lib/shopProducts";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24; // 24h

export default async function ShopSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) {
    notFound();
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.payment_status !== "paid") {
    return (
      <>
        <div className="h-2 bg-brand" />
        <section className="container-page section-px py-[clamp(24px,5vw,64px)]">
          <h1 className="mb-4 text-[clamp(32px,5vw,44px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
            Payment not confirmed yet
          </h1>
          <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
            If you just completed checkout, refresh this page in a moment —
            it can take a few seconds to confirm. Still stuck? Email{" "}
            <a href="mailto:tom@tallwoodmaker.com" className="text-link">
              tom@tallwoodmaker.com
            </a>{" "}
            and mention this order.
          </p>
        </section>
      </>
    );
  }

  const productId = session.metadata?.product_id;
  const product = productId ? getShopProduct(productId) : undefined;
  if (!product) {
    notFound();
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("shop-files")
    .createSignedUrl(product.storagePath, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    return (
      <>
        <div className="h-2 bg-brand" />
        <section className="container-page section-px py-[clamp(24px,5vw,64px)]">
          <h1 className="mb-4 text-[clamp(32px,5vw,44px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
            Payment received — download link trouble
          </h1>
          <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
            Your payment went through, but we hit a snag generating your
            download link. Email{" "}
            <a
              href={`mailto:tom@tallwoodmaker.com?subject=${encodeURIComponent(
                `Download link — order ${session_id}`
              )}`}
              className="text-link"
            >
              tom@tallwoodmaker.com
            </a>{" "}
            with this order ID and we&apos;ll send it over:{" "}
            <span className="font-mono text-[15px]">{session_id}</span>
          </p>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="h-2 bg-brand" />
      <section className="container-page section-px py-[clamp(24px,5vw,64px)]">
        <h1 className="mb-4 text-[clamp(32px,5vw,44px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Thanks — here&apos;s your download
        </h1>
        <p className="mb-6 max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          {product.title}
        </p>
        <a
          href={data.signedUrl}
          download
          className="inline-block rounded bg-brand px-7 py-3.5 text-[15px] font-bold text-ink"
        >
          Download {product.fileName}
        </a>
        <p className="mt-6 max-w-[560px] text-sm text-ink-muted">
          This link works for 24 hours. If it expires, bookmark this page and
          revisit it — reopening it generates a fresh link.
        </p>
      </section>
    </>
  );
}
