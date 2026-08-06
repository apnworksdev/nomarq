import type { ImageField } from './queries/shared';
import type { Locale } from './i18n';
import { getLocalizedPath, normalizePath } from './i18n';

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

export type JournalSection = 'recognition' | 'initiatives';

export type JournalCategory =
  | 'prize'
  | 'press'
  | 'conferences'
  | 'editorial'
  | 'exhibition'
  | 'events';

export const JOURNAL_SECTIONS = {
  recognition: {
    path: '/about/recognition',
    categories: ['prize', 'press', 'conferences'] as const satisfies readonly JournalCategory[],
  },
  initiatives: {
    path: '/about/initiatives',
    categories: ['editorial', 'exhibition', 'events'] as const satisfies readonly JournalCategory[],
  },
} as const;

export const JOURNAL_CATEGORY_ORDER = [
  ...JOURNAL_SECTIONS.recognition.categories,
  ...JOURNAL_SECTIONS.initiatives.categories,
] as const;

export function getJournalSection(category?: string): JournalSection | undefined {
  if (!category) {
    return undefined;
  }

  if ((JOURNAL_SECTIONS.recognition.categories as readonly string[]).includes(category)) {
    return 'recognition';
  }

  if ((JOURNAL_SECTIONS.initiatives.categories as readonly string[]).includes(category)) {
    return 'initiatives';
  }

  return undefined;
}

export function getJournalSectionPath(section: JournalSection): string {
  return JOURNAL_SECTIONS[section].path;
}

export function getJournalBasePath(category?: string): string {
  const section = getJournalSection(category);
  return section ? JOURNAL_SECTIONS[section].path : JOURNAL_SECTIONS.recognition.path;
}

export function getJournalSectionFromPath(pathname: string): JournalSection | null {
  const path = normalizePath(pathname);

  if (path === '/about/recognition' || path.startsWith('/about/recognition/')) {
    return 'recognition';
  }

  if (path === '/about/initiatives' || path.startsWith('/about/initiatives/')) {
    return 'initiatives';
  }

  return null;
}

export function getJournalEntryHref(
  locale: Locale,
  entry: Pick<JournalEntry, 'slug' | 'externalLink' | 'category'>,
): string | undefined {
  const externalLink = entry.externalLink?.trim();

  if (externalLink) {
    return externalLink;
  }

  if (entry.slug) {
    const basePath = getJournalBasePath(entry.category);
    return getLocalizedPath(locale, `${basePath}/${entry.slug}`);
  }

  return undefined;
}

export function isExternalJournalLink(href: string): boolean {
  return /^https?:\/\//.test(href);
}
