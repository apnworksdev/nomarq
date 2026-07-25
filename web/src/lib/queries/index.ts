export type { ImageField, Project, ProjectCard } from './shared';

export { projectsQuery, projectBySlugQuery, projectSlugsQuery, relatedProjectsQuery } from './project';

export type { HomeDocument, HomeQueryParams } from './home';
export { homeQuery } from './home';

export type { FooterDocument, FooterQueryParams } from './footer';
export { footerQuery } from './footer';

export type { UseDocument } from './use';
export { usesQuery } from './use';

export type ProjectQueryParams = {
  slug?: string;
  language: import('../i18n').Locale;
};
