import { onHomeActiveSectionChange } from './home-active-section';

const DETAIL_TRIGGER_SELECTOR = '.home-section-detail-trigger';
const TEXT_OVERLAY_SELECTOR = '[data-home-section-overlay-text]';

function expandSection(section: HTMLElement) {
  if (section.dataset.homeSectionExpandable !== 'true') {
    return;
  }

  section.classList.add('is-expanded');
}

function collapseSection(section: HTMLElement) {
  section.classList.remove('is-expanded');
}

export function collapseHomeExpanded() {
  document.querySelectorAll<HTMLElement>('[data-home-section].is-expanded').forEach((section) => {
    collapseSection(section);
  });
}

export function initHomeHover() {
  const cleanups: Array<() => void> = [];

  document.querySelectorAll<HTMLElement>('[data-home-section]').forEach((section) => {
    const detailTrigger = section.querySelector<HTMLElement>(DETAIL_TRIGGER_SELECTOR);
    const textOverlay = section.querySelector<HTMLElement>(TEXT_OVERLAY_SELECTOR);

    if (!detailTrigger || !textOverlay) {
      return;
    }

    const onTriggerEnter = () => {
      if (!section.classList.contains('is-active')) {
        return;
      }

      expandSection(section);
    };

    const onTextLeave = (event: MouseEvent) => {
      const nextTarget = event.relatedTarget;

      if (nextTarget instanceof Node && textOverlay.contains(nextTarget)) {
        return;
      }

      collapseSection(section);
    };

    detailTrigger.addEventListener('mouseenter', onTriggerEnter);
    textOverlay.addEventListener('mouseleave', onTextLeave);

    cleanups.push(() => {
      detailTrigger.removeEventListener('mouseenter', onTriggerEnter);
      textOverlay.removeEventListener('mouseleave', onTextLeave);
    });
  });

  const unsubscribe = onHomeActiveSectionChange(() => {
    collapseHomeExpanded();
  });

  cleanups.push(unsubscribe);

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}

export function initHomeHoverState() {
  let cleanup: (() => void) | undefined;

  const run = () => {
    cleanup?.();
    cleanup = initHomeHover();
  };

  run();
  document.addEventListener('astro:page-load', run);
}
