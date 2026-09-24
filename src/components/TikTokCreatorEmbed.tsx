"use client";

import { useEffect, useRef, useState } from "react";

const TIKTOK_HANDLE = "tallwoodmaker";

declare global {
  interface Window {
    tiktokEmbed?: { lib?: { render?: (nodes: NodeListOf<Element>) => void } };
  }
}

/**
 * Official TikTok "Creator Embed" — auto-updates with the account's latest
 * public videos, no API key. If embed.js fails to load (ad blockers, no JS),
 * the blockquote's own contents still render as a plain link to the profile.
 *
 * Lazy-loaded: TikTok's embed.js preloads several videos as soon as it runs,
 * which was pulling ~14 MB over the wire on every homepage visit (the single
 * biggest hit to our PageSpeed score). We now only inject the script once
 * this block actually scrolls near the viewport, so visitors who don't
 * scroll this far never pay that cost.
 */
export default function TikTokCreatorEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) return;
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.tiktok.com/embed.js"]',
    );
    if (existing) {
      window.tiktokEmbed?.lib?.render?.(
        document.querySelectorAll(".tiktok-embed"),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, [shouldLoad]);

  return (
    <div ref={containerRef}>
      <blockquote
        className="tiktok-embed"
        cite={`https://www.tiktok.com/@${TIKTOK_HANDLE}`}
        data-unique-id={TIKTOK_HANDLE}
        data-embed-type="creator"
        style={{ maxWidth: "780px", minWidth: "288px" }}
      >
        <section>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.tiktok.com/@${TIKTOK_HANDLE}`}
          >
            @{TIKTOK_HANDLE}
          </a>
        </section>
      </blockquote>
    </div>
  );
}
