import type { Locale, NavId } from './i18n';

type JournalCategory =
  | 'interview'
  | 'news'
  | 'press'
  | 'event'
  | 'prize'
  | 'recognition'
  | 'publication'
  | 'exhibition'
  | 'initiative';

type UiStrings = {
  nav: Record<NavId, string>;
  sectionTypes: {
    journal: string;
  };
  journalCategories: Record<JournalCategory, string>;
  technicalInfo: {
    title: string;
    location: string;
    use: string;
    year: string;
    collaborators: string;
    photography: string;
  };
  relatedProjects: string;
  noProjects: string;
  aboutEmpty: string;
  backToProjects: string;
  fullProject: string;
  fullJournal: string;
};

export const ui = {
  en: {
    nav: {
      highlights: 'Highlights',
      projects: 'Projects',
      about: 'About',
    },
    sectionTypes: {
      journal: 'Journal',
    },
    journalCategories: {
      interview: 'Interview',
      news: 'News',
      press: 'Press',
      event: 'Event',
      prize: 'Prize',
      recognition: 'Recognition',
      publication: 'Publication',
      exhibition: 'Exhibition',
      initiative: 'Initiative',
    },
    technicalInfo: {
      title: 'Technical Information',
      location: 'Location',
      use: 'Use',
      year: 'Year',
      collaborators: 'Collaborators',
      photography: 'Photography',
    },
    relatedProjects: 'Related Projects',
    noProjects: 'No projects yet. Add some in Sanity Studio.',
    aboutEmpty: 'About page content coming soon.',
    backToProjects: '← All projects',
    fullProject: 'Full Project',
    fullJournal: 'Full entry',
  },
  es: {
    nav: {
      highlights: 'Destacados',
      projects: 'Proyectos',
      about: 'Nosotros',
    },
    sectionTypes: {
      journal: 'Diario',
    },
    journalCategories: {
      interview: 'Entrevista',
      news: 'Noticia',
      press: 'Prensa',
      event: 'Evento',
      prize: 'Premio',
      recognition: 'Reconocimiento',
      publication: 'Publicación',
      exhibition: 'Exposición',
      initiative: 'Iniciativa',
    },
    technicalInfo: {
      title: 'Información Técnica',
      location: 'Localización',
      use: 'Uso',
      year: 'Año',
      collaborators: 'Colaboradores',
      photography: 'Fotografía',
    },
    relatedProjects: 'Proyectos Relacionados',
    noProjects: 'Todavía no hay proyectos. Añade algunos en Sanity Studio.',
    aboutEmpty: 'El contenido de la página Nosotros llegará pronto.',
    backToProjects: '← Todos los proyectos',
    fullProject: 'Proyecto completo',
    fullJournal: 'Entrada completa',
  },
} satisfies Record<Locale, UiStrings>;

export type UiCopy = (typeof ui)[Locale];

export function getUi(locale: Locale): UiCopy {
  return ui[locale];
}

export function getNavLabel(locale: Locale, id: NavId): string {
  return ui[locale].nav[id];
}

export function getJournalCategoryLabel(locale: Locale, category: string): string {
  const labels = ui[locale].journalCategories;

  return labels[category as JournalCategory] ?? category;
}
