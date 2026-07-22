import {
  imageProjection,
  locationProjection,
  projectCardFields,
} from './shared';
import { languageFilter } from '../locale';

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
  use[]->{
    titleEn,
    titleEs,
    slug
  },
  "useRefIds": use[]._ref,
  year,
  collaborators,
  photography,
  images[] ${imageProjection},
  "relatedProjects": relatedProjects[]->{
    title,
    "slug": slug.current,
    ${locationProjection},
    "coverImage": images[0] ${imageProjection},
    "translated": *[_type == "translation.metadata" && references(^._id)][0].translations[language == $language][0].value->{
      title,
      "slug": slug.current,
      ${locationProjection},
      "coverImage": images[0] ${imageProjection}
    }
  }
}`;

export const relatedProjectsQuery = `*[
  _type == "project"
  && ${languageFilter}
  && slug.current != $slug
  && !(slug.current in $excludeSlugs)
] {
  ${projectCardFields},
  "score": count((use[]._ref)[@ in $useIds])
    + select(location.country.full == $countryFull => 2, 0)
    + select(location.place == $place => 1, 0)
}
| order(score desc, title asc)
[0...$limit]`;

export const projectSlugsQuery = `*[_type == "project" && defined(slug.current) && ${languageFilter}] {
  "slug": slug.current
}`;
