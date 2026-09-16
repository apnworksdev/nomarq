import type { ImageField } from './queries/shared';
import type { Locale } from './i18n';
import { getLocalizedPath, normalizePath } from './i18n';

export type JournalSection = 'recognition' | 'initiatives';

export type JournalCard = {
  title: string;
  slug: string;
  category?: string;
  categorySection?: JournalSection;
  categoryLabel?: string;
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

export function getJournalSection(
  category?: string,
  section?: JournalSection | string | null,
): JournalSection | undefined {
  if (section === 'recognition' || section === 'initiatives') {
    return section;
  }

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

export function getJournalBasePath(category?: string, section?: JournalSection): string {
  const resolved = getJournalSection(category, section);
  return resolved ? JOURNAL_SECTIONS[resolved].path : JOURNAL_SECTIONS.recognition.path;
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
  entry: Pick<JournalEntry, 'slug' | 'externalLink' | 'category' | 'categorySection'>,
): string | undefined {
  const externalLink = entry.externalLink?.trim();

  if (externalLink) {
    return externalLink;
  }

  if (entry.slug) {
    const basePath = getJournalBasePath(entry.category, entry.categorySection);
    return getLocalizedPath(locale, `${basePath}/${entry.slug}`);
  }

  return undefined;
}

export function getJournalCategoryDisplayLabel(
  locale: Locale,
  entry: { category?: string; categoryLabel?: string },
  fallback: (locale: Locale, category: string) => string,
): string {
  const label = entry.categoryLabel?.trim();

  if (label) {
    return label;
  }

  return entry.category ? fallback(locale, entry.category) : '';
}

export function isExternalJournalLink(href: string): boolean {
  return /^https?:\/\//.test(href);
}
