import { collapseHomeExpanded } from './home-hover';
import { resetActiveHomeSection, setActiveHomeSection } from './home-active-section';

const SECTION_SELECTOR = '[data-home-section]';
const NAV_SELECTOR = '[data-home-section-nav]';

function getMostCenteredSection(sections: HTMLElement[]): HTMLElement | null {
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

function setActiveNav(index: number) {
  document.querySelectorAll<HTMLButtonElement>(NAV_SELECTOR).forEach((button) => {
    const navIndex = Number(button.dataset.homeSectionNav);
    const isActive = navIndex === index;

    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
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

  let frame = 0;

  const updateActiveSection = () => {
    frame = 0;

    const bestSection = getMostCenteredSection(sections);

    if (!bestSection) {
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

  updateActiveSection();

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
    resetActiveHomeSection();
    cleanup = initHomeScroll();
  };

  run();
  document.addEventListener('astro:page-load', run);
}
