import type { Locale, NavId } from './i18n';
import type { JournalCategory } from './journal';

type UiStrings = {
  nav: Record<NavId, string>;
  sectionTypes: {
    journal: string;
  };
  journalCategories: Record<JournalCategory, string>;
  technicalInfo: {
    title: string;
    category: string;
    location: string;
    use: string;
    year: string;
    collaborators: string;
    photography: string;
  };
  relatedProjects: string;
  relatedJournals: string;
  menu: string;
  close: string;
  information: string;
  noProjects: string;
  aboutEmpty: string;
  journalEmpty: string;
  about: {
    contactInformation: string;
    contactForm: string;
    recognitions: string;
    initiatives: string;
    all: string;
    form: {
      name: string;
      phone: string;
      lastNames: string;
      email: string;
      website: string;
      subject: string;
      message: string;
      privacy: string;
      privacyLink: string;
      submit: string;
    };
  };
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
  projectsView: {
    grid: string;
    list: string;
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
      prize: 'Prize',
      press: 'Press',
      conferences: 'Conferences',
      editorial: 'Editorial',
      exhibition: 'Exhibition',
      events: 'Events',
    },
    technicalInfo: {
      title: 'Technical Information',
      category: 'Category',
      location: 'Location',
      use: 'Use',
      year: 'Year',
      collaborators: 'Collaborators',
      photography: 'Photography',
    },
    relatedProjects: 'Related Projects',
    relatedJournals: 'Related Journal',
    menu: 'Menu',
    close: 'Close',
    information: 'Information',
    noProjects: 'No projects yet. Add some in Sanity Studio.',
    aboutEmpty: 'About page content coming soon.',
    journalEmpty: 'No entries yet. Add some in Sanity Studio.',
    about: {
      contactInformation: 'Contact Information',
      contactForm: 'Contact Form',
      recognitions: 'Recognition',
      initiatives: 'Initiatives',
      all: 'All',
      form: {
        name: 'Name',
        phone: 'Phone',
        lastNames: 'Last Names',
        email: 'Email',
        website: 'Website',
        subject: 'Subject',
        message: 'Message',
        privacy: 'I have read and accept the',
        privacyLink: 'privacy policy',
        submit: 'Submit',
      },
    },
    backToProjects: '← All projects',
    fullProject: 'Full Project',
    fullJournal: 'Full entry',
    projectsFilters: {
      toggle: 'Filters',
      typology: 'Typology',
      search: 'Search...',
      clear: 'Clear',
      results: 'Results',
    },
    projectsView: {
      grid: 'Grid',
      list: 'List',
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
      journal: 'Actualidad',
    },
    journalCategories: {
      prize: 'Premio',
      press: 'Prensa',
      conferences: 'Conferencias',
      editorial: 'Editorial',
      exhibition: 'Exposición',
      events: 'Eventos',
    },
    technicalInfo: {
      title: 'Información Técnica',
      category: 'Categoría',
      location: 'Localización',
      use: 'Uso',
      year: 'Año',
      collaborators: 'Colaboradores',
      photography: 'Fotografía',
    },
    relatedProjects: 'Proyectos Relacionados',
    relatedJournals: 'Actualidad Relacionada',
    menu: 'Menu',
    close: 'Cerrar',
    information: 'Información',
    noProjects: 'Todavía no hay proyectos. Añade algunos en Sanity Studio.',
    aboutEmpty: 'El contenido de la página Nosotros llegará pronto.',
    journalEmpty: 'Todavía no hay entradas. Añade algunas en Sanity Studio.',
    about: {
      contactInformation: 'Información de contacto',
      contactForm: 'Formulario de contacto',
      recognitions: 'Reconocimientos',
      initiatives: 'Iniciativas',
      all: 'Todos',
      form: {
        name: 'Nombre',
        phone: 'Teléfono',
        lastNames: 'Apellidos',
        email: 'Email',
        website: 'Web',
        subject: 'Asunto',
        message: 'Mensaje',
        privacy: 'He leído y acepto la',
        privacyLink: 'política de privacidad',
        submit: 'Enviar',
      },
    },
    backToProjects: '← Todos los proyectos',
    fullProject: 'Proyecto completo',
    fullJournal: 'Entrada completa',
    projectsFilters: {
      toggle: 'Filtros',
      typology: 'Tipología',
      search: 'Buscar...',
      clear: 'Limpiar',
      results: 'Resultados',
    },
    projectsView: {
      grid: 'Grid',
      list: 'List',
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
