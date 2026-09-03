import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'deeperSection',
  title: 'Deeper section',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      description: 'Section label shown after Acceder (in this document’s language).',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Shown in the overlay while this section is active.',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      validation: (Rule) => Rule.min(1).error('Add at least one image to this section.'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0.image',
      imageCount: 'images',
    },
    prepare({ title, media, imageCount }) {
      const count = Array.isArray(imageCount) ? imageCount.length : 0;
      return {
        title: title || 'Untitled section',
        subtitle: count === 1 ? '1 image' : `${count} images`,
        media,
      };
    },
  },
});
