import type { Metadata } from "next";
import { getPathname } from "./navigation";
import { LOCALES, routing, type Locale } from "./routing";

export const SITE_URL = "https://www.tallwoodmaker.com";

/** Absolute URL of `path` in `locale` — unprefixed for English. */
export function localizedUrl(locale: Locale, path: string): string {
  const pathname = getPathname({ locale, href: path });
  return pathname === "/" ? SITE_URL : `${SITE_URL}${pathname}`;
}

/**
 * canonical + hreflang alternates for one page in every language, with
 * x-default pointing at the English version.
 */
export function alternatesFor(
  locale: Locale,
  path: string
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = localizedUrl(l, path);
  languages["x-default"] = localizedUrl(routing.defaultLocale, path);
  return { canonical: localizedUrl(locale, path), languages };
}

/**
 * Standard per-page metadata: localized title/description + alternates.
 * `absoluteTitle` skips the "%s · TallWoodMaker" template (homepage).
 */
export function pageMetadata({
  locale,
  path,
  title,
  absoluteTitle = false,
  description,
  noindex = false,
}: {
  locale: Locale;
  path: string;
  title?: string;
  absoluteTitle?: boolean;
  description?: string;
  noindex?: boolean;
}): Metadata {
  return {
    title: title && absoluteTitle ? { absolute: title } : title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      title: title ?? "TallWoodMaker",
      description,
      url: localizedUrl(locale, path),
      locale,
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
