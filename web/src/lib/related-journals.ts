import type { Locale } from './i18n';
import type { JournalCard } from './journal';
import { relatedJournalsQuery } from './queries/journal';
import { sanity } from './sanity';

export const RELATED_JOURNAL_COUNT = 3;

export type RelatedJournalInput = {
  slug: string;
  category?: string;
  year?: string | number;
  relatedJournals?: JournalCard[];
};

function resolveJournalCard(entry: JournalCard): JournalCard | null {
  const resolved = entry.translated ?? entry;

  if (!resolved.slug) {
    return null;
  }

  return {
    title: resolved.title,
    slug: resolved.slug,
    category: resolved.category,
    year: resolved.year,
    coverImage: resolved.coverImage,
  };
}

function uniqueJournals(entries: JournalCard[], excludeSlugs: Set<string>): JournalCard[] {
  const seen = new Set<string>();
  const result: JournalCard[] = [];

  for (const entry of entries) {
    const resolved = resolveJournalCard(entry);
    if (!resolved || excludeSlugs.has(resolved.slug) || seen.has(resolved.slug)) {
      continue;
    }

    seen.add(resolved.slug);
    result.push(resolved);
  }

  return result;
}

export async function getRelatedJournals(
  entry: RelatedJournalInput,
  locale: Locale,
  defaultLanguage: Locale,
): Promise<JournalCard[]> {
  const excludeSlugs = new Set<string>([entry.slug]);
  const manual = uniqueJournals(entry.relatedJournals ?? [], excludeSlugs).slice(
    0,
    RELATED_JOURNAL_COUNT,
  );

  if (manual.length >= RELATED_JOURNAL_COUNT) {
    return manual;
  }

  manual.forEach((item) => excludeSlugs.add(item.slug));

  const automatic = await sanity.fetch<JournalCard[]>(relatedJournalsQuery, {
    language: locale,
    defaultLanguage,
    slug: entry.slug,
    excludeSlugs: [...excludeSlugs],
    category: entry.category ?? '',
    year: entry.year ?? '',
    limit: RELATED_JOURNAL_COUNT - manual.length,
  });

  const related = [...manual];

  for (const item of automatic) {
    if (related.length >= RELATED_JOURNAL_COUNT) {
      break;
    }

    if (!excludeSlugs.has(item.slug)) {
      related.push(item);
      excludeSlugs.add(item.slug);
    }
  }

  return related.slice(0, RELATED_JOURNAL_COUNT);
}
