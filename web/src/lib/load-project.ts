import type { Locale } from './i18n';
import { defaultLocale } from './i18n';
import { projectBySlugQuery, type DeeperSection, type Project } from './queries';
import { sanity } from './sanity';

export async function fetchProjectBySlug(slug: string, locale: Locale) {
  return sanity.fetch<Project | null>(projectBySlugQuery, {
    slug,
    language: locale,
    defaultLanguage: defaultLocale,
  });
}

export function preparedDeeperSections(project: Project): DeeperSection[] {
  return (project.deeperSections ?? [])
    .map((section) => ({
      name: section.name?.trim() ?? '',
      description: section.description?.trim() ?? '',
      images: (section.images ?? []).filter((image) => image.image),
    }))
    .filter((section) => section.name && section.images.length > 0);
}
