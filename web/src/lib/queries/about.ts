import type { Locale } from '../i18n';
import type { AboutDocument } from '../about';
import { imageProjection, sanityImageProjection } from './shared';

const translatedJournalRef = `*[_type == "translation.metadata" && references(^._id)][0].translations[language == $language][0].value->`;

const journalEntryFields = `
  "title": coalesce(${translatedJournalRef}title, title),
  category,
  year,
  "slug": coalesce(${translatedJournalRef}slug.current, slug.current),
  externalLink
`;

const journalListProjection = (fields: string) => `select(
  defined(recognitions) && count(recognitions) > 0 => recognitions[]-> { ${fields} },
  *[_id == "about"][0].recognitions[]-> { ${fields} }
)[defined(title)]`;

const initiativeListProjection = (fields: string) => `select(
  defined(initiatives) && count(initiatives) > 0 => initiatives[]-> { ${fields} },
  *[_id == "about"][0].initiatives[]-> { ${fields} }
)[defined(title)]`;

export const aboutQuery = `coalesce(
  *[_type == "translation.metadata" && references("about")][0].translations[language == $language][0].value->,
  *[_id == "about"][0]
) {
  videoUrl,
  contactImage ${sanityImageProjection},
  studioDescription,
  direction,
  email,
  phone,
  imageSwiper[] ${imageProjection},
  "recognitions": ${journalListProjection(journalEntryFields)},
  "initiatives": ${initiativeListProjection(journalEntryFields)},
  teamSections[] {
    title,
    members[]-> {
      name,
      positionEn,
      positionEs
    }
  }
}`;

export type AboutQueryParams = {
  language: Locale;
};

export type { AboutDocument };
