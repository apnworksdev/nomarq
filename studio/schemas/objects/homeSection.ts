import { defineField, defineType } from 'sanity';

import { StartingColumnInput } from '../../components/StartingColumnInput';
import { englishDocumentReferenceFilter } from '../../lib/referenceFilters';
import {
  normalizeStartingColumn,
  resolveStartingColumn,
  startingColumnValues,
  type HomeSectionParent,
} from '../../lib/startingColumn';

export default defineType({
  name: 'homeSection',
  title: 'Home section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionType',
      title: 'Section type',
      type: 'string',
      options: {
        list: [
          { title: 'Project', value: 'project' },
          { title: 'Journal', value: 'journal' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Vertical', value: 'vertical' },
          { title: 'Horizontal', value: 'horizontal' },
        ],
        layout: 'radio',
      },
      hidden: ({ parent }) => parent?.sectionType !== 'project',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as HomeSectionParent;

          if (parent?.sectionType === 'project' && !value) {
            return 'Layout is required';
          }

          return true;
        }),
    }),
    defineField({
      name: 'startingColumn',
      title: 'Starting column',
      type: 'string',
      components: {
        input: StartingColumnInput,
      },
      options: {
        layout: 'radio',
      },
      hidden: ({ parent }) => startingColumnValues(parent as HomeSectionParent).length === 0,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as HomeSectionParent;
          const allowed = startingColumnValues(parent);

          if (allowed.length === 0) {
            return true;
          }

          const normalized = normalizeStartingColumn(value);

          if (!normalized) {
            return 'Required';
          }

          if (!allowed.includes(normalized)) {
            return 'Choose a valid starting column for this section';
          }

          return true;
        }),
    }),
    defineField({
      name: 'project',
      title: 'Project',
      type: 'reference',
      to: [{ type: 'project' }],
      options: englishDocumentReferenceFilter,
      hidden: ({ parent }) => parent?.sectionType !== 'project',
    }),
    defineField({
      name: 'journal',
      title: 'Journal',
      type: 'reference',
      to: [{ type: 'journal' }],
      options: englishDocumentReferenceFilter,
      hidden: ({ parent }) => parent?.sectionType !== 'journal',
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value) => {
      if (!value?.sectionType) {
        return true;
      }

      if (value.sectionType === 'project' && !value.project) {
        return 'Project is required';
      }

      if (value.sectionType === 'journal' && !value.journal) {
        return 'Journal entry is required';
      }

      const startingColumn = resolveStartingColumn(value);
      const allowed = startingColumnValues(value);

      if (allowed.length > 0 && !startingColumn) {
        return 'Starting column is required';
      }

      if (startingColumn && allowed.length > 0 && !allowed.includes(startingColumn)) {
        return 'Starting column does not match the current section type or layout';
      }

      return true;
    }),
  preview: {
    select: {
      sectionType: 'sectionType',
      layout: 'layout',
      startingColumn: 'startingColumn',
      verticalCount: 'verticalCount',
      horizontalCount: 'horizontalCount',
      journalCount: 'journalCount',
      projectTitle: 'project.title',
      journalTitle: 'journal.title',
      journalCategory: 'journal.category',
      projectMedia: 'project.images.0.image',
      journalMedia: 'journal.images.0.image',
    },
    prepare({
      sectionType,
      layout,
      startingColumn,
      verticalCount,
      horizontalCount,
      journalCount,
      projectTitle,
      journalTitle,
      journalCategory,
      projectMedia,
      journalMedia,
    }) {
      const isProject = sectionType === 'project';
      const layoutLabel = isProject && layout ? ` · ${layout}` : '';
      const column =
        resolveStartingColumn({
          sectionType,
          layout,
          startingColumn,
          verticalCount,
          horizontalCount,
          journalCount,
        }) ?? null;
      const columnLabel = column != null ? ` · column ${column}` : '';

      return {
        title: isProject ? projectTitle : journalTitle,
        subtitle: isProject
          ? `Project${layoutLabel}${columnLabel}`
          : `${journalCategory ?? 'Journal'}${columnLabel}`,
        media: isProject ? projectMedia : journalMedia,
      };
    },
  },
});
