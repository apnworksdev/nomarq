import type { SanityImageSource } from '@sanity/image-url';

export type Project = {
  title: string;
  slug: string;
  description?: string;
  image?: SanityImageSource;
};

export const projectsQuery = `*[_type == "project"] | order(title asc) {
  title,
  "slug": slug.current,
  description,
  image
}`;

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  description,
  image
}`;

export const projectSlugsQuery = `*[_type == "project" && defined(slug.current)] {
  "slug": slug.current
}`;
