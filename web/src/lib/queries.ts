import type { SanityImageSource } from '@sanity/image-url';

import type { Locale } from './i18n';
import type { ImageWithAlt } from './alt';
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

export const homeQuery = `coalesce(
  *[_type == "home" && language == $language][0],
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
    project->{
      title,
      "slug": slug.current,
      "coverImage": images[0] ${imageProjection}
    },
    journal->{
      title,
      "slug": slug.current,
      category,
      externalLink,
      "coverImage": images[0] ${imageProjection}
    }
  }
}`;

export type ProjectQueryParams = {
  slug?: string;
  language: Locale;
};

export type HomeQueryParams = {
  language: Locale;
};

export type { HomeDocument };
