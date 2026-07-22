import type { Locale } from '../i18n';
import type { HomeDocument } from '../home';
import { languageFilter } from '../locale';
import { imageProjection, locationProjection } from './shared';

const homeProjectFields = `
  title,
  "slug": slug.current,
  shortDescription,
  ${locationProjection},
  images[] ${imageProjection}
`;

const homeJournalFields = `
  title,
  "slug": slug.current,
  category,
  shortDescription,
  externalLink,
  images[] ${imageProjection}
`;

const localizedProjectFromRef = `coalesce(
  *[_type == "translation.metadata" && references(project._ref)][0].translations[language == $language][0].value->{${homeProjectFields}},
  project->{${homeProjectFields}}
)`;

const localizedJournalFromRef = `coalesce(
  *[_type == "translation.metadata" && references(journal._ref)][0].translations[language == $language][0].value->{${homeJournalFields}},
  journal->{${homeJournalFields}}
)`;

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
