import {
  localizedProjectCardProjection,
  localizedProjectDetailProjection,
  localizedProjectListProjection,
  translatedProjectRef,
  validProjectFilter,
} from './localized';

export const projectsQuery = `*[${validProjectFilter}] | order(title asc) {
  ${localizedProjectListProjection}
}`;

export const projectBySlugQuery = `*[${validProjectFilter} && (
  slug.current == $slug
  || ${translatedProjectRef}slug.current == $slug
)][0] {
  ${localizedProjectDetailProjection},
  "relatedProjects": coalesce(${translatedProjectRef}relatedProjects, relatedProjects)[]->{
    ${localizedProjectCardProjection}
  }
}`;

export const relatedProjectsQuery = `*[
  ${validProjectFilter}
  && slug.current != $slug
  && !(slug.current in $excludeSlugs)
] {
  ${localizedProjectCardProjection},
  "score": count((coalesce(${translatedProjectRef}use, use[]._ref))[@ in $useIds])
    + select(coalesce(${translatedProjectRef}location.country.full, location.country.full) == $countryFull => 2, 0)
    + select(coalesce(${translatedProjectRef}location.place, location.place) == $place => 1, 0)
}
| order(score desc, title asc)
[0...$limit]`;

export const projectSlugsQuery = `*[${validProjectFilter}] {
  "slug": coalesce(${translatedProjectRef}slug.current, slug.current)
}`;

/** Projects that have at least one deeper section with images (for /priv static paths). */
export const projectPrivSlugsQuery = `*[
  ${validProjectFilter} &&
  count(
    coalesce(${translatedProjectRef}deeperSections, deeperSections)[
      defined(name) && name != "" && count(images[defined(image.asset)]) > 0
    ]
  ) > 0
] {
  "slug": coalesce(${translatedProjectRef}slug.current, slug.current)
}`;
