const GRID_SELECTOR = '[data-projects-grid]';
const ITEM_SELECTOR = '[data-projects-grid-item]';
const MAIN_SELECTOR = '[data-projects-grid-main]';
const PREVIEW_SELECTOR = '[data-projects-grid-preview]';

const HOVER_ENTER_DELAY_MS = 180;
const MOBILE_MQ = '(max-width: 820px)';

function isMobileViewport() {
  return window.matchMedia(MOBILE_MQ).matches;
}

function showPreviews(slug: string) {
  document.querySelectorAll<HTMLElement>(`${PREVIEW_SELECTOR}[data-project-slug="${slug}"]`).forEach(
    (preview) => {
      preview.classList.add('is-visible');
    },
  );
}

function hideAllPreviews() {
  document.querySelectorAll<HTMLElement>(PREVIEW_SELECTOR).forEach((preview) => {
    preview.classList.remove('is-visible');
  });
}

function activateItem(item: HTMLElement, grid: HTMLElement) {
  grid.classList.add('is-hovering');
  item.classList.add('is-hovered');
  showPreviews(item.dataset.projectSlug ?? '');
}

function deactivateAll(grid: HTMLElement) {
  grid.classList.remove('is-hovering');
  grid.querySelectorAll<HTMLElement>(ITEM_SELECTOR).forEach((item) => {
    item.classList.remove('is-hovered');
  });
  hideAllPreviews();
}

export function initProjectsGridHover() {
  const cleanups: Array<() => void> = [];

  document.querySelectorAll<HTMLElement>(GRID_SELECTOR).forEach((grid) => {
    let enterTimeout: ReturnType<typeof setTimeout> | undefined;

    const clearEnterTimeout = () => {
      if (enterTimeout) {
        clearTimeout(enterTimeout);
        enterTimeout = undefined;
      }
    };

    grid.querySelectorAll<HTMLElement>(ITEM_SELECTOR).forEach((item) => {
      const main = item.querySelector<HTMLElement>(MAIN_SELECTOR);

      if (!main) {
        return;
      }

      const onEnter = () => {
        if (isMobileViewport()) {
          return;
        }

        clearEnterTimeout();
        deactivateAll(grid);

        enterTimeout = setTimeout(() => {
          activateItem(item, grid);
          enterTimeout = undefined;
        }, HOVER_ENTER_DELAY_MS);
      };

      const onLeave = () => {
        clearEnterTimeout();
        deactivateAll(grid);
      };

      main.addEventListener('mouseenter', onEnter);
      main.addEventListener('mouseleave', onLeave);

      cleanups.push(() => {
        clearEnterTimeout();
        main.removeEventListener('mouseenter', onEnter);
        main.removeEventListener('mouseleave', onLeave);
      });
    });
  });

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}

export function initProjectsGridHoverState() {
  let cleanup: (() => void) | undefined;

  const run = () => {
    cleanup?.();
    cleanup = initProjectsGridHover();
  };

  run();
  document.addEventListener('astro:page-load', run);
}
