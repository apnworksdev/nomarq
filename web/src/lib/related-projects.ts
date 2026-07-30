import type { Locale } from './i18n';
import { defaultLocale } from './i18n';
import { relatedProjectsQuery, type ProjectCard } from './queries';
import { sanity } from './sanity';

export const RELATED_PROJECT_COUNT = 3;

export type RelatedProjectInput = {
  slug: string;
  relatedProjects?: ProjectCard[];
  useRefIds?: string[];
  location?: {
    place?: string;
    country?: { full?: string };
  };
};

function resolveProjectCard(project: ProjectCard): ProjectCard | null {
  const resolved = project.translated ?? project;

  if (!resolved.slug) {
    return null;
  }

  return {
    title: resolved.title,
    slug: resolved.slug,
    location: resolved.location,
    coverImage: resolved.coverImage,
  };
}

function uniqueProjects(projects: ProjectCard[], excludeSlugs: Set<string>): ProjectCard[] {
  const seen = new Set<string>();
  const result: ProjectCard[] = [];

  for (const project of projects) {
    const resolved = resolveProjectCard(project);
    if (!resolved || excludeSlugs.has(resolved.slug) || seen.has(resolved.slug)) {
      continue;
    }

    seen.add(resolved.slug);
    result.push(resolved);
  }

  return result;
}

export async function getRelatedProjects(
  project: RelatedProjectInput,
  locale: Locale,
): Promise<ProjectCard[]> {
  const excludeSlugs = new Set<string>([project.slug]);
  const manual = uniqueProjects(project.relatedProjects ?? [], excludeSlugs).slice(
    0,
    RELATED_PROJECT_COUNT,
  );

  if (manual.length >= RELATED_PROJECT_COUNT) {
    return manual;
  }

  manual.forEach((item) => excludeSlugs.add(item.slug));

  const automatic = await sanity.fetch<ProjectCard[]>(relatedProjectsQuery, {
    language: locale,
    defaultLanguage: defaultLocale,
    slug: project.slug,
    excludeSlugs: [...excludeSlugs],
    useIds: project.useRefIds ?? [],
    countryFull: project.location?.country?.full ?? '',
    place: project.location?.place ?? '',
    limit: RELATED_PROJECT_COUNT - manual.length,
  });

  const related = [...manual];

  for (const item of automatic) {
    if (related.length >= RELATED_PROJECT_COUNT) {
      break;
    }

    if (!excludeSlugs.has(item.slug)) {
      related.push(item);
      excludeSlugs.add(item.slug);
    }
  }

  return related.slice(0, RELATED_PROJECT_COUNT);
}
