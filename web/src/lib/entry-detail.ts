import type { Locale } from './i18n';
import { getLocalizedPath } from './i18n';
import type { JournalCard } from './journal';
import { journalBasePath } from './journal';
import type { ProjectCard } from './queries';
import type { ImageField } from './queries/shared';
import { getJournalCategoryLabel } from './ui';
import { formatYear } from './year';

export type TechnicalRow = {
  label: string;
  value: string;
};

export type RelatedEntryItem = {
  title: string;
  href: string;
  place?: string;
  country?: string;
  coverImage?: ImageField;
};

export function projectToRelatedEntry(
  project: ProjectCard,
  locale: Locale,
): RelatedEntryItem | null {
  if (!project.slug) {
    return null;
  }

  const place = project.location?.place?.trim() || undefined;
  const country =
    project.location?.country?.full?.trim() ||
    project.location?.country?.short?.trim() ||
    undefined;

  return {
    title: project.title,
    href: getLocalizedPath(locale, `/projects/${project.slug}`),
    place,
    country,
    coverImage: project.coverImage,
  };
}

export function journalToRelatedEntry(
  entry: JournalCard,
  locale: Locale,
): RelatedEntryItem | null {
  if (!entry.slug) {
    return null;
  }

  const place = entry.category
    ? getJournalCategoryLabel(locale, entry.category)
    : undefined;
  const country = formatYear(entry.year);

  return {
    title: entry.title,
    href: getLocalizedPath(locale, `${journalBasePath}/${entry.slug}`),
    place,
    country,
    coverImage: entry.coverImage,
  };
}

export function mapRelatedEntries<T>(
  items: T[],
  mapper: (item: T, locale: Locale) => RelatedEntryItem | null,
  locale: Locale,
): RelatedEntryItem[] {
  const result: RelatedEntryItem[] = [];

  for (const item of items) {
    const mapped = mapper(item, locale);

    if (mapped) {
      result.push(mapped);
    }
  }

  return result;
}

/** Split CMS plain-text descriptions into paragraphs on blank lines / newlines. */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
