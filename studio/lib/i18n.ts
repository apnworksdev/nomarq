export const supportedLanguages = [
  { id: 'en', title: 'English' },
  { id: 'es', title: 'Español' },
] as const;

export type SanityLanguage = (typeof supportedLanguages)[number]['id'];

export const defaultLanguage: SanityLanguage = 'en';

/** Document types with one Sanity document per language (linked via translation.metadata). */
export const localizedSchemaTypes = [
  'project',
  'journal',
  'home',
  'about',
  'footer',
] as const;

export type LocalizedSchemaType = (typeof localizedSchemaTypes)[number];

export const isLocalizedSchemaType = (
  schemaType: string,
): schemaType is LocalizedSchemaType =>
  localizedSchemaTypes.includes(schemaType as LocalizedSchemaType);
