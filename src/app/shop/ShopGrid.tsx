"use client";

import { useState } from "react";
import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";
import type {
  ShopCategoryDef,
  ShopProduct,
  ShopProductCategory,
} from "@/lib/shopProducts";

const PLACEHOLDER_BY_TYPE: Record<ShopProduct["type"], string> = {
  plan: "plan preview",
  ebook: "ebook cover",
};

type FilterValue = "all" | ShopProductCategory;

export default function ShopGrid({
  products,
  categories,
}: {
  products: ShopProduct[];
  categories: ShopCategoryDef[];
}) {
  const [activeCategory, setActiveCategory] = useState<FilterValue>("all");

  const presentCategoryIds = new Set(products.map((p) => p.category));
  const presentCategories = categories.filter((c) =>
    presentCategoryIds.has(c.id)
  );

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      {presentCategories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-4 py-2 text-[14px] font-semibold ${
              activeCategory === "all"
                ? "bg-ink text-brand"
                : "border border-border text-ink hover:border-ink"
            }`}
          >
            All
          </button>
          {presentCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-[14px] font-semibold ${
                activeCategory === cat.id
                  ? "bg-ink text-brand"
                  : "border border-border text-ink hover:border-ink"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,200px))] gap-x-4 gap-y-7">
        {filtered.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.id}`}
            className="group block max-w-[200px]"
          >
            <div className="mb-2 aspect-square overflow-hidden rounded">
              <ImageSlot
                placeholder={PLACEHOLDER_BY_TYPE[product.type]}
                className="h-full w-full"
              />
            </div>
            <div className="text-[13px] font-semibold leading-snug text-ink group-hover:underline">
              {product.title}
            </div>
            <div className="text-[13px] text-ink-muted">€{product.priceEur}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
