import { defineRouting } from "next-intl/routing";

export const LOCALES = ["en", "de", "es", "pt", "fr", "pl", "cs", "sk"] as const;
export type Locale = (typeof LOCALES)[number];

/** Language names shown in the switcher, each in its own language. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  pt: "Português",
  fr: "Français",
  pl: "Polski",
  cs: "Čeština",
  sk: "Slovenčina",
};

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: "en",
  // English keeps today's unprefixed URLs (/shop); every other language is
  // prefixed (/de/shop).
  localePrefix: "as-needed",
  // A choice made in the language switcher is remembered for a year and
  // wins over the browser's Accept-Language on later visits.
  localeCookie: { maxAge: 60 * 60 * 24 * 365 },
});
