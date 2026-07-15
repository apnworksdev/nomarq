import { defaultLocale, type Locale } from './i18n';

/** GROQ filter for documents in a given language (includes legacy docs without language). */
export const languageFilter = `(!defined(language) || language == $language)`;

export function resolvePageLocale(pathname: string): Locale {
  if (pathname === '/es' || pathname.startsWith('/es/')) {
    return 'es';
  }

  return defaultLocale;
}
