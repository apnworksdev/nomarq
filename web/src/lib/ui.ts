import type { Locale, NavId } from './i18n';

type UiStrings = {
  nav: Record<NavId, string>;
  noProjects: string;
  aboutEmpty: string;
  backToProjects: string;
};

export const ui = {
  en: {
    nav: {
      highlights: 'Highlights',
      projects: 'Projects',
      about: 'About',
    },
    noProjects: 'No projects yet. Add some in Sanity Studio.',
    aboutEmpty: 'About page content coming soon.',
    backToProjects: '← All projects',
  },
  es: {
    nav: {
      highlights: 'Destacados',
      projects: 'Proyectos',
      about: 'Nosotros',
    },
    noProjects: 'Todavía no hay proyectos. Añade algunos en Sanity Studio.',
    aboutEmpty: 'El contenido de la página Nosotros llegará pronto.',
    backToProjects: '← Todos los proyectos',
  },
} satisfies Record<Locale, UiStrings>;

export type UiCopy = (typeof ui)[Locale];

export function getUi(locale: Locale): UiCopy {
  return ui[locale];
}

export function getNavLabel(locale: Locale, id: NavId): string {
  return ui[locale].nav[id];
}
