import Image from "next/image";
import { useTranslations } from "next-intl";
import ImageSlot from "@/components/ImageSlot";
import type { ShopProduct } from "@/lib/shopProducts";

// Shared by ShopGrid, the detail page, and the cart page — works from both
// Server and Client Components. Parent must be `relative` and have an
// aspect ratio set (aspect-[2/3] matches real cover art).
export default function ProductThumbnail({
  product,
  sizes,
}: {
  product: ShopProduct;
  sizes: string;
}) {
  const t = useTranslations("shop.placeholder");

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

  return <ImageSlot placeholder={t(product.type)} className="h-full w-full" />;
}
