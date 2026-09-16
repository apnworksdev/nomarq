import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'journalCategory',
  title: 'Expanded Practice Category',
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
      description: 'Shared across languages — used for filters.',
      type: 'slug',
      options: {
        source: 'titleEn',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'section',
      title: 'Section',
      description:
        'Recognition appears under About → Recognition. Initiatives under About → Initiatives.',
      type: 'string',
      options: {
        list: [
          { title: 'Recognition', value: 'recognition' },
          { title: 'Initiatives', value: 'initiatives' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      titleEn: 'titleEn',
      titleEs: 'titleEs',
      section: 'section',
    },
    prepare({ titleEn, titleEs, section }) {
      const sectionLabel = section === 'initiatives' ? 'Initiatives' : 'Recognition';

      return {
        title: titleEn,
        subtitle: [titleEs, sectionLabel].filter(Boolean).join(' · '),
      };
    },
  },
});
