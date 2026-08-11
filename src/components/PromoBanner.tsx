import Link from "next/link";

type PromoBannerProps = {
  title: string;
  description: string;
  linkHref: string;
  linkLabel: string;
};

export default function PromoBanner({
  title,
  description,
  linkHref,
  linkLabel,
}: PromoBannerProps) {
  return (
    <div className="bg-brand py-8">
      <div className="container-page section-px flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="mb-2 text-[28px] font-bold">{title}</h2>
          <p className="m-0 text-base text-ink-muted-2">{description}</p>
        </div>
        <Link href={linkHref} className="text-[15px] font-semibold">
          {linkLabel}
        </Link>
      </div>
    </div>
  );
}
