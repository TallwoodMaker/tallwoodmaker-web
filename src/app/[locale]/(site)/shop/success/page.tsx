import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getShopProduct, type ShopProduct } from "@/lib/shopProducts";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import ClearCartOnSuccess from "./ClearCartOnSuccess";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/shop/success">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.orderConfirmed" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/shop/success",
    title: t("title"),
    noindex: true,
  });
}

const SUPPORT_EMAIL = "tom@tallwoodmaker.com";

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24; // 24h

function parseProductIds(
  metadata: Record<string, string> | null | undefined
): string[] {
  if (!metadata) return [];

  // New checkout sessions (cart) set product_ids as a JSON array — Stripe
  // metadata values must be strings. Old single-item sessions set the
  // singular product_id; kept working here for any in-flight orders from
  // before this change.
  if (metadata.product_ids) {
    try {
      const parsed: unknown = JSON.parse(metadata.product_ids);
      if (Array.isArray(parsed)) {
        return parsed.filter((x): x is string => typeof x === "string");
      }
    } catch {
      // fall through to the singular check below
    }
  }

  if (metadata.product_id) {
    return [metadata.product_id];
  }

  return [];
}

export default async function ShopSuccessPage({
  params,
  searchParams,
}: PageProps<"/[locale]/shop/success">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("success");
  const sessionIdParam = (await searchParams).session_id;
  const session_id =
    typeof sessionIdParam === "string" ? sessionIdParam : undefined;
  if (!session_id) {
    notFound();
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.payment_status !== "paid") {
    return (
      <>
        <section className="container-page section-px py-[clamp(24px,5vw,64px)]">
          <h1 className="mb-4 text-[clamp(32px,5vw,44px)] font-bold leading-[1.1] tracking-[-0.03em]">
            {t("notConfirmedTitle")}
          </h1>
          <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
            {t.rich("notConfirmedText", {
              email: (chunks) => (
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-link">
                  {chunks}
                </a>
              ),
            })}
          </p>
        </section>
      </>
    );
  }

  const productIds = parseProductIds(session.metadata);
  const products = productIds
    .map((id) => getShopProduct(id))
    .filter((p): p is ShopProduct => !!p);

  if (products.length === 0) {
    notFound();
  }

  const admin = createAdminClient();
  const downloads: { product: ShopProduct; signedUrl: string }[] = [];
  const failures: ShopProduct[] = [];

  for (const product of products) {
    const { data, error } = await admin.storage
      .from("shop-files")
      .createSignedUrl(product.storagePath, SIGNED_URL_TTL_SECONDS);

    if (error || !data?.signedUrl) {
      failures.push(product);
    } else {
      downloads.push({ product, signedUrl: data.signedUrl });
    }
  }

  return (
    <>
      <ClearCartOnSuccess />
      <section className="container-page section-px py-[clamp(24px,5vw,64px)]">
        <h1 className="mb-4 text-[clamp(32px,5vw,44px)] font-bold leading-[1.1] tracking-[-0.03em]">
          {t("thanksTitle", { count: Math.max(1, downloads.length) })}
        </h1>

        {downloads.length > 0 && (
          <div className="mb-8 grid max-w-[480px] gap-5">
            {downloads.map(({ product, signedUrl }) => (
              <div key={product.id}>
                <p className="mb-2 text-[17px] leading-[1.6] text-ink">
                  {product.title}
                </p>
                <a
                  href={signedUrl}
                  download
                  className="inline-block rounded bg-brand px-7 py-3.5 text-[15px] font-bold text-ink"
                >
                  {t("download", { file: product.fileName })}
                </a>
              </div>
            ))}
          </div>
        )}

        {failures.length > 0 && (
          <p className="max-w-[560px] text-[15px] leading-[1.6] text-ink-muted">
            {t.rich("failure", {
              titles: failures.map((p) => p.title).join(", "),
              email: (chunks) => (
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
                    `Download link — order ${session_id}`
                  )}`}
                  className="text-link"
                >
                  {chunks}
                </a>
              ),
            })}{" "}
            <span className="font-mono text-[15px]">{session_id}</span>
          </p>
        )}

        {downloads.length > 0 && (
          <p className="mt-6 max-w-[560px] text-sm text-ink-muted">
            {t("expiry")}
          </p>
        )}
      </section>
    </>
  );
}
