import type { SanityImageSource } from '@sanity/image-url';

import type { ImageWithAlt } from '../alt';
import type { Location } from '../location';
import type { LocalizedUse } from '../use';

export type ImageField = ImageWithAlt & {
  image?: SanityImageSource;
};

export type ProjectCard = {
  title: string;
  slug: string;
  location?: Location;
  coverImage?: ImageField;
  translated?: ProjectCard | null;
};

export type Project = ProjectCard & {
  description?: string;
  use?: LocalizedUse[];
  year?: string;
  collaborators?: string;
  photography?: string;
  images?: ImageField[];
  relatedProjects?: ProjectCard[];
  useRefIds?: string[];
};

export const imageProjection = `{
  alt,
  image
}`;

export const locationProjection = `location {
  place,
  country {
    full,
    short
  }
}`;

export const projectCardFields = `
  title,
  "slug": slug.current,
  ${locationProjection},
  "coverImage": images[0] ${imageProjection}
`;
