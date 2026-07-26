const LIST_SELECTOR = '[data-projects-list]';
const ITEM_SELECTOR = '[data-projects-list-item]';
const TITLE_SELECTOR = '[data-projects-list-title]';
const DESCRIPTION_SELECTOR = '[data-projects-list-description]';

const HOVER_ENTER_DELAY_MS = 180;

function isInHoverZone(node: EventTarget | null, item: HTMLElement): boolean {
  if (!(node instanceof Node)) {
    return false;
  }

  const title = item.querySelector<HTMLElement>(TITLE_SELECTOR);
  const description = item.querySelector<HTMLElement>(DESCRIPTION_SELECTOR);

  if (title && (title === node || title.contains(node))) {
    return true;
  }

  if (description && (description === node || description.contains(node))) {
    return true;
  }

  return false;
}

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

export function initProjectsListHover() {
  const cleanups: Array<() => void> = [];

  document.querySelectorAll<HTMLElement>(LIST_SELECTOR).forEach((list) => {
    list.querySelectorAll<HTMLElement>(ITEM_SELECTOR).forEach((item) => {
      const title = item.querySelector<HTMLElement>(TITLE_SELECTOR);
      const description = item.querySelector<HTMLElement>(DESCRIPTION_SELECTOR);

      if (!title) {
        return;
      }

      let enterTimeout: ReturnType<typeof setTimeout> | undefined;

      const clearEnterTimeout = () => {
        if (enterTimeout) {
          clearTimeout(enterTimeout);
          enterTimeout = undefined;
        }
      };

      const onTitleEnter = () => {
        clearEnterTimeout();
        deactivateAll(list);

        enterTimeout = setTimeout(() => {
          activateItem(item, list);
          enterTimeout = undefined;
        }, HOVER_ENTER_DELAY_MS);
      };

      const onDescriptionEnter = () => {
        clearEnterTimeout();

        if (!item.classList.contains('is-hovered')) {
          activateItem(item, list);
        }
      };

      const onItemMouseOut = (event: MouseEvent) => {
        if (isInHoverZone(event.relatedTarget, item)) {
          return;
        }

        clearEnterTimeout();

        if (item.classList.contains('is-hovered')) {
          deactivateAll(list);
        }
      };

      title.addEventListener('mouseenter', onTitleEnter);
      description?.addEventListener('mouseenter', onDescriptionEnter);
      item.addEventListener('mouseout', onItemMouseOut);

      cleanups.push(() => {
        clearEnterTimeout();
        title.removeEventListener('mouseenter', onTitleEnter);
        description?.removeEventListener('mouseenter', onDescriptionEnter);
        item.removeEventListener('mouseout', onItemMouseOut);
      });
    });
  });

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}

export function initProjectsListHoverState() {
  let cleanup: (() => void) | undefined;

  const run = () => {
    cleanup?.();
    cleanup = initProjectsListHover();
  };

  run();
  document.addEventListener('astro:page-load', run);
}
