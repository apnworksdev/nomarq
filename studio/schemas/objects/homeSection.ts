import { defineField, defineType } from 'sanity';

type HomeSectionParent = {
  sectionType?: 'project' | 'journal';
  layout?: 'vertical' | 'horizontal';
};

const startingColumnOptions = (parent?: HomeSectionParent) => {
  if (parent?.sectionType === 'journal') {
    return [1, 2];
  }

  if (parent?.sectionType === 'project' && parent.layout === 'vertical') {
    return [1, 2, 3, 4, 5];
  }

  if (parent?.sectionType === 'project' && parent.layout === 'horizontal') {
    return [1, 2, 3];
  }

  return [];
};

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
      type: 'number',
      options: {
        list: ({ parent }) =>
          startingColumnOptions(parent as HomeSectionParent).map((value) => ({
            title: String(value),
            value,
          })),
        layout: 'radio',
      },
      hidden: ({ parent }) => startingColumnOptions(parent as HomeSectionParent).length === 0,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as HomeSectionParent;
          const allowed = startingColumnOptions(parent);

          if (allowed.length === 0) {
            return true;
          }

          if (value == null) {
            return 'Required';
          }

          if (!allowed.includes(value)) {
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
      hidden: ({ parent }) => parent?.sectionType !== 'project',
    }),
    defineField({
      name: 'journal',
      title: 'Journal',
      type: 'reference',
      to: [{ type: 'journal' }],
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

      return true;
    }),
  preview: {
    select: {
      sectionType: 'sectionType',
      layout: 'layout',
      startingColumn: 'startingColumn',
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
      projectTitle,
      journalTitle,
      journalCategory,
      projectMedia,
      journalMedia,
    }) {
      const isProject = sectionType === 'project';
      const layoutLabel = isProject && layout ? ` · ${layout}` : '';
      const columnLabel =
        startingColumn != null ? ` · column ${startingColumn}` : '';

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
