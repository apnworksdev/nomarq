import type { SanityImageSource } from '@sanity/image-url';

import type { ImageWithAlt } from './alt';
import type { Location } from './location';

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

export const projectsQuery = `*[_type == "project"] | order(title asc) {
  title,
  "slug": slug.current,
  description,
  ${locationProjection},
  "coverImage": images[0] ${imageProjection}
}`;

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  description,
  ${locationProjection},
  images[] ${imageProjection}
}`;

export const projectSlugsQuery = `*[_type == "project" && defined(slug.current)] {
  "slug": slug.current
}`;
