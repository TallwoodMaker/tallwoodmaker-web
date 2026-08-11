import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";
import PromoBanner from "@/components/PromoBanner";

export default function HomePage() {
  return (
    <>
      <section className="container-page section-px section-py grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-center gap-14">
        <div>
          <h1 className="mb-6 text-[clamp(40px,6vw,72px)] font-extrabold leading-[1.05] tracking-[-0.01em]">
            TallWoodMaker
          </h1>
          <p className="mb-8 max-w-[480px] text-[19px] leading-[1.6] text-ink-muted">
            Woodworking content for a growing community on YouTube, Instagram,
            and TikTok. From first sketch to final finish — the whole
            process, on camera.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/gallery"
              className="rounded bg-brand px-7 py-3.5 text-[15px] font-bold text-ink"
            >
              View projects
            </Link>
            <Link
              href="/video"
              className="rounded border border-border px-7 py-3.5 text-[15px] font-semibold text-ink"
            >
              Follow along
            </Link>
          </div>
        </div>
        <div className="aspect-[4/5] w-full">
          <ImageSlot placeholder="workshop hero photo" className="h-full w-full" />
        </div>
      </section>

      <section className="bg-brand section-px py-[22px]">
        <div className="container-page text-center text-[clamp(18px,2.6vw,28px)] font-extrabold tracking-[0.04em]">
          BUILD · SHARE · INSPIRE
        </div>
      </section>

      <section className="container-page section-px section-py grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-14">
        <div className="aspect-square w-full max-w-[400px]">
          <ImageSlot placeholder="portrait photo" className="h-full w-full" />
        </div>
        <div>
          <h2 className="mb-4 inline-block bg-brand px-3.5 py-1 text-[28px] font-bold">
            About
          </h2>
          <p className="mb-5 max-w-[520px] text-[17px] leading-[1.65] text-ink-muted">
            I build by hand and by machine, from first sketch to final
            finish. The content I make shows the whole process — mistakes,
            fixes, and finished pieces.
          </p>
          <Link href="/about" className="text-[15px] font-semibold">
            More about me →
          </Link>
        </div>
      </section>

      <PromoBanner
        title="Projects"
        description="A selection from the shop — tables, shelves, small pieces, and custom builds."
        linkHref="/gallery"
        linkLabel="Full gallery →"
      />

      <section className="container-page section-px section-py grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
        <div className="aspect-[4/3]">
          <ImageSlot placeholder="project photo" className="h-full w-full" />
        </div>
        <div className="aspect-[4/3]">
          <ImageSlot placeholder="project photo" className="h-full w-full" />
        </div>
        <div className="aspect-[4/3]">
          <ImageSlot placeholder="project photo" className="h-full w-full" />
        </div>
        <div className="aspect-[4/3]">
          <ImageSlot placeholder="project photo" className="h-full w-full" />
        </div>
      </section>

      <PromoBanner
        title="Follow the build"
        description="New video every week — process, tools, mistakes, and results."
        linkHref="/video"
        linkLabel="All videos →"
      />

      <section className="container-page section-px section-py">
        <div className="mb-7 flex flex-wrap gap-3">
          <span className="rounded-full border border-border px-[18px] py-2 text-sm font-medium">
            YouTube · @tallwoodmaker
          </span>
          <span className="rounded-full border border-border px-[18px] py-2 text-sm font-medium">
            Instagram · @tallwoodmaker
          </span>
          <span className="rounded-full border border-border px-[18px] py-2 text-sm font-medium">
            TikTok · @tallwoodmaker
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
          <div className="aspect-video">
            <ImageSlot placeholder="video thumbnail" className="h-full w-full" />
          </div>
          <div className="aspect-video">
            <ImageSlot placeholder="video thumbnail" className="h-full w-full" />
          </div>
          <div className="aspect-video">
            <ImageSlot placeholder="video thumbnail" className="h-full w-full" />
          </div>
        </div>
      </section>

      <section className="container-page section-px section-py grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-10 border-t border-border">
        <div className="rounded-md border border-border p-8">
          <h2 className="mb-2.5 inline-block bg-brand px-3.5 py-1 text-[22px] font-bold">
            Online Course
          </h2>
          <p className="mb-5 text-[15px] leading-[1.6] text-ink-muted">
            A step-by-step course on foundational joinery and shop setup —
            coming soon.
          </p>
          <Link href="/course" className="text-[15px] font-semibold">
            Learn more →
          </Link>
        </div>
        <div className="rounded-md border border-border p-8">
          <h2 className="mb-2.5 inline-block bg-brand px-3.5 py-1 text-[22px] font-bold">
            Work with me
          </h2>
          <p className="mb-5 text-[15px] leading-[1.6] text-ink-muted">
            Brand partnerships, sponsored builds, and discount codes for the
            community.
          </p>
          <Link href="/collaborate" className="text-[15px] font-semibold">
            See collaboration options →
          </Link>
        </div>
      </section>

      <PromoBanner
        title="Shop"
        description="Plans, guides, and a few finished pieces for sale."
        linkHref="/shop"
        linkLabel="Visit the shop →"
      />

      <section className="container-page section-px section-py grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
        <div>
          <div className="mb-3.5 aspect-[4/3]">
            <ImageSlot placeholder="product photo" className="h-full w-full" />
          </div>
          <div className="mb-1 text-[15px] font-semibold">Plan: Dining Table</div>
          <div className="text-[15px] text-ink-muted">$18</div>
        </div>
        <div>
          <div className="mb-3.5 aspect-[4/3]">
            <ImageSlot placeholder="product photo" className="h-full w-full" />
          </div>
          <div className="mb-1 text-[15px] font-semibold">Cutting Board Set</div>
          <div className="text-[15px] text-ink-muted">$64</div>
        </div>
        <div>
          <div className="mb-3.5 aspect-[4/3]">
            <ImageSlot placeholder="product photo" className="h-full w-full" />
          </div>
          <div className="mb-1 text-[15px] font-semibold">
            Guide: Mortise &amp; Tenon Joints
          </div>
          <div className="text-[15px] text-ink-muted">$9</div>
        </div>
      </section>
    </>
  );
}
