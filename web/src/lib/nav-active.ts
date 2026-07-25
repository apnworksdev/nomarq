import {
  getLocaleFromPath,
  getLocalizedPath,
  locales,
  matchNavId,
  navItems,
  stripLocaleFromPath,
  type Locale,
  type NavId,
} from './i18n';
import { getNavLabel, getUi } from './ui';

const allNavItems = [...navItems.left, ...navItems.right];

export function updateNavActiveState(pathname: string) {
  const activeId = matchNavId(pathname);
  const pathWithoutLocale = stripLocaleFromPath(pathname);
  const currentLocale = getLocaleFromPath(pathname);
  const copy = getUi(currentLocale);

  document.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach((link) => {
    const navId = link.dataset.nav as NavId | undefined;
    const item = allNavItems.find((entry) => entry.id === navId);

    if (item) {
      link.href = getLocalizedPath(currentLocale, item.href);
      link.textContent = getNavLabel(currentLocale, navId!);
    }

    link.classList.toggle('active', link.dataset.nav === activeId);
  });

  const logoLink = document.querySelector<HTMLAnchorElement>('[data-header-logo]');

  if (logoLink) {
    logoLink.href = getLocalizedPath(currentLocale, '/');
  }

  const filterLabel = document.querySelector<HTMLElement>('[data-projects-filter-toggle-label]');

  if (filterLabel) {
    filterLabel.textContent = copy.projectsFilters.toggle;
  }

  const nav = document.querySelector<HTMLElement>('.header-nav');

  if (nav) {
    nav.setAttribute('aria-label', currentLocale === 'es' ? 'Principal' : 'Main');
  }

  document.querySelectorAll<HTMLAnchorElement>('[data-locale-switcher]').forEach((link) => {
    const locale = link.dataset.localeSwitcher as Locale | undefined;

    if (!locale || !locales.includes(locale)) {
      return;
    }

    link.href = getLocalizedPath(locale, pathWithoutLocale);
    link.classList.toggle('active', locale === currentLocale);
    link.setAttribute('aria-current', locale === currentLocale ? 'true' : 'false');
  });
}

export function initNavActiveState() {
  const run = () => updateNavActiveState(window.location.pathname);

  run();
  document.addEventListener('astro:page-load', run);
}
