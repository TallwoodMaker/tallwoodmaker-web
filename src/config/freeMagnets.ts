/**
 * The three free PDFs tested from paid ads (November 2026). Each has its own
 * landing page (/free/<slug>), lead source, PDF and follow-up question, and
 * all three lead to the same course, "Furniture Without a Big Shop".
 *
 * English only on purpose: the ads run in English, so these pages are not
 * translated and never redirect by browser language (src/proxy.ts).
 */

export type FreeSource = "ad-build" | "ad-paid" | "ad-kitchen";
export type FreePath =
  | "free-small-shop"
  | "free-first-client"
  | "free-kitchen-checklist";
/** ?t= on /free/thanks: which offer to show. */
export type OfferKey = "build" | "paid" | "kitchen";

export type FreeMagnet = {
  slug: string;
  source: FreeSource;
  path: FreePath;
  offer: OfferKey;
  /** Name of the PDF, used in the email subject ("Your PDF: …"). */
  pdfTitle: string;
  /** File in public/downloads/free/. */
  pdfFile: string;
  h1: string;
  sub: string;
  bullets: [string, string, string];
  /** Optional line under the form. */
  formNote?: string;
  /** The one question asked in the PDF email. */
  emailQuestion: string;
};

export const FREE_MAGNETS: FreeMagnet[] = [
  {
    slug: "small-shop",
    source: "ad-build",
    path: "free-small-shop",
    offer: "build",
    pdfTitle: "Furniture Without a Big Shop",
    pdfFile: "TallWoodMaker_furniture-without-a-big-shop.pdf",
    h1: "Build your own furniture without a big shop",
    sub: "The free guide: what to hand over, what to do yourself, and the few tools you need.",
    bullets: [
      "Which steps to outsource",
      "The tools that are enough",
      "How to order a cutting service without mistakes",
    ],
    emailQuestion:
      "Quick question: what is stopping you from building your own furniture right now? Just hit reply.",
  },
  {
    slug: "first-client",
    source: "ad-paid",
    path: "free-first-client",
    offer: "paid",
    pdfTitle: "Your First Client in 7 Steps",
    pdfFile: "TallWoodMaker_first-client-in-7-steps.pdf",
    h1: "Get paid to build furniture. No big shop needed.",
    sub: "The free guide: your first paying client in 7 steps.",
    bullets: [
      "The order I would do it in today",
      "What you do not need to own",
      "A simple quote, line by line",
    ],
    formNote: "No income promises. Just the process.",
    emailQuestion:
      "Quick question: what is the hardest part of getting your first paying client? Just hit reply.",
  },
  {
    slug: "kitchen-checklist",
    source: "ad-kitchen",
    path: "free-kitchen-checklist",
    offer: "kitchen",
    pdfTitle: "Kitchen Planning Checklist",
    pdfFile: "TallWoodMaker_kitchen-planning-checklist.pdf",
    h1: "Building your own kitchen? Check this before you cut.",
    sub: "The free planning checklist from 15 years of building kitchens.",
    bullets: [
      "How to measure a room that is not square",
      "Why appliances come before cabinets",
      "The dimensions most kitchens use",
    ],
    emailQuestion:
      "Quick question: what worries you most about building your own kitchen? Just hit reply.",
  },
];

export const FREE_SOURCES = FREE_MAGNETS.map((m) => m.source);
export const COURSE_WAITLIST_SOURCE = "course-waitlist";
export const COURSE_NAME = "Furniture Without a Big Shop";

export function getFreeMagnetBySlug(slug: string): FreeMagnet | undefined {
  return FREE_MAGNETS.find((m) => m.slug === slug);
}

export function getFreeMagnetBySource(source: string): FreeMagnet | undefined {
  return FREE_MAGNETS.find((m) => m.source === source);
}

export function getFreeMagnetByOffer(offer: string): FreeMagnet | undefined {
  return FREE_MAGNETS.find((m) => m.offer === offer);
}

/** Public path of a magnet's PDF (relative to the site root). */
export function freePdfPath(magnet: FreeMagnet): string {
  return `/downloads/free/${magnet.pdfFile}`;
}
