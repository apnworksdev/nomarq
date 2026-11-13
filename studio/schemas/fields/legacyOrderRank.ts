import { defineField } from 'sanity';

/**
 * Some singleton documents picked up `orderRank` from the orderable-document-list
 * plugin. Keep the field in schema (hidden) so Studio no longer shows
 * "Unknown field found".
 */
export const legacyOrderRankField = defineField({
  name: 'orderRank',
  type: 'string',
  hidden: true,
});
