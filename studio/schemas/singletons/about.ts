import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  groups: [
    { name: 'video', title: 'Video', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'imageSwiper', title: 'Image swiper' },
    { name: 'lists', title: 'Lists' },
    { name: 'team', title: 'Team' },
  ],
  fields: [
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      description: 'YouTube or Vimeo URL',
      type: 'url',
      group: 'video',
    }),
    defineField({
      name: 'contactImage',
      title: 'Contact image',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'contact',
    }),
    defineField({
      name: 'studioDescription',
      title: 'Studio description',
      type: 'text',
      rows: 5,
      group: 'contact',
    }),
    defineField({
      name: 'direction',
      title: 'Address',
      type: 'text',
      rows: 2,
      group: 'contact',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
      group: 'contact',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'imageSwiper',
      title: 'Images',
      description: 'Slides for the about page image swiper, in display order.',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      group: 'imageSwiper',
    }),
    defineField({
      name: 'recognitions',
      title: 'Recognitions',
      description: 'Prizes, awards, publications, and exhibitions',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'journal' }],
          options: {
            filter: 'category in ["prize", "recognition", "publication", "exhibition"]',
          },
        },
      ],
      group: 'lists',
    }),
    defineField({
      name: 'initiatives',
      title: 'Initiatives',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'journal' }],
          options: {
            filter: 'category == "initiative"',
          },
        },
      ],
      group: 'lists',
    }),
    defineField({
      name: 'teamSections',
      title: 'Team',
      description: 'Create areas and add people in the order they should appear.',
      type: 'array',
      of: [{ type: 'teamSection' }],
      group: 'team',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About',
      };
    },
  },
});
