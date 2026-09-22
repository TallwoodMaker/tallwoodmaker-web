import Image from "next/image";
import ImageSlot from "@/components/ImageSlot";
import type { ShopProduct } from "@/lib/shopProducts";

const PLACEHOLDER_BY_TYPE: Record<ShopProduct["type"], string> = {
  plan: "plan preview",
  ebook: "ebook cover",
};

// Shared by ShopGrid, the detail page, and the cart page — no hooks, so it
// works from both Server and Client Components. Parent must be `relative`
// and have an aspect ratio set (aspect-[2/3] matches real cover art).
export default function ProductThumbnail({
  product,
  sizes,
}: {
  product: ShopProduct;
  sizes: string;
}) {
  if (product.imageUrl) {
    return (
      <Image
        src={product.imageUrl}
        alt={product.title}
        fill
        sizes={sizes}
        className="object-cover"
      />
    );
  }

  return (
    <ImageSlot
      placeholder={PLACEHOLDER_BY_TYPE[product.type]}
      className="h-full w-full"
    />
  );
}
