import {
  getLocaleFromPath,
  getLocalizedPath,
  getPublicProjectPathFromPriv,
  isEntryDetailPath,
  isJournalDetailPath,
  isProjectPrivPath,
  type Locale,
} from './i18n';
import { HOME_SCROLL_RESTORE_KEY } from './home-scroll';
import {
  getJournalSectionFromPath,
  getJournalSectionPath,
} from './journal';

const RETURN_KEY = 'nomarq-entry-close-return';

export type EntryCloseOrigin = 'home' | 'projects' | 'recognition' | 'initiatives' | 'about';

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

function getJournalClosePath(pathname: string): string {
  const sectionFromPath = getJournalSectionFromPath(pathname);

  if (sectionFromPath) {
    return getJournalSectionPath(sectionFromPath);
  }

  return getJournalSectionPath('recognition');
}

function getCloseHref(detailType: EntryDetailType, locale: Locale, pathname: string): string {
  if (isProjectPrivPath(pathname)) {
    const publicPath = getPublicProjectPathFromPriv(pathname);
    return getLocalizedPath(locale, publicPath ?? '/projects');
  }

  const stored = readEntryCloseReturn();

  if (stored?.origin === 'home') {
    return getLocalizedPath(locale, '/');
  }

  if (stored?.origin === 'projects') {
    return getLocalizedPath(locale, '/projects');
  }

  if (stored?.origin === 'recognition' || stored?.origin === 'initiatives') {
    return getLocalizedPath(locale, getJournalSectionPath(stored.origin));
  }

  if (stored?.origin === 'about') {
    return getLocalizedPath(locale, '/about');
  }

  return getLocalizedPath(
    locale,
    detailType === 'journal' ? getJournalClosePath(pathname) : '/projects',
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
  const href = getCloseHref(detailType, locale, pathname);

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
