import { imageProjection } from './shared';

/** GROQ path to the translated project document for the requested language. */
export const translatedProjectRef = `*[_type == "translation.metadata" && references(^._id)][0].translations[language == $language][0].value->`;

/** Join referenced name documents into a comma-separated string. */
export function joinReferencedNames(translatedRef: string, field: string) {
  const value = `coalesce(${translatedRef}${field}, ${field})`;

  return `array::join(array::compact(${value}[]->name), ", ")`;
}

/** Published projects with real content (excludes empty i18n stubs).
 * One base document per project; translations resolve via coalesce. */
export const validProjectFilter = `_type == "project" && defined(slug.current) && defined(title) && count(images[defined(image.asset)]) > 0 && (!defined(language) || language == $defaultLanguage)`;

export const localizedProjectListProjection = `
  "title": coalesce(${translatedProjectRef}title, title),
  "slug": coalesce(${translatedProjectRef}slug.current, slug.current),
  "description": coalesce(${translatedProjectRef}description, description),
  "location": coalesce(${translatedProjectRef}location, location) {
    place,
    country {
      full,
      short
    }
  },
  "images": coalesce(${translatedProjectRef}images, images)[] ${imageProjection},
  "use": coalesce(${translatedProjectRef}use, use)[]->{
    titleEn,
    titleEs,
    "slug": slug.current
  },
  "year": coalesce(${translatedProjectRef}year, year)
`;

export const localizedProjectCardProjection = `
  "title": coalesce(${translatedProjectRef}title, title),
  "slug": coalesce(${translatedProjectRef}slug.current, slug.current),
  "location": coalesce(${translatedProjectRef}location, location) {
    place,
    country {
      full,
      short
    }
  },
  "coverImage": coalesce(${translatedProjectRef}images, images)[0] ${imageProjection}
`;

export const localizedProjectDetailProjection = `
  ${localizedProjectListProjection},
  "useRefIds": coalesce(${translatedProjectRef}use, use[]._ref),
  "year": coalesce(${translatedProjectRef}year, year),
  "collaborators": ${joinReferencedNames(translatedProjectRef, 'collaborators')},
  "photography": ${joinReferencedNames(translatedProjectRef, 'photography')},
  "deeperSections": coalesce(${translatedProjectRef}deeperSections, deeperSections)[] {
    name,
    description,
    "images": images[] ${imageProjection}
  }
`;
