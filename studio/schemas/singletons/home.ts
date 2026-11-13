import { defineField, defineType } from 'sanity';

import { languageField } from '../fields/language';
import { legacyOrderRankField } from '../fields/legacyOrderRank';

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  fields: [
    languageField,
    legacyOrderRankField,
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
