import { defaultLanguage } from './i18n';

/** Limit reference pickers to the canonical English documents in Studio. */
export const englishDocumentReferenceFilter = {
  filter: '!defined(language) || language == $language',
  filterParams: { language: defaultLanguage },
} as const;
