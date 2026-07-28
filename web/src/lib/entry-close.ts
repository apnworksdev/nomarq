import {
  getLocaleFromPath,
  getLocalizedPath,
  isEntryDetailPath,
  isJournalDetailPath,
  type Locale,
} from './i18n';
import { HOME_SCROLL_RESTORE_KEY } from './home-scroll';
import { journalBasePath } from './journal';

const RETURN_KEY = 'nomarq-entry-close-return';

export type EntryCloseOrigin = 'home' | 'projects' | 'journal' | 'about';

export type EntryCloseReturn = {
  origin: EntryCloseOrigin;
  homeSectionIndex?: number;
  scrollY?: number;
};

export type EntryDetailType = 'project' | 'journal';

function saveEntryCloseReturn(data: EntryCloseReturn) {
  try {
    sessionStorage.setItem(RETURN_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage unavailable
  }
}

function readEntryCloseReturn(): EntryCloseReturn | null {
  try {
    const raw = sessionStorage.getItem(RETURN_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as EntryCloseReturn;
  } catch {
    return null;
  }
}

function captureReturnFromLink(link: HTMLAnchorElement) {
  const origin = link.dataset.entryCloseOrigin as EntryCloseOrigin | undefined;

  if (!origin) {
    return;
  }

  const data: EntryCloseReturn = { origin };

  if (origin === 'home') {
    const section = link.closest<HTMLElement>('[data-home-section]');

    if (section?.dataset.homeSection != null) {
      data.homeSectionIndex = Number(section.dataset.homeSection);
    }

    data.scrollY = window.scrollY;
  }

  saveEntryCloseReturn(data);
}

function getCloseHref(detailType: EntryDetailType, locale: Locale): string {
  const stored = readEntryCloseReturn();

  if (stored?.origin === 'home') {
    return getLocalizedPath(locale, '/');
  }

  if (stored?.origin === 'projects') {
    return getLocalizedPath(locale, '/projects');
  }

  if (stored?.origin === 'journal') {
    return getLocalizedPath(locale, journalBasePath);
  }

  if (stored?.origin === 'about') {
    return getLocalizedPath(locale, '/about');
  }

  return getLocalizedPath(
    locale,
    detailType === 'journal' ? journalBasePath : '/projects',
  );
}

function queueHomeScrollRestore(stored: EntryCloseReturn) {
  try {
    sessionStorage.setItem(
      HOME_SCROLL_RESTORE_KEY,
      JSON.stringify({
        homeSectionIndex: stored.homeSectionIndex,
        scrollY: stored.scrollY,
      }),
    );
  } catch {
    // sessionStorage unavailable
  }
}

function updateHeaderCloseState() {
  const pathname = window.location.pathname;
  const isDetail = isEntryDetailPath(pathname);
  const detailType: EntryDetailType = isJournalDetailPath(pathname) ? 'journal' : 'project';
  const locale = getLocaleFromPath(pathname);
  const href = getCloseHref(detailType, locale);

  document.querySelectorAll<HTMLElement>('.header-language-switcher-locales').forEach((element) => {
    element.toggleAttribute('hidden', isDetail);
  });

  document.querySelectorAll<HTMLAnchorElement>('[data-header-close]').forEach((link) => {
    link.toggleAttribute('hidden', !isDetail);
    link.dataset.entryDetailType = detailType;
    link.href = href;
  });
}

export function initEntryCloseState() {
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('[data-entry-close-link]');

      if (link) {
        captureReturnFromLink(link);
      }
    },
    true,
  );

  // Queue home scroll restore before ClientRouter starts the transition.
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('[data-header-close]');

      if (!link || link.hidden) {
        return;
      }

      const stored = readEntryCloseReturn();

      if (stored?.origin === 'home') {
        queueHomeScrollRestore(stored);
      }
    },
    true,
  );

  const run = () => {
    updateHeaderCloseState();
  };

  run();
  document.addEventListener('astro:page-load', run);
}
