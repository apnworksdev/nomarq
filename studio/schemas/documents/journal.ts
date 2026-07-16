import { defineField, defineType } from 'sanity';

import { languageField } from '../fields/language';
import { localizedSlugField } from '../fields/localizedSlug';

const journalCategories = [
  { title: 'Interview', value: 'interview' },
  { title: 'News', value: 'news' },
  { title: 'Press', value: 'press' },
  { title: 'Event', value: 'event' },
  { title: 'Prize', value: 'prize' },
  { title: 'Recognition', value: 'recognition' },
  { title: 'Publication', value: 'publication' },
  { title: 'Exhibition', value: 'exhibition' },
  { title: 'Initiative', value: 'initiative' },
] as const;

export default defineType({
  name: 'journal',
  title: 'Journal',
  type: 'document',
  fields: [
    languageField,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    localizedSlugField(),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [...journalCategories],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      description: 'e.g. 2021 or April 2026',
      type: 'string',
    }),
    defineField({
      name: 'collaborators',
      title: 'Collaborators',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'photography',
      title: 'Photography',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      description: 'Shown on the home page. Usually the first paragraph of the full description.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'externalLink',
      title: 'External link',
      description: 'Optional. If set, the frontend can link out instead of the journal page.',
      type: 'url',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      description: 'The first image is used for grids and home sections.',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      validation: (Rule) => Rule.max(6),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      year: 'year',
      media: 'images.0.image',
    },
    prepare({ title, category, year, media }) {
      const subtitle = [category, year].filter(Boolean).join(' · ');

      return {
        title,
        subtitle: subtitle || undefined,
        media,
      };
    },
  },
});
