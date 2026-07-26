export type ProjectsView = 'grid' | 'list';

const STORAGE_KEY = 'nomarq-projects-view';
const VIEW_SWITCH_SELECTOR = '[data-projects-view-switch]';
const VIEW_BUTTON_SELECTOR = 'button[data-projects-view]';
const GRID_SELECTOR = '[data-projects-grid]';
const LIST_SELECTOR = '[data-projects-list]';

function readStoredView(): ProjectsView {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === 'grid' || stored === 'list') {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }

  return 'grid';
}

function storeView(view: ProjectsView) {
  try {
    localStorage.setItem(STORAGE_KEY, view);
  } catch {
    // localStorage unavailable
  }
}

export function getProjectsView(): ProjectsView {
  const fromDom = document.documentElement.dataset.projectsView;

  if (fromDom === 'grid' || fromDom === 'list') {
    return fromDom;
  }

  return readStoredView();
}

export function applyProjectsView(view: ProjectsView) {
  document.documentElement.dataset.projectsView = view;
  storeView(view);

  const grid = document.querySelector<HTMLElement>(GRID_SELECTOR);
  const list = document.querySelector<HTMLElement>(LIST_SELECTOR);

  grid?.toggleAttribute('hidden', view !== 'grid');
  list?.toggleAttribute('hidden', view !== 'list');

  if (view === 'grid' && grid) {
    grid.classList.remove('is-hovering');
    grid.querySelectorAll<HTMLElement>('[data-projects-grid-item]').forEach((item) => {
      item.classList.remove('is-hovered');
    });
    grid.querySelectorAll<HTMLElement>('[data-projects-grid-preview]').forEach((preview) => {
      preview.classList.remove('is-visible');
    });
  }

  if (view === 'list' && list) {
    list.classList.remove('is-hovering');
    list.querySelectorAll<HTMLElement>('[data-projects-list-item].is-hovered').forEach((item) => {
      item.classList.remove('is-hovered');
    });
  }
}

function syncViewSwitchVisibility() {
  const isProjects = document.documentElement.dataset.page === 'projects';

  document.querySelectorAll<HTMLElement>(VIEW_SWITCH_SELECTOR).forEach((switcher) => {
    switcher.toggleAttribute('hidden', !isProjects);
  });
}

export function initProjectsView() {
  syncViewSwitchVisibility();

  const cleanups: Array<() => void> = [];
  applyProjectsView(getProjectsView());

  document.querySelectorAll<HTMLButtonElement>(VIEW_BUTTON_SELECTOR).forEach((button) => {
    const onClick = () => {
      const view = button.dataset.projectsView;

      if (view === 'grid' || view === 'list') {
        applyProjectsView(view);
      }
    };

    button.addEventListener('click', onClick);
    cleanups.push(() => button.removeEventListener('click', onClick));
  });

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}

export function initProjectsViewState() {
  let cleanup: (() => void) | undefined;

  const run = () => {
    cleanup?.();
    cleanup = initProjectsView();
  };

  run();
  document.addEventListener('astro:page-load', run);
}
