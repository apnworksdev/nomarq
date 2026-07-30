const TOGGLE_SELECTOR = '[data-entry-info-toggle]';
const HERO_SELECTOR = '[data-entry-detail]';
const MOBILE_MQ = '(max-width: 820px)';

function isMobileViewport() {
  return window.matchMedia(MOBILE_MQ).matches;
}

function setInfoOpen(hero: HTMLElement, open: boolean) {
  hero.classList.toggle('is-info-open', open);

  const toggle = hero.querySelector<HTMLButtonElement>(TOGGLE_SELECTOR);
  const sign = hero.querySelector<HTMLElement>('[data-entry-info-toggle-sign]');

  if (toggle) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (sign) {
    sign.textContent = open ? '( - )' : '( + )';
  }
}

export function initEntryInfo() {
  const hero = document.querySelector<HTMLElement>(HERO_SELECTOR);

  if (!hero) {
    return () => {};
  }

  const toggle = hero.querySelector<HTMLButtonElement>(TOGGLE_SELECTOR);

  if (!toggle) {
    return () => {};
  }

  const mediaQuery = window.matchMedia(MOBILE_MQ);

  const onToggle = () => {
    if (!isMobileViewport()) {
      return;
    }

    setInfoOpen(hero, !hero.classList.contains('is-info-open'));
  };

  const onViewportChange = () => {
    if (!mediaQuery.matches) {
      setInfoOpen(hero, false);
    }
  };

  toggle.addEventListener('click', onToggle);
  mediaQuery.addEventListener('change', onViewportChange);

  setInfoOpen(hero, false);

  return () => {
    toggle.removeEventListener('click', onToggle);
    mediaQuery.removeEventListener('change', onViewportChange);
  };
}

export function initEntryInfoState() {
  let cleanup: (() => void) | undefined;

  const run = () => {
    cleanup?.();
    cleanup = initEntryInfo();
  };

  run();
  document.addEventListener('astro:page-load', run);
}
