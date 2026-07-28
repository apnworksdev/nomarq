export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

/** Keep in sync with `studio/lib/i18n.ts`. */
export const defaultLocale: Locale = 'en';

export type NavId = 'highlights' | 'projects' | 'about';

export type NavItem = {
  id: NavId;
  href: `/${string}` | '/';
};

export const navItems = {
  left: [
    { id: 'highlights', href: '/' },
    { id: 'projects', href: '/projects' },
  ] satisfies NavItem[],
  right: [{ id: 'about', href: '/about' }] satisfies NavItem[],
};

/** Strip locale prefix so `/es/projects` and `/projects` both become `/projects`. */
export function stripLocaleFromPath(pathname: string): string {
  for (const locale of locales) {
    if (locale === defaultLocale) {
      continue;
    }

    const prefix = `/${locale}`;

    if (pathname === prefix) {
      return '/';
    }

    if (pathname.startsWith(`${prefix}/`)) {
      const stripped = pathname.slice(prefix.length);
      return stripped || '/';
    }
  }

  return pathname || '/';
}

/** Normalize `/projects/` → `/projects` for route checks. */
export function normalizePath(pathname: string): string {
  const path = stripLocaleFromPath(pathname);

  if (path === '/') {
    return '/';
  }

  return path.replace(/\/+$/, '') || '/';
}

export function isProjectsIndexPath(pathname: string): boolean {
  return normalizePath(pathname) === '/projects';
}

export function isAboutJournalPath(pathname: string): boolean {
  return normalizePath(pathname) === '/about/journal';
}

export function isProjectDetailPath(pathname: string): boolean {
  const path = normalizePath(pathname);

  return path.startsWith('/projects/') && path !== '/projects';
}

export function isJournalDetailPath(pathname: string): boolean {
  const path = normalizePath(pathname);

  return path.startsWith('/about/journal/') && path !== '/about/journal';
}

export function isEntryDetailPath(pathname: string): boolean {
  return isProjectDetailPath(pathname) || isJournalDetailPath(pathname);
}

/** Build a locale-aware path. Mirrors Astro i18n with `prefixDefaultLocale: false`. */
export function getLocalizedPath(locale: Locale, path: string): string {
  const normalized = path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`;

  if (locale === defaultLocale) {
    return normalized;
  }

  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}

export function getLocaleFromPath(pathname: string): Locale {
  for (const locale of locales) {
    if (locale === defaultLocale) {
      continue;
    }

    const prefix = `/${locale}`;

    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return locale;
    }
  }

  return defaultLocale;
}

export function matchNavId(pathname: string): NavId | null {
  const path = stripLocaleFromPath(pathname);

  if (path === '/') {
    return 'highlights';
  }

  if (path === '/projects' || path.startsWith('/projects/')) {
    return 'projects';
  }

  if (path === '/about' || path.startsWith('/about/')) {
    return 'about';
  }

  return null;
}
