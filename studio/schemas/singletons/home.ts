import { defineField, defineType } from 'sanity';

import { languageField } from '../fields/language';

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  fields: [
    languageField,
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{ type: 'homeSection' }],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Home',
      };
    },
  },
});
