import { sanity } from './sanity';
import { projectSlugsQuery } from './queries';
import { defaultLocale, type Locale } from './i18n';

export async function getProjectStaticPaths(locale: Locale = defaultLocale) {
  const slugs = await sanity.fetch<{ slug: string }[]>(projectSlugsQuery, {
    language: locale,
  });

  return slugs.map(({ slug }) => ({
    params: { slug },
  }));
}
