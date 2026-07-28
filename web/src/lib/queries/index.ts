export type { ImageField, Project, ProjectCard } from './shared';

export { projectsQuery, projectBySlugQuery, projectSlugsQuery, relatedProjectsQuery } from './project';

export type { HomeDocument, HomeQueryParams } from './home';
export { homeQuery } from './home';

export type { FooterDocument, FooterQueryParams } from './footer';
export { footerQuery } from './footer';

export type { UseDocument } from './use';
export { usesQuery } from './use';

export type {
  AboutDocument,
  AboutQueryParams,
} from './about';
export { aboutQuery } from './about';

export type { JournalCard, JournalEntry, JournalsQueryParams } from './journal';
export {
  journalBySlugQuery,
  journalSlugsQuery,
  journalsQuery,
  relatedJournalsQuery,
} from './journal';

export type ProjectQueryParams = {
  slug?: string;
  language: import('../i18n').Locale;
};
