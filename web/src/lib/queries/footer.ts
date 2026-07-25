import type { Locale } from '../i18n';
import type { FooterDocument } from '../footer';

export const footerQuery = `coalesce(
  *[_type == "translation.metadata" && references("footer")][0].translations[language == $language][0].value->,
  *[_id == "footer"][0]
) {
  phone,
  email,
  address,
  legalLinks[] {
    _key,
    label,
    href
  },
  socialLinks[] {
    _key,
    label,
    href
  }
}`;

export type FooterQueryParams = {
  language: Locale;
};

export type { FooterDocument };
