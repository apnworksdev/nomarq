import { defineField, defineType } from 'sanity';

import { languageField } from '../fields/language';
import { localizedSlugField } from '../fields/localizedSlug';

export default defineType({
  name: 'project',
  title: 'Project',
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
      name: 'location',
      title: 'Location',
      type: 'location',
    }),
    defineField({
      name: 'use',
      title: 'Use',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'use' }] }],
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
      year: 'year',
      locationPlace: 'location.place',
      locationCountryFull: 'location.country.full',
      locationCountryShort: 'location.country.short',
      media: 'images.0.image',
    },
    prepare({ title, year, locationPlace, locationCountryFull, locationCountryShort, media }) {
      const location =
        locationPlace && locationCountryFull
          ? `${locationPlace} / ${locationCountryFull}`
          : locationPlace || locationCountryFull || locationCountryShort;
      const subtitle = [year, location].filter(Boolean).join(' · ');

      return {
        title,
        subtitle: subtitle || undefined,
        media,
      };
    },
  },
});
