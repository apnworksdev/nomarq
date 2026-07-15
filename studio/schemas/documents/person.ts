import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'positionEn',
      title: 'Position (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'positionEs',
      title: 'Position (Spanish)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      positionEn: 'positionEn',
      positionEs: 'positionEs',
    },
    prepare({ title, positionEn, positionEs }) {
      return {
        title,
        subtitle: positionEs ? `${positionEn} / ${positionEs}` : positionEn,
      };
    },
  },
});
