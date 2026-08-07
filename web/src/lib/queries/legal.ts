import type { Locale } from '../i18n';
import type { LegalPageDocument, LegalPageId } from '../legal';

export function legalPageQuery(documentId: LegalPageId) {
  return `coalesce(
  *[_type == "translation.metadata" && references("${documentId}")][0].translations[language == $language][0].value->,
  *[_id == "${documentId}"][0]
) {
  body
}`;
}

export type LegalPageQueryParams = {
  language: Locale;
};

export type { LegalPageDocument };
