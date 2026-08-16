"use client";

import { useEffect } from "react";

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
 */
export default function TikTokCreatorEmbed() {
  useEffect(() => {
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
  }, []);

  return (
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
  );
}
