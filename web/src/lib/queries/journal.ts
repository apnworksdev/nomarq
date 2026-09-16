import type { Locale } from '../i18n';
import type { JournalCard, JournalEntry, JournalSection } from '../journal';
import { joinReferencedNames } from './localized';
import { imageProjection } from './shared';

const translatedJournalRef = `*[_type == "translation.metadata" && references(^._id)][0].translations[language == $language][0].value->`;

/** One base document per journal entry; translations resolve via coalesce. */
const validJournalFilter = `_type == "journal" && defined(title) && defined(slug.current) && (!defined(language) || language == $defaultLanguage)`;

const categoryValue = `coalesce(${translatedJournalRef}category, category)`;

const localizedCategoryProjection = `
  "category": select(defined(${categoryValue}->slug.current) => ${categoryValue}->slug.current, ${categoryValue}),
  "categorySection": ${categoryValue}->section,
  "categoryLabel": select(
    $language == "es" => coalesce(${categoryValue}->titleEs, ${categoryValue}->titleEn),
    coalesce(${categoryValue}->titleEn, ${categoryValue}->titleEs)
  )
`;

const localizedJournalCardProjection = `
  "title": coalesce(${translatedJournalRef}title, title),
  ${localizedCategoryProjection},
  "year": coalesce(${translatedJournalRef}year, year),
  "slug": coalesce(${translatedJournalRef}slug.current, slug.current),
  "coverImage": coalesce(${translatedJournalRef}images, images)[0] ${imageProjection}
`;

const localizedJournalListProjection = `
  _id,
  ${localizedJournalCardProjection},
  "externalLink": coalesce(${translatedJournalRef}externalLink, externalLink),
  "description": coalesce(${translatedJournalRef}description, description),
  "images": coalesce(${translatedJournalRef}images, images)[] ${imageProjection}
`;

const localizedJournalDetailProjection = `
  _id,
  ${localizedJournalListProjection},
  "collaborators": ${joinReferencedNames(translatedJournalRef, 'collaborators')},
  "photography": ${joinReferencedNames(translatedJournalRef, 'photography')}
`;

const categorySlug = `coalesce(${categoryValue}->slug.current, ${categoryValue})`;
const categorySection = `${categoryValue}->section`;

export const journalsBySectionQuery = `*[
  ${validJournalFilter}
  && (
    ${categorySection} == $section
    || (
      !defined(${categorySection})
      && ${categorySlug} in $fallbackCategories
    )
  )
] | order(year desc, title asc) {
  ${localizedJournalListProjection}
}`;

export const journalBySlugQuery = `*[${validJournalFilter} && (
  slug.current == $slug
  || ${translatedJournalRef}slug.current == $slug
)][0] {
  ${localizedJournalDetailProjection},
  "relatedJournals": coalesce(${translatedJournalRef}relatedJournals, relatedJournals)[]->{
    ${localizedJournalCardProjection}
  }
}`;

export const relatedJournalsQuery = `*[
  ${validJournalFilter}
  && slug.current != $slug
  && !(slug.current in $excludeSlugs)
  && !defined(coalesce(${translatedJournalRef}externalLink, externalLink))
] {
  ${localizedJournalCardProjection},
  "score": select(${categorySlug} == $category => 2, 0)
    + select(coalesce(${translatedJournalRef}year, year) == $year => 1, 0)
}
| order(score desc, title asc)
[0...$limit]`;

export const journalSlugsBySectionQuery = `*[
  ${validJournalFilter}
  && (
    ${categorySection} == $section
    || (
      !defined(${categorySection})
      && ${categorySlug} in $fallbackCategories
    )
  )
  && !defined(coalesce(${translatedJournalRef}externalLink, externalLink))
] {
  "slug": coalesce(${translatedJournalRef}slug.current, slug.current)
}`;

export type JournalsQueryParams = {
  language: Locale;
  defaultLanguage: Locale;
  section?: JournalSection;
  fallbackCategories?: string[];
  categories?: string[];
};

export type { JournalCard, JournalEntry };
