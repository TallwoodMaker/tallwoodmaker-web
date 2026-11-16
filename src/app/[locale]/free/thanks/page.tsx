import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  COURSE_NAME,
  freePdfPath,
  getFreeMagnetByOffer,
} from "@/config/freeMagnets";
import { FREE_OFFERS } from "@/config/freeOffers";
import { formatPrice } from "@/lib/format";
import { offerStripePriceId } from "@/lib/offers";
import { getShopProduct } from "@/lib/shopProducts";
import FreeShell from "@/components/free/FreeShell";
import OfferForm from "@/components/free/OfferForm";

export const metadata: Metadata = {
  title: "Check your inbox",
  robots: { index: false, follow: false },
};

// Same shape as the leads.offer_token default (64 hex chars).
const TOKEN_RE = /^[a-f0-9]{32,128}$/;

/**
 * Where the ad landing pages send people after the form
 * (/free/thanks?t=build|paid|kitchen&l=<offer token>): confirmation, a
 * direct download link for the PDF, one "New subscriber price" offer and a
 * line about the course. No countdown and no time limit: the price is the
 * same whenever the page is opened.
 */
export default async function FreeThanksPage({
  params,
  searchParams,
}: PageProps<"/[locale]/free/thanks">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { t: offerKey, l } = await searchParams;
  const magnet =
    typeof offerKey === "string" ? getFreeMagnetByOffer(offerKey) : undefined;
  if (!magnet) notFound();
  const token = typeof l === "string" && TOKEN_RE.test(l) ? l : undefined;

  const offer = FREE_OFFERS[magnet.offer];
  const product = getShopProduct(offer.productId);
  const addonProduct = offer.addon && getShopProduct(offer.addon.productId);
  // Shown only when the product is on sale and its offer price exists in
  // the current Stripe mode.
  const showOffer = !!product?.available && !!offerStripePriceId(offer);
  const addon =
    offer.addon && addonProduct?.available && offerStripePriceId(offer.addon)
      ? {
          title: offer.addon.title,
          priceEur: offer.addon.priceEur,
          regularEur: addonProduct.priceEur,
        }
      : undefined;
  const tp = await getTranslations({ locale: "en", namespace: "products" });

  return (
    <FreeShell>
      <section className="container-page section-px flex max-w-[860px] flex-col gap-4 py-[clamp(32px,6vw,56px)]">
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

      {showOffer && product && (
        <section className="bg-brand">
          <div className="container-page section-px max-w-[860px] py-[clamp(32px,5vw,56px)]">
            <div className="flex flex-col gap-6 rounded-[14px] bg-white p-[clamp(20px,4vw,32px)] sm:flex-row">
              {product.imageUrl && (
                <div className="relative aspect-[2/3] w-[132px] flex-none self-start overflow-hidden rounded sm:w-[168px]">
                  <Image
                    src={product.imageUrl}
                    alt={`${offer.title} ebook cover`}
                    fill
                    sizes="168px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col gap-4">
                <p className="self-start rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-bold tracking-[0.02em] text-brand">
                  New subscriber price
                </p>
                <h2 className="text-[clamp(24px,3vw,32px)] font-bold leading-[1.1] tracking-[-0.02em]">
                  {offer.title} for {formatPrice("en", offer.priceEur)}{" "}
                  <span className="text-[0.7em] font-medium text-ink-muted">
                    (normally {formatPrice("en", product.priceEur)})
                  </span>
                </h2>
                <p className="text-[16px] leading-[1.55] text-ink-soft">
                  {tp(`${product.id}.description`)}
                </p>
                <p className="text-[14px] text-ink-muted">
                  Ebook · PDF · instant download after payment
                </p>
                <OfferForm
                  offer={magnet.offer}
                  token={token}
                  priceEur={offer.priceEur}
                  addon={addon}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="container-page section-px max-w-[860px] py-[clamp(28px,4vw,44px)]">
        <p className="text-[17px] leading-[1.55]">
          The full course “{COURSE_NAME}” opens in January.{" "}
          <Link
            href="/course"
            className="font-semibold underline underline-offset-4"
          >
            Join the waitlist →
          </Link>
        </p>
      </section>
    </FreeShell>
  );
}
