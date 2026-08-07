import { defineField, defineType } from 'sanity';

import { languageField } from '../fields/language';

export function createLegalPageType(name: string, title: string) {
  return defineType({
    name,
    title,
    type: 'document',
    fields: [
      languageField,
      defineField({
        name: 'body',
        title: 'Body',
        description: 'Page content. Put headings inside the text — there is no separate title on the site.',
        type: 'blockContent',
      }),
    ],
    preview: {
      prepare() {
        return { title };
      },
    },
  });
}

export const privacyPolicy = createLegalPageType('privacyPolicy', 'Privacy Policy');
export const legalNotice = createLegalPageType('legalNotice', 'Legal Notice');
export const cookiesPolicy = createLegalPageType('cookiesPolicy', 'Cookies Policy');
