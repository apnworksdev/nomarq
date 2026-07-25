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
  projectsFilters: {
    toggle: string;
    typology: string;
    search: string;
    clear: string;
    results: string;
  };
  footer: {
    foundationTitle: string;
    brandName: string;
    copyright: string;
    legalNav: string;
    legalLinks: Record<string, string>;
  };
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
    projectsFilters: {
      toggle: 'Filter',
      typology: 'Typology',
      search: 'Search...',
      clear: 'Clear',
      results: 'Results',
    },
    footer: {
      foundationTitle: 'fundación.nomarq',
      brandName: 'nomarq',
      copyright: 'All Rights Reserved, nomarq',
      legalNav: 'Legal',
      legalLinks: {
        'privacy-policy': 'Privacy Policy',
        'legal-notice': 'Legal Notice',
        'cookies-policy': 'Cookies Policy',
      },
    },
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
    projectsFilters: {
      toggle: 'Filtrar',
      typology: 'Tipologia',
      search: 'Buscar...',
      clear: 'Limpiar',
      results: 'Resultados',
    },
    footer: {
      foundationTitle: 'fundación.nomarq',
      brandName: 'nomarq',
      copyright: 'Todos los derechos reservados, nomarq',
      legalNav: 'Información legal',
      legalLinks: {
        'privacy-policy': 'Política de privacidad',
        'legal-notice': 'Aviso legal',
        'cookies-policy': 'Política de cookies',
      },
    },
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

export function getFooterLegalLinkLabel(locale: Locale, key: string, fallback: string): string {
  return ui[locale].footer.legalLinks[key] ?? fallback;
}
