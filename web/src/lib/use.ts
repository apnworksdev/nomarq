import type { Locale } from './i18n';

export type LocalizedUse = {
  titleEn: string;
  titleEs: string;
  slug?: { current?: string };
};

export function getUseTitle(use: LocalizedUse, locale: Locale): string {
  return locale === 'es' ? use.titleEs : use.titleEn;
}
