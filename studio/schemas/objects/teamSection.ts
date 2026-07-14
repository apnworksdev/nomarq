import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'teamSection',
  title: 'Area',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Area',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'members',
      title: 'People',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'person' }] }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      members: 'members',
    },
    prepare({ title, members }) {
      const count = members?.length ?? 0;

      return {
        title,
        subtitle: `${count} ${count === 1 ? 'person' : 'people'}`,
      };
    },
  },
});
