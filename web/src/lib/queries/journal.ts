import type { Locale } from '../i18n';
import type { JournalCard, JournalEntry } from '../journal';
import { imageProjection } from './shared';

const translatedJournalRef = `*[_type == "translation.metadata" && references(^._id)][0].translations[language == $language][0].value->`;

/** One base document per journal entry; translations resolve via coalesce. */
const validJournalFilter = `_type == "journal" && defined(title) && defined(slug.current) && (!defined(language) || language == $defaultLanguage)`;

const localizedJournalCardProjection = `
  "title": coalesce(${translatedJournalRef}title, title),
  "category": coalesce(${translatedJournalRef}category, category),
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
  "collaborators": coalesce(${translatedJournalRef}collaborators, collaborators),
  "photography": coalesce(${translatedJournalRef}photography, photography)
`;

export const journalsQuery = `*[${validJournalFilter}] | order(year desc, title asc) {
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
  "score": select(coalesce(${translatedJournalRef}category, category) == $category => 2, 0)
    + select(coalesce(${translatedJournalRef}year, year) == $year => 1, 0)
}
| order(score desc, title asc)
[0...$limit]`;

export const journalSlugsQuery = `*[
  ${validJournalFilter}
  && !defined(coalesce(${translatedJournalRef}externalLink, externalLink))
] {
  "slug": coalesce(${translatedJournalRef}slug.current, slug.current)
}`;

export type JournalsQueryParams = {
  language: Locale;
  defaultLanguage: Locale;
};

export type { JournalCard, JournalEntry };
