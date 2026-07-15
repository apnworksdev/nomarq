import type { SanityImageSource } from '@sanity/image-url';

import type { ImageWithAlt } from './alt';
import type { Locale } from './i18n';

export type HomeSectionLayout = 'vertical' | 'horizontal';
export type HomeSectionType = 'project' | 'journal';

export type HomeSectionItem = {
  title: string;
  slug?: string;
  coverImage?: ImageWithAlt & { image?: SanityImageSource };
  externalLink?: string;
  category?: string;
};

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

  if (section.sectionType === 'journal' && section.journal?.externalLink) {
    return section.journal.externalLink;
  }

  return undefined;
}

export function isExternalHomeLink(href: string | undefined): boolean {
  return href != null && /^https?:\/\//.test(href);
}
