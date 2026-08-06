const LIST_SELECTOR = '[data-about-list]';
const ITEM_SELECTOR = '[data-about-list-item]';
const LINK_SELECTOR = '[data-about-list-link]';

const HOVER_ENTER_DELAY_MS = 180;

function deactivateAll(list: HTMLElement) {
  list.classList.remove('is-hovering');
  list.querySelectorAll<HTMLElement>(ITEM_SELECTOR).forEach((item) => {
    item.classList.remove('is-hovered');
  });
}

function activateItem(item: HTMLElement, list: HTMLElement) {
  list.classList.add('is-hovering');
  list.querySelectorAll<HTMLElement>(ITEM_SELECTOR).forEach((entry) => {
    entry.classList.toggle('is-hovered', entry === item);
  });
}

export function initAboutListHover() {
  const cleanups: Array<() => void> = [];

  document.querySelectorAll<HTMLElement>(LIST_SELECTOR).forEach((list) => {
    list.querySelectorAll<HTMLElement>(ITEM_SELECTOR).forEach((item) => {
      const link = item.querySelector<HTMLElement>(LINK_SELECTOR);

      if (!link) {
        return;
      }

      let enterTimeout: ReturnType<typeof setTimeout> | undefined;

      const clearEnterTimeout = () => {
        if (enterTimeout) {
          clearTimeout(enterTimeout);
          enterTimeout = undefined;
        }
      };

      const onLinkEnter = () => {
        clearEnterTimeout();
        deactivateAll(list);

        enterTimeout = setTimeout(() => {
          activateItem(item, list);
          enterTimeout = undefined;
        }, HOVER_ENTER_DELAY_MS);
      };

      const onItemLeave = (event: MouseEvent) => {
        const related = event.relatedTarget;

        if (related instanceof Node && item.contains(related)) {
          return;
        }

        clearEnterTimeout();

        if (item.classList.contains('is-hovered')) {
          deactivateAll(list);
        }
      };

      link.addEventListener('mouseenter', onLinkEnter);
      item.addEventListener('mouseleave', onItemLeave);

      cleanups.push(() => {
        clearEnterTimeout();
        link.removeEventListener('mouseenter', onLinkEnter);
        item.removeEventListener('mouseleave', onItemLeave);
      });
    });
  });

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}

export function initAboutListHoverState() {
  let cleanup: (() => void) | undefined;

  const run = () => {
    cleanup?.();
    cleanup = initAboutListHover();
  };

  run();
  document.addEventListener('astro:page-load', run);
}
