import { defineField } from 'sanity';

import { defaultLanguage } from '../../lib/i18n';

export const languageField = defineField({
  name: 'language',
  title: 'Language',
  type: 'string',
  readOnly: true,
  hidden: true,
  initialValue: defaultLanguage,
});
