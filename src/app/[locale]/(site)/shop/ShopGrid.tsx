"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ShopProduct, ShopProductCategory } from "@/lib/shopProducts";
import { formatPrice } from "@/lib/format";
import ProductThumbnail from "./ProductThumbnail";
import AddToCartButton from "./AddToCartButton";

type FilterValue = "all" | ShopProductCategory;

export default function ShopGrid({
  products,
  categories,
}: {
  products: ShopProduct[];
  categories: ShopProductCategory[];
}) {
  const t = useTranslations("shop");
  const tc = useTranslations("productCard");
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<FilterValue>("all");

  const presentCategoryIds = new Set(products.map((p) => p.category));
  const presentCategories = categories.filter((c) => presentCategoryIds.has(c));

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const filters: FilterValue[] = ["all", ...presentCategories];

  return (
    <>
      {presentCategories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={activeCategory === value}
              onClick={() => setActiveCategory(value)}
              className={`min-h-11 cursor-pointer rounded-full px-4 text-[14px] font-semibold ${
                activeCategory === value
                  ? "bg-ink text-brand"
                  : "border border-border text-ink hover:border-ink"
              }`}
            >
              {value === "all" ? t("all") : t(`categories.${value}`)}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <div key={product.id} className="mx-auto w-full max-w-[240px]">
            <Link href={`/shop/${product.id}`} className="group block">
              <div className="relative mb-2 aspect-[2/3] overflow-hidden rounded-[10px]">
                <ProductThumbnail product={product} sizes="240px" />
              </div>
              <div className="text-[14px] font-semibold leading-snug text-ink group-hover:underline">
                {product.title}
              </div>
            </Link>
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-2 text-[14px] text-ink-muted">
              <span>{formatPrice(locale, product.priceEur)}</span>
              {locale !== "en" && (
                <span className="font-mono text-[12px]">{tc("pdfInEnglish")}</span>
              )}
            </div>
            <AddToCartButton productId={product.id} compact />
          </div>
        ))}
      </div>
    </>
  );
}
