import type { Locale } from '../i18n';
import type { HomeDocument } from '../home';
import { translatedProjectRef } from './localized';
import { imageProjection } from './shared';

const translatedJournalRef = `*[_type == "translation.metadata" && references(^._id)][0].translations[language == $language][0].value->`;

/**
 * When the requested language version is an empty i18n shell, fall back to any
 * sibling translation that actually has a title (common when content lives on ES).
 */
const projectContentFallback = `*[_type == "translation.metadata" && references(^._id)][0].translations[defined(value->title)][0].value->`;
const journalContentFallback = `*[_type == "translation.metadata" && references(^._id)][0].translations[defined(value->title)][0].value->`;

const localizedHomeProjectProjection = `
  "title": coalesce(${translatedProjectRef}title, title, ${projectContentFallback}title),
  "slug": coalesce(${translatedProjectRef}slug.current, slug.current, ${projectContentFallback}slug.current),
  "shortDescription": coalesce(
    ${translatedProjectRef}shortDescription,
    shortDescription,
    ${projectContentFallback}shortDescription
  ),
  "location": coalesce(
    ${translatedProjectRef}location,
    location,
    ${projectContentFallback}location
  ) {
    place,
    country {
      full,
      short
    }
  },
  "images": coalesce(
    select(count(${translatedProjectRef}images[defined(image.asset)]) > 0 => ${translatedProjectRef}images),
    select(count(images[defined(image.asset)]) > 0 => images),
    ${projectContentFallback}images
  )[] ${imageProjection}
`;

const localizedHomeJournalProjection = `
  "title": coalesce(${translatedJournalRef}title, title, ${journalContentFallback}title),
  "slug": coalesce(${translatedJournalRef}slug.current, slug.current, ${journalContentFallback}slug.current),
  "category": coalesce(${translatedJournalRef}category, category, ${journalContentFallback}category),
  "shortDescription": coalesce(
    ${translatedJournalRef}shortDescription,
    shortDescription,
    ${journalContentFallback}shortDescription
  ),
  "externalLink": coalesce(
    ${translatedJournalRef}externalLink,
    externalLink,
    ${journalContentFallback}externalLink
  ),
  "images": coalesce(
    select(count(${translatedJournalRef}images[defined(image.asset)]) > 0 => ${translatedJournalRef}images),
    select(count(images[defined(image.asset)]) > 0 => images),
    ${journalContentFallback}images
  )[] ${imageProjection}
`;

const localizedProjectFromRef = `project->{${localizedHomeProjectProjection}}`;

const localizedJournalFromRef = `journal->{${localizedHomeJournalProjection}}`;

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

export type HomeQueryParams = {
  language: Locale;
  defaultLanguage: Locale;
};

export type { HomeDocument };
