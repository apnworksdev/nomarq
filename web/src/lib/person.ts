import type { Locale } from './i18n';

export type LocalizedPerson = {
  name: string;
  positionEn: string;
  positionEs: string;
};

export function getPersonPosition(person: LocalizedPerson, locale: Locale): string {
  return locale === 'es' ? person.positionEs : person.positionEn;
}
