const MENU_OPEN_CLASS = 'mobile-menu-open';
const TOGGLE_SELECTOR = '[data-mobile-menu-toggle]';
const CLOSE_SELECTOR = '[data-mobile-menu-close]';
const MENU_SELECTOR = '[data-mobile-menu]';
const MOBILE_MQ = '(max-width: 820px)';

export function setMobileMenuOpen(open: boolean) {
  document.documentElement.classList.toggle(MENU_OPEN_CLASS, open);

  const toggle = document.querySelector<HTMLButtonElement>(TOGGLE_SELECTOR);

  if (toggle) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  document.body.style.overflow = open ? 'hidden' : '';
}

export function closeMobileMenu() {
  setMobileMenuOpen(false);
}

function isMobileViewport() {
  return window.matchMedia(MOBILE_MQ).matches;
}

export function initMobileMenu() {
  const onClick = (event: MouseEvent) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest(TOGGLE_SELECTOR)) {
      if (!isMobileViewport()) {
        return;
      }

      const open = !document.documentElement.classList.contains(MENU_OPEN_CLASS);
      setMobileMenuOpen(open);
      return;
    }

    if (target.closest(CLOSE_SELECTOR)) {
      closeMobileMenu();
      return;
    }

    if (!document.documentElement.classList.contains(MENU_OPEN_CLASS)) {
      return;
    }

    if (target.closest(`${MENU_SELECTOR} [data-nav]`)) {
      closeMobileMenu();
      return;
    }

    if (target.closest('[data-locale-switcher]')) {
      closeMobileMenu();
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeMobileMenu();
    }
  };

  const mediaQuery = window.matchMedia(MOBILE_MQ);
  const onViewportChange = () => {
    if (!mediaQuery.matches) {
      closeMobileMenu();
    }
  };

  const onPageLoad = () => {
    closeMobileMenu();
  };

  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeyDown);
  mediaQuery.addEventListener('change', onViewportChange);
  document.addEventListener('astro:page-load', onPageLoad);

  onPageLoad();
}
