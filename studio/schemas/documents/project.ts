import { defineField, defineType } from 'sanity';

import { englishDocumentReferenceFilter } from '../../lib/referenceFilters';
import { languageField } from '../fields/language';
import { localizedSlugField } from '../fields/localizedSlug';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'main', title: 'Main', default: true },
    { name: 'deeper', title: 'Deeper Level' },
  ],
  fields: [
    languageField,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    localizedSlugField({ group: 'main' }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'location',
      group: 'main',
    }),
    defineField({
      name: 'use',
      title: 'Use',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'use' }] }],
      group: 'main',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      description: 'e.g. 2021 or April 2026',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'collaborators',
      title: 'Collaborators',
      type: 'text',
      rows: 3,
      group: 'main',
    }),
    defineField({
      name: 'photography',
      title: 'Photography',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      group: 'main',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      description: 'Shown on the home page. Usually the first paragraph of the full description.',
      type: 'text',
      rows: 3,
      group: 'main',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      description:
        'The first image is used for grids and home sections. Detail pages show up to 6 thumbnails at a time; clicking one brings it to the front.',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      group: 'main',
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
      group: 'main',
    }),
    defineField({
      name: 'deeperDescription',
      title: 'Description',
      description: 'Shown on the priv page. If empty, the public description is used.',
      type: 'text',
      rows: 5,
      group: 'deeper',
    }),
    defineField({
      name: 'deeperSections',
      title: 'Deeper sections',
      description:
        'Sections and images for the priv page (/projects/[slug]/priv). The access form on the public project page links here.',
      type: 'array',
      of: [{ type: 'deeperSection' }],
      group: 'deeper',
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
