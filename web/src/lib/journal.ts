import type { ImageField } from './queries/shared';
import type { Locale } from './i18n';
import { getLocalizedPath } from './i18n';

export type JournalCard = {
  title: string;
  slug: string;
  category?: string;
  year?: string | number;
  coverImage?: ImageField;
  translated?: JournalCard | null;
};

export type JournalEntry = JournalCard & {
  _id: string;
  externalLink?: string;
  description?: string;
  collaborators?: string;
  photography?: string;
  images?: ImageField[];
  relatedJournals?: JournalCard[];
};

export const journalBasePath = '/about/journal';

export function getJournalEntryHref(
  locale: Locale,
  entry: Pick<JournalEntry, 'slug' | 'externalLink'>,
): string | undefined {
  const externalLink = entry.externalLink?.trim();

  if (externalLink) {
    return externalLink;
  }

  if (entry.slug) {
    return getLocalizedPath(locale, `${journalBasePath}/${entry.slug}`);
  }

  return undefined;
}

export function isExternalJournalLink(href: string): boolean {
  return /^https?:\/\//.test(href);
}
