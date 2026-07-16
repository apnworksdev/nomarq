import type { SanityImageSource } from '@sanity/image-url';

import type { Locale } from './i18n';
import type { ImageWithAlt } from './alt';
import { defaultLocale } from './i18n';
import { languageFilter } from './locale';
import type { Location } from './location';
import type { HomeDocument } from './home';

export type ImageField = ImageWithAlt & {
  image?: SanityImageSource;
};

export type Project = {
  title: string;
  slug: string;
  description?: string;
  location?: Location;
  coverImage?: ImageField;
  images?: ImageField[];
};

const imageProjection = `{
  alt,
  image
}`;

const locationProjection = `location {
  place,
  country {
    full,
    short
  }
}`;

export const projectsQuery = `*[_type == "project" && ${languageFilter}] | order(title asc) {
  title,
  "slug": slug.current,
  description,
  ${locationProjection},
  "coverImage": images[0] ${imageProjection}
}`;

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug && ${languageFilter}][0] {
  title,
  "slug": slug.current,
  description,
  ${locationProjection},
  images[] ${imageProjection}
}`;

export const projectSlugsQuery = `*[_type == "project" && defined(slug.current) && ${languageFilter}] {
  "slug": slug.current
}`;

const homeProjectFields = `
  title,
  "slug": slug.current,
  shortDescription,
  ${locationProjection},
  images[] ${imageProjection}
`;

const homeJournalFields = `
  title,
  "slug": slug.current,
  category,
  shortDescription,
  externalLink,
  images[] ${imageProjection}
`;

const localizedProjectFromRef = `coalesce(
  *[_type == "translation.metadata" && references(project._ref)][0].translations[language == $language][0].value->{${homeProjectFields}},
  project->{${homeProjectFields}}
)`;

const localizedJournalFromRef = `coalesce(
  *[_type == "translation.metadata" && references(journal._ref)][0].translations[language == $language][0].value->{${homeJournalFields}},
  journal->{${homeJournalFields}}
)`;

export const homeQuery = `coalesce(
  *[_type == "home" && language == $defaultLanguage][0],
  *[_type == "home" && !defined(language)][0],
  *[_id == "home"][0]
) {
  sections[] {
    _key,
    sectionType,
    layout,
    startingColumn,
    verticalCount,
    horizontalCount,
    journalCount,
    "project": select(sectionType == "project" && defined(project._ref) => ${localizedProjectFromRef}),
    "journal": select(sectionType == "journal" && defined(journal._ref) => ${localizedJournalFromRef})
  }
}`;

export type ProjectQueryParams = {
  slug?: string;
  language: Locale;
};

export type HomeQueryParams = {
  language: Locale;
  defaultLanguage: Locale;
};

export type { HomeDocument };
