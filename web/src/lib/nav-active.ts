import {
  getLocaleFromPath,
  getLocalizedPath,
  locales,
  matchNavId,
  stripLocaleFromPath,
  type Locale,
} from './i18n';

export function updateNavActiveState(pathname: string) {
  const activeId = matchNavId(pathname);
  const pathWithoutLocale = stripLocaleFromPath(pathname);
  const currentLocale = getLocaleFromPath(pathname);

  document.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === activeId);
  });

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
