import type { Locale, NavId } from './i18n';
import type { JournalCategory } from './journal';
import type { LeadProfileId, OriginId, RoleId, SectorId, SocialId } from './lead-profile';

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
  lead: {
    profile: string;
    profileOther: string;
    name: string;
    lastNames: string;
    email: string;
    emailInvalid: string;
    phonePrefix: string;
    phoneNumber: string;
    phoneInvalid: string;
    city: string;
    placeInvalid: string;
    organization: string;
    role: string;
    roleOther: string;
    sector: string;
    origin: string;
    originSocial: string;
    originOther: string;
    profiles: Record<LeadProfileId, string>;
    roles: Record<RoleId, string>;
    sectors: Record<SectorId, string>;
    sectorNotes: Record<SectorId, string>;
    origins: Record<OriginId, string>;
    socials: Record<SocialId, string>;
  };
  deeper: {
    moreInformation: string;
    name: string;
    profile: string;
    phone: string;
    location: string;
    email: string;
    access: string;
    requestFiles: string;
    requestSent: string;
  };
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
      sent: string;
    };
  };
  backToProjects: string;
  fullProject: string;
  fullJournal: string;
  visitSite: string;
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
      journal: 'Expanded Practice',
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
    relatedJournals: 'Related Expanded Practice',
    menu: 'Menu',
    close: 'Close',
    information: 'Information',
    lead: {
      profile: 'Profile',
      profileOther: 'Specify',
      name: 'Name',
      lastNames: 'Last names',
      email: 'Email',
      emailInvalid: 'Enter a valid email.',
      phonePrefix: 'Prefix',
      phoneNumber: 'Number',
      phoneInvalid: 'Enter the prefix and number.',
      city: 'City (+ country)',
      placeInvalid: 'Choose a city from the list.',
      organization: 'Company / Entity',
      role: 'Role',
      roleOther: 'Specify role',
      sector: 'Sector',
      origin: 'How did you find us?',
      originSocial: 'Social network',
      originOther: 'Specify',
      profiles: {
        student: 'Student',
        editor: 'Editor or communicator',
        promoter: 'Developer',
        investor: 'Investor',
        client: 'Nomarq client',
        ambassador: 'Nomarq ambassador',
        collaborator: 'Collaborator',
        other: 'Other',
      },
      roles: {
        founder: 'Founder',
        director: 'Director',
        technical: 'Technician',
        other: 'Other',
      },
      sectors: {
        building: 'Building',
        financial: 'Financiero',
        hospitality: 'Hotelero y wellness',
        creative: 'Creativo & Cultura',
        consulting: 'Consultores',
      },
      sectorNotes: {
        building: 'Developers, builders, landowners and real-estate owners, real estate',
        financial: 'Family offices, funds and investors',
        hospitality: '',
        creative: 'Architects, interior designers, art creatives and suppliers',
        consulting: 'Lawyers, engineers, project managers, advisors',
      },
      origins: {
        members: 'Nomarq members',
        ambassadors: 'Nomarq ambassadors',
        social: 'Social media',
        search: 'Google / search engines',
        website: 'Website',
        other: 'Other',
      },
      socials: {
        instagram: 'Instagram',
        linkedin: 'LinkedIn',
        youtube: 'YouTube',
        vimeo: 'Vimeo',
      },
    },
    deeper: {
      moreInformation: 'More Information',
      name: 'Name',
      profile: 'Profile',
      phone: 'Phone',
      location: 'Location',
      email: 'Email',
      access: 'Access',
      requestFiles: 'Request files',
      requestSent: 'Your request has been sent successfully',
    },
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
        sent: 'Your request has been sent successfully',
      },
    },
    backToProjects: '← All projects',
    fullProject: 'Full Project',
    fullJournal: 'Full entry',
    visitSite: 'Visit site',
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
      journal: 'Práctica expandida',
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
    relatedJournals: 'Práctica expandida relacionada',
    menu: 'Menu',
    close: 'Cerrar',
    information: 'Información',
    lead: {
      profile: 'Perfil',
      profileOther: 'Especificar',
      name: 'Nombre',
      lastNames: 'Apellidos',
      email: 'Email',
      emailInvalid: 'Introduce un email válido.',
      phonePrefix: 'Prefijo',
      phoneNumber: 'Número',
      phoneInvalid: 'Introduce el prefijo y el número.',
      city: 'Ciudad (+ país)',
      placeInvalid: 'Elige una ciudad de la lista.',
      organization: 'Empresa / Entidad',
      role: 'Cargo',
      roleOther: 'Especificar cargo',
      sector: 'Sector',
      origin: '¿Cómo nos has conocido?',
      originSocial: 'Red social',
      originOther: 'Especificar',
      profiles: {
        student: 'Estudiante',
        editor: 'Editor o divulgador',
        promoter: 'Promotor',
        investor: 'Inversor',
        client: 'Cliente nomarq',
        ambassador: 'Embajador nomarq',
        collaborator: 'Colaborador',
        other: 'Otro',
      },
      roles: {
        founder: 'Fundador',
        director: 'Director',
        technical: 'Técnico',
        other: 'Otro',
      },
      sectors: {
        building: 'Building',
        financial: 'Financiero',
        hospitality: 'Hotelero y wellness',
        creative: 'Creativo & Cultura',
        consulting: 'Consultores',
      },
      sectorNotes: {
        building: 'Promotores, constructores, propietarios de suelo y activos inmobiliarios, inmobiliaria',
        financial: 'Family offices, fondos e inversores',
        hospitality: '',
        creative: 'Arquitectos, interioristas, creativos de arte y proveedores',
        consulting: 'Abogados, ingenierías, project managers, asesores',
      },
      origins: {
        members: 'Miembros nomarq',
        ambassadors: 'Embajadores nomarq',
        social: 'Redes sociales',
        search: 'Google / Buscadores',
        website: 'Página web',
        other: 'Otro',
      },
      socials: {
        instagram: 'Instagram',
        linkedin: 'LinkedIn',
        youtube: 'YouTube',
        vimeo: 'Vimeo',
      },
    },
    deeper: {
      moreInformation: 'Más Información',
      name: 'Nombre',
      profile: 'Perfil',
      phone: 'Teléfono',
      location: 'Ubicación',
      email: 'Email',
      access: 'Acceder',
      requestFiles: 'Solicitar archivos',
      requestSent: 'Tu petición ha sido enviada correctamente',
    },
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
        sent: 'Tu petición ha sido enviada correctamente',
      },
    },
    backToProjects: '← Todos los proyectos',
    fullProject: 'Proyecto completo',
    fullJournal: 'Entrada completa',
    visitSite: 'Ir al sitio',
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
