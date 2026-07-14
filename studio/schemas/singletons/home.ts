import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  fields: [
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
