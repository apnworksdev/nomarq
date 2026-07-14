import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      description: 'Optional. Falls back to the entry title on the website.',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      alt: 'alt',
      media: 'image',
    },
    prepare({ alt, media }) {
      return {
        title: alt || 'Image',
        media,
      };
    },
  },
});
