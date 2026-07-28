import { collapseHomeExpanded } from './home-hover';
import { resetActiveHomeSection, setActiveHomeSection } from './home-active-section';

export const HOME_SCROLL_RESTORE_KEY = 'nomarq-home-scroll-restore';

const SECTION_SELECTOR = '[data-home-section]';
const NAV_SELECTOR = '[data-home-section-nav]';

type HomeScrollRestore = {
  homeSectionIndex?: number;
  scrollY?: number;
};

function readHomeScrollRestore(): HomeScrollRestore | null {
  try {
    const raw = sessionStorage.getItem(HOME_SCROLL_RESTORE_KEY);

    if (!raw) {
      return null;
    }

    sessionStorage.removeItem(HOME_SCROLL_RESTORE_KEY);
    return JSON.parse(raw) as HomeScrollRestore;
  } catch {
    return null;
  }
}

function setActiveNav(index: number) {
  document.querySelectorAll<HTMLButtonElement>(NAV_SELECTOR).forEach((button) => {
    const navIndex = Number(button.dataset.homeSectionNav);
    const isActive = navIndex === index;

    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

function instantScrollToSection(section: HTMLElement) {
  section.scrollIntoView({ block: 'center', behavior: 'instant' });
}

function instantScrollToY(scrollY: number) {
  window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
}

export function applyHomeScrollRestore(sections: HTMLElement[]): boolean {
  if (document.documentElement.dataset.page !== 'home') {
    return false;
  }

  const pending = readHomeScrollRestore();

  if (!pending) {
    return false;
  }

  document.documentElement.dataset.homeScrollRestore = 'true';

  if (pending.homeSectionIndex != null) {
    const section = sections.find(
      (entry) => Number(entry.dataset.homeSection) === pending.homeSectionIndex,
    );

    if (section) {
      instantScrollToSection(section);
      collapseHomeExpanded();
      setActiveHomeSection(section);
      setActiveNav(pending.homeSectionIndex);
      delete document.documentElement.dataset.homeScrollRestore;
      return true;
    }
  }

  if (pending.scrollY != null) {
    instantScrollToY(pending.scrollY);
  }

  delete document.documentElement.dataset.homeScrollRestore;
  return pending.scrollY != null;
}

function isFooterInView(): boolean {
  const footer = document.querySelector<HTMLElement>('.footer');

  if (!footer || document.documentElement.dataset.page !== 'home') {
    return false;
  }

  const rect = footer.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

function getMostCenteredSection(sections: HTMLElement[]): HTMLElement | null {
  if (isFooterInView()) {
    return null;
  }

  const viewportCenter = window.innerHeight / 2;
  let bestSection: HTMLElement | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const distance = Math.abs(viewportCenter - sectionCenter);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestSection = section;
    }
  }

  return bestSection;
}

function setActiveSection(section: HTMLElement) {
  const index = Number(section.dataset.homeSection);

  collapseHomeExpanded();
  setActiveHomeSection(section);
  setActiveNav(index);
}

export function initHomeScroll() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>(SECTION_SELECTOR));

  if (sections.length === 0) {
    return;
  }

  const restored = applyHomeScrollRestore(sections);

  let frame = 0;

  const updateActiveSection = () => {
    frame = 0;

    const bestSection = getMostCenteredSection(sections);

    if (!bestSection) {
      if (isFooterInView()) {
        collapseHomeExpanded();
        resetActiveHomeSection();
        setActiveNav(-1);
      }

      return;
    }

    setActiveSection(bestSection);
  };

  const scheduleUpdate = () => {
    if (frame !== 0) {
      return;
    }

    frame = window.requestAnimationFrame(updateActiveSection);
  };

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);

  document.querySelectorAll<HTMLButtonElement>(NAV_SELECTOR).forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.homeSectionNav);
      const target = sections.find((section) => Number(section.dataset.homeSection) === index);

      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  if (!restored) {
    updateActiveSection();
  }

  return () => {
    window.removeEventListener('scroll', scheduleUpdate);
    window.removeEventListener('resize', scheduleUpdate);

    if (frame !== 0) {
      window.cancelAnimationFrame(frame);
    }
  };
}

export function initHomeScrollState() {
  let cleanup: (() => void) | undefined;

  const run = () => {
    cleanup?.();
    cleanup = initHomeScroll();
  };

  const restoreAfterSwap = () => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(SECTION_SELECTOR));

    if (sections.length === 0) {
      return;
    }

    applyHomeScrollRestore(sections);
  };

  run();
  document.addEventListener('astro:after-swap', restoreAfterSwap);
  document.addEventListener('astro:page-load', run);
}
