import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'use',
  title: 'Use',
  type: 'document',
  fields: [
    defineField({
      name: 'titleEn',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleEs',
      title: 'Title (Spanish)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Shared across languages — used for filters and URLs.',
      type: 'slug',
      options: {
        source: 'titleEn',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      titleEn: 'titleEn',
      titleEs: 'titleEs',
    },
    prepare({ titleEn, titleEs }) {
      return {
        title: titleEn,
        subtitle: titleEs,
      };
    },
  },
});
