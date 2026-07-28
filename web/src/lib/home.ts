import type { SanityImageSource } from '@sanity/image-url';

import type { ImageWithAlt } from './alt';
import type { Locale } from './i18n';
import { getLocalizedPath } from './i18n';
import { getJournalEntryHref } from './journal';
import type { Location } from './location';
import { getJournalCategoryLabel, getNavLabel, getUi } from './ui';

export type HomeSectionLayout = 'vertical' | 'horizontal';
export type HomeSectionType = 'project' | 'journal';

export type HomeSectionImage = ImageWithAlt & { image?: SanityImageSource };

export type HomeSectionItem = {
  title: string;
  slug?: string;
  shortDescription?: string;
  images?: HomeSectionImage[];
  externalLink?: string;
  category?: string;
  location?: Location;
};

export function getHomeSectionImages(item: HomeSectionItem): HomeSectionImage[] {
  return item.images ?? [];
}

export function getHomeSectionCover(item: HomeSectionItem): HomeSectionImage | undefined {
  return getHomeSectionImages(item)[0];
}

export function isHomeSectionExpandable(item: HomeSectionItem): boolean {
  return Boolean(item.shortDescription?.trim() || getHomeSectionImages(item).some((image) => image.image));
}

export type HomeSectionCaption = {
  type: string[];
  title: string;
  place?: string;
  country?: string;
};

export function formatHomeSectionCaption(
  section: HomeSection,
  locale: Locale,
): HomeSectionCaption {
  const item = getHomeSectionItem(section);

  if (!item) {
    return { type: [], title: '' };
  }

  if (section.sectionType === 'project') {
    const place = item.location?.place?.trim() || undefined;
    const country =
      item.location?.country?.short?.trim() ||
      item.location?.country?.full?.trim() ||
      undefined;

    return {
      type: [`(${getNavLabel(locale, 'projects')})`],
      title: item.title,
      place,
      country,
    };
  }

  const categoryLabel = item.category
    ? getJournalCategoryLabel(locale, item.category)
    : '';
  const journalLabel = getUi(locale).sectionTypes.journal;

  return {
    type: [`(${journalLabel})`, `${categoryLabel}`],
    title: item.title,
  };
}

export type HomeSection = {
  _key: string;
  sectionType: HomeSectionType;
  layout?: HomeSectionLayout;
  startingColumn?: string;
  verticalCount?: string | number;
  horizontalCount?: string | number;
  journalCount?: string | number;
  project?: HomeSectionItem | null;
  journal?: HomeSectionItem | null;
};

export type HomeDocument = {
  sections?: HomeSection[];
};

export function resolveStartingColumn(section: HomeSection): number | undefined {
  const legacy =
    section.verticalCount ?? section.horizontalCount ?? section.journalCount;
  const raw = section.startingColumn ?? legacy;

  if (raw == null || raw === '') {
    return undefined;
  }

  const column = Number.parseInt(String(raw), 10);

  return Number.isFinite(column) ? column : undefined;
}

export function getHomeSectionItem(section: HomeSection): HomeSectionItem | null {
  if (section.sectionType === 'project') {
    return section.project ?? null;
  }

  return section.journal ?? null;
}

export function getHomeSectionHref(
  section: HomeSection,
  locale: Locale,
  getLocalizedPath: (locale: Locale, path: string) => string,
): string | undefined {
  if (section.sectionType === 'project' && section.project?.slug) {
    return getLocalizedPath(locale, `/projects/${section.project.slug}`);
  }

  if (section.sectionType === 'journal' && section.journal) {
    return getJournalEntryHref(locale, section.journal);
  }

  return undefined;
}

export function getHomeSectionLinkLabel(section: HomeSection, locale: Locale): string {
  const copy = getUi(locale);

  return section.sectionType === 'journal' ? copy.fullJournal : copy.fullProject;
}

export function isExternalHomeLink(href: string | undefined): boolean {
  return href != null && /^https?:\/\//.test(href);
}
