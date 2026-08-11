import type { Metadata } from "next";
import ImageSlot from "@/components/ImageSlot";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Tables, shelves, small pieces, and custom builds — a selection from the shop over the years.",
};

const GALLERY_ITEMS = [
  { title: "Oak dining table", category: "Tables" },
  { title: "Wall-mounted bookshelf", category: "Shelves" },
  { title: "Cutting board with handle", category: "Small pieces" },
  { title: "Custom kitchen build", category: "Custom builds" },
  { title: "Coffee table", category: "Tables" },
  { title: "Corner shelf", category: "Shelves" },
  { title: "Wooden clock", category: "Small pieces" },
  { title: "Built-in wardrobe", category: "Custom builds" },
  { title: "Fireplace bench", category: "Tables" },
];

export default function GalleryPage() {
  return (
    <>
      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)]">
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Gallery
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          Tables, shelves, small pieces, and custom builds — a selection from
          the shop over the years.
        </p>
      </section>

      <section className="container-page section-px grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-6 gap-y-8 pb-[clamp(24px,5vw,64px)]">
        {GALLERY_ITEMS.map((item) => (
          <div key={item.title}>
            <div className="mb-3.5 aspect-[4/3]">
              <ImageSlot placeholder="project photo" className="h-full w-full" />
            </div>
            <div className="mb-0.5 text-[15px] font-semibold">{item.title}</div>
            <div className="text-sm text-ink-muted">{item.category}</div>
          </div>
        ))}
      </section>
    </>
  );
}
