export type { ImageField, Project, ProjectCard } from './shared';

export { projectsQuery, projectBySlugQuery, projectSlugsQuery, relatedProjectsQuery } from './project';

export type { HomeDocument, HomeQueryParams } from './home';
export { homeQuery } from './home';

export type ProjectQueryParams = {
  slug?: string;
  language: import('../i18n').Locale;
};
