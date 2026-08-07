import { defineField, type SlugIsUniqueValidator } from 'sanity';

import { defaultLanguage } from '../../lib/i18n';

const isUniquePerLanguage: SlugIsUniqueValidator = async (slug, context) => {
  if (!slug) {
    return true;
  }

  const { document, getClient } = context;
  const client = getClient({ apiVersion: '2024-01-01' });
  const id = document._id.replace(/^drafts\./, '');
  const language = (document?.language as string | undefined) ?? defaultLanguage;

  const query = `!defined(*[
    _type == $type &&
    slug.current == $slug &&
    coalesce(language, $defaultLanguage) == $language &&
    !(_id in [$draft, $published])
  ][0]._id)`;

  return client.fetch<boolean>(query, {
    type: document._type,
    slug,
    language,
    defaultLanguage,
    draft: `drafts.${id}`,
    published: id,
  });
};

type LocalizedSlugFieldOptions = {
  source?: string;
  maxLength?: number;
  group?: string;
};

export const localizedSlugField = (options: LocalizedSlugFieldOptions = {}) =>
  defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    description:
      'URL slug for this language. It can match the other language version (e.g. casa-laspre in both EN and ES).',
    options: {
      source: options.source ?? 'title',
      maxLength: options.maxLength ?? 96,
      isUnique: isUniquePerLanguage,
    },
    validation: (Rule) => Rule.required(),
    group: options.group,
  });
