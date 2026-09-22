"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  ShopCategoryDef,
  ShopProduct,
  ShopProductCategory,
} from "@/lib/shopProducts";
import ProductThumbnail from "./ProductThumbnail";
import AddToCartButton from "./AddToCartButton";

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
          <div key={product.id} className="max-w-[200px]">
            <Link href={`/shop/${product.id}`} className="group block">
              <div className="relative mb-2 aspect-[2/3] overflow-hidden rounded">
                <ProductThumbnail product={product} sizes="200px" />
              </div>
              <div className="text-[13px] font-semibold leading-snug text-ink group-hover:underline">
                {product.title}
              </div>
            </Link>
            <div className="mb-2 text-[13px] text-ink-muted">
              €{product.priceEur}
            </div>
            <AddToCartButton productId={product.id} compact />
          </div>
        ))}
      </div>
    </>
  );
}
