import { defineField, defineType } from 'sanity';

import { englishDocumentReferenceFilter } from '../../lib/referenceFilters';
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
      name: 'shortDescription',
      title: 'Short description',
      description: 'Shown on the home page. Usually the first paragraph of the full description.',
      type: 'text',
      rows: 3,
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
      name: 'relatedProjects',
      title: 'Related projects',
      description:
        'Pick up to 3 related projects. Any empty slots are filled automatically from similar uses and location.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
          options: englishDocumentReferenceFilter,
        },
      ],
      validation: (Rule) => Rule.max(3),
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
