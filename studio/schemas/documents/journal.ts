import { defineField, defineType } from 'sanity';

import { englishDocumentReferenceFilter } from '../../lib/referenceFilters';
import { languageField } from '../fields/language';
import { localizedSlugField } from '../fields/localizedSlug';

/** Recognition: prize, press, conferences. Initiatives: editorial, exhibition, events. */
const journalCategories = [
  { title: 'Prize', value: 'prize' },
  { title: 'Press', value: 'press' },
  { title: 'Conferences', value: 'conferences' },
  { title: 'Editorial', value: 'editorial' },
  { title: 'Exhibition', value: 'exhibition' },
  { title: 'Events', value: 'events' },
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
      description:
        'Prize, press, and conferences appear under Recognition. Editorial, exhibition, and events appear under Initiatives.',
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
      description:
        'The first image is used for grids and home sections. Detail pages show up to 6 thumbnails at a time; clicking one brings it to the front.',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
    }),
    defineField({
      name: 'relatedJournals',
      title: 'Related journal entries',
      description:
        'Pick up to 3 related entries. Any empty slots are filled automatically from the same category.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'journal' }],
          options: englishDocumentReferenceFilter,
        },
      ],
      validation: (Rule) => Rule.max(3),
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
