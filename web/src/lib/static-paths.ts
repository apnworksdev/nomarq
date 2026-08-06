import { sanity } from './sanity';
import { journalSlugsByCategoriesQuery, projectSlugsQuery } from './queries';
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

export async function getJournalStaticPaths(
  locale: Locale = defaultLocale,
  section: JournalSection,
) {
  const categories = [...JOURNAL_SECTIONS[section].categories];
  const slugs = await sanity.fetch<{ slug: string }[]>(journalSlugsByCategoriesQuery, {
    language: locale,
    defaultLanguage: defaultLocale,
    categories,
  });

  return slugs.map(({ slug }) => ({
    params: { slug },
  }));
}
