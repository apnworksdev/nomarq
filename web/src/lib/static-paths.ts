import { sanity } from './sanity';
import { journalSlugsBySectionQuery, projectPrivSlugsQuery, projectSlugsQuery } from './queries';
import { defaultLocale, type Locale } from './i18n';
import { JOURNAL_SECTIONS, type JournalSection } from './journal';

export async function getProjectStaticPaths(locale: Locale = defaultLocale) {
  const slugs = await sanity.fetch<{ slug: string }[]>(projectSlugsQuery, {
    language: locale,
    defaultLanguage: defaultLocale,
  });

  return slugs.map(({ slug }) => ({
    params: { slug },
  }));
}

export async function getProjectPrivStaticPaths(locale: Locale = defaultLocale) {
  const slugs = await sanity.fetch<{ slug: string }[]>(projectPrivSlugsQuery, {
    language: locale,
    defaultLanguage: defaultLocale,
  });

  return slugs.map(({ slug }) => ({
    params: { slug },
  }));
}

export async function getJournalStaticPaths(
  locale: Locale = defaultLocale,
  section: JournalSection,
) {
  const slugs = await sanity.fetch<{ slug: string }[]>(journalSlugsBySectionQuery, {
    language: locale,
    defaultLanguage: defaultLocale,
    section,
    fallbackCategories: [...JOURNAL_SECTIONS[section].categories],
  });

  return slugs.map(({ slug }) => ({
    params: { slug },
  }));
}
