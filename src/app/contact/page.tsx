import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Custom builds, content collaborations, or just a question about a project — get in touch.",
};

export default function ContactPage() {
  return (
    <>
      <div className="h-2 bg-brand" />

      <section className="container-page section-px pb-10 pt-[clamp(24px,5vw,64px)]">
        <h1 className="mb-4 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-0.01em]">
          Contact
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[1.6] text-ink-muted">
          Custom builds, content collaborations, or just a question about a
          project — get in touch.
        </p>
      </section>

      <section className="container-page section-px grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-14 pb-[clamp(24px,5vw,64px)]">
        <form className="flex max-w-[480px] flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="rounded border border-border bg-cream px-3 py-3 text-[15px] text-ink"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              className="rounded border border-border bg-cream px-3 py-3 text-[15px] text-ink"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">Message</label>
            <textarea
              rows={5}
              placeholder="Describe your project or question"
              className="resize-y rounded border border-border bg-cream px-3 py-3 text-[15px] text-ink"
            />
          </div>
          <button
            type="button"
            className="w-fit cursor-pointer rounded bg-brand px-7 py-3.5 text-[15px] font-bold text-ink"
          >
            Send
          </button>
        </form>

        <div>
          <div className="mb-7">
            <h3 className="mb-2 text-[15px] font-bold uppercase tracking-[0.05em] text-ink-muted">
              Email
            </h3>
            <a href="mailto:tom@tallwoodmaker.com" className="text-[17px] font-medium">
              tom@tallwoodmaker.com
            </a>
          </div>
          <div className="mb-7">
            <h3 className="mb-2 text-[15px] font-bold uppercase tracking-[0.05em] text-ink-muted">
              Workshop
            </h3>
            <div className="text-[17px] text-ink">Slovakia</div>
          </div>
          <div>
            <h3 className="mb-2 text-[15px] font-bold uppercase tracking-[0.05em] text-ink-muted">
              Social
            </h3>
            <div className="flex flex-col gap-2 text-[17px] font-medium">
              <a
                href="https://www.youtube.com/@tallwoodmaker"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube · @tallwoodmaker
              </a>
              <a
                href="https://www.instagram.com/tallwoodmaker"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram · @tallwoodmaker
              </a>
              <a
                href="https://www.tiktok.com/@tallwoodmaker"
                target="_blank"
                rel="noopener noreferrer"
              >
                TikTok · @tallwoodmaker
              </a>
              <a
                href="https://www.facebook.com/tallwoodmaker"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook · TallWoodMaker
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
