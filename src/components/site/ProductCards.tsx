import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { productPath } from "@/config/paths";
import { formatPrice } from "@/lib/format";
import { bundleRegularPrice, type ShopProduct } from "@/lib/shopProducts";

/** Small "PDF in English" note shown on product cards outside English. */
export function PdfInEnglishNote({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("productCard");
  if (locale === "en") return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[12px] text-ink-muted ${className}`}
    >
      <span aria-hidden="true">EN</span>
      {t("pdfInEnglish")}
    </span>
  );
}

function Price({
  product,
  dark = false,
}: {
  product: ShopProduct;
  dark?: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("productCard");
  const regular = bundleRegularPrice(product);

  return (
    <span className="text-[17px] font-semibold">
      {formatPrice(locale, product.priceEur)}
      {regular !== null && regular > product.priceEur && (
        <>
          {" "}
          <s
            className={`font-normal ${dark ? "text-on-dark" : "text-ink-muted"}`}
            aria-label={t("regularPrice", {
              price: formatPrice(locale, regular),
            })}
          >
            {formatPrice(locale, regular)}
          </s>
        </>
      )}
    </span>
  );
}

/** Homepage "Plans & guides" card: cover, path line, name, short copy, price. */
export function FeaturedProductCard({ product }: { product: ShopProduct }) {
  const t = useTranslations();
  const regular = bundleRegularPrice(product);
  const path = productPath(product.id);
  const saving =
    regular !== null && product.id === "bundle-kitchen-starter"
      ? regular - product.priceEur
      : null;

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group flex flex-col gap-3.5 text-ink hover:text-ink"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-contain p-4 transition-transform group-hover:scale-[1.03]"
          />
        )}
        {saving !== null && saving > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-brand px-2.5 py-1 text-[13px] font-semibold text-ink">
            {t("productCard.save", { amount: saving })}
          </span>
        )}
      </div>
      {path && (
        <span className="text-[13px] text-ink-muted">
          {t(`paths.${path}`)} · {t(`productTypes.${product.type}`)}
        </span>
      )}
      <span className="font-display text-[22px] font-bold group-hover:underline">
        {product.title}
      </span>
      <span className="text-[15px] text-ink-soft">
        {t(`products.${product.id}.short`)}
      </span>
      <Price product={product} />
      <PdfInEnglishNote />
    </Link>
  );
}

/**
 * Text card used on the path pages. `featured` renders the black variant
 * with a yellow badge.
 */
export function PathProductCard({
  product,
  badge,
  featured = false,
}: {
  product: ShopProduct;
  badge?: string;
  featured?: boolean;
}) {
  const t = useTranslations("products");

  return (
    <Link
      href={`/shop/${product.id}`}
      className={`group flex flex-col gap-2.5 rounded-[14px] p-6 ${
        featured
          ? "border-[1.5px] border-ink bg-ink text-cream hover:text-cream"
          : "border border-border bg-white text-ink hover:text-ink"
      }`}
    >
      {badge && (
        <span className="self-start rounded-md bg-brand px-2.5 py-1 text-[12px] font-semibold text-ink">
          {badge}
        </span>
      )}
      <span className="font-display text-[22px] font-bold group-hover:underline">
        {product.title}
      </span>
      <span
        className={`text-[15px] ${featured ? "text-on-dark" : "text-ink-soft"}`}
      >
        {t(`${product.id}.short`)}
      </span>
      <span className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
        <Price product={product} dark={featured} />
        <PdfInEnglishNote className={featured ? "text-on-dark" : ""} />
      </span>
    </Link>
  );
}
