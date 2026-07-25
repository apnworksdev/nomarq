import { buildProjectsGridPlacements } from './projects-grid';

const ROOT_SELECTOR = '[data-projects-filters]';
const TOGGLE_SELECTOR = '[data-projects-filter-toggle]';
const USE_SELECTOR = '[data-projects-filter-use]';
const SEARCH_SELECTOR = '[data-projects-filter-search]';
const CLEAR_SELECTOR = '[data-projects-filter-clear]';
const COUNT_SELECTOR = '[data-projects-filter-count]';
const GRID_SELECTOR = '[data-projects-grid]';
const ITEM_SELECTOR = '[data-projects-grid-item]';
const PREVIEW_SELECTOR = '[data-projects-grid-preview]';

type ProjectFilterRecord = {
  slug: string;
  orderIndex: number;
  imageCount: number;
  useSlugs: string[];
  searchText: string;
};

function readFilterRecords(root: HTMLElement): ProjectFilterRecord[] {
  const raw = root.dataset.projectsFilterRecords;

  if (!raw) {
    return [];
  }

  return JSON.parse(raw) as ProjectFilterRecord[];
}

function getSelectedUses(root: HTMLElement): Set<string> {
  const selected = new Set<string>();

  root.querySelectorAll<HTMLButtonElement>(`${USE_SELECTOR}.active`).forEach((button) => {
    const slug = button.dataset.useSlug;

    if (slug) {
      selected.add(slug);
    }
  });

  return selected;
}

function getSearchQuery(root: HTMLElement): string {
  return root.querySelector<HTMLInputElement>(SEARCH_SELECTOR)?.value.trim().toLowerCase() ?? '';
}

function matchesFilters(record: ProjectFilterRecord, selectedUses: Set<string>, query: string): boolean {
  if (selectedUses.size > 0) {
    const hasUse = record.useSlugs.some((slug) => selectedUses.has(slug));

    if (!hasUse) {
      return false;
    }
  }

  if (query && !record.searchText.includes(query)) {
    return false;
  }

  return true;
}

function applyLayout(grid: HTMLElement, visibleRecords: ProjectFilterRecord[]) {
  const placements = buildProjectsGridPlacements(
    visibleRecords.map(({ slug, orderIndex, imageCount }) => ({
      slug,
      orderIndex,
      imageCount,
    })),
  );
  const placementBySlug = new Map(placements.map((placement) => [placement.slug, placement]));
  const visibleSlugs = new Set(visibleRecords.map((record) => record.slug));

  grid.querySelectorAll<HTMLElement>(ITEM_SELECTOR).forEach((item) => {
    const slug = item.dataset.projectSlug ?? '';
    const placement = placementBySlug.get(slug);
    const isVisible = visibleSlugs.has(slug);

    item.toggleAttribute('hidden', !isVisible);
    item.classList.toggle('is-filtered-out', !isVisible);

    if (!placement) {
      return;
    }

    item.style.gridRow = String(placement.row);
    item.style.gridColumn = `${placement.startColumn} / span ${placement.span}`;
  });

  grid.querySelectorAll<HTMLElement>(PREVIEW_SELECTOR).forEach((preview) => {
    const slug = preview.dataset.projectSlug ?? '';
    const placement = placementBySlug.get(slug);
    const previewIndex = Number.parseInt(preview.dataset.previewIndex ?? '', 10);
    const previewPlacement = placement?.previews.find(
      (entry) => entry.imageIndex === previewIndex,
    );
    const isVisible = Boolean(placement && previewPlacement);

    preview.toggleAttribute('hidden', !isVisible);
    preview.classList.toggle('is-filtered-out', !isVisible);
    preview.classList.remove('is-visible');

    if (!placement || !previewPlacement) {
      return;
    }

    preview.style.gridRow = String(placement.row);
    preview.style.gridColumn = `${previewPlacement.column} / span 1`;
  });
}

function updateResultsCount(root: HTMLElement, count: number) {
  const counter = root.querySelector<HTMLElement>(COUNT_SELECTOR);

  if (counter) {
    counter.textContent = String(count);
  }
}

function setPanelOpen(root: HTMLElement, open: boolean) {
  root.classList.toggle('is-open', open);
  document.documentElement.classList.toggle('projects-filters-open', open);

  const toggle = document.querySelector<HTMLButtonElement>(TOGGLE_SELECTOR);
  const sign = document.querySelector<HTMLElement>('[data-projects-filter-toggle-sign]');

  if (toggle) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (sign) {
    sign.textContent = open ? '( - )' : '( + )';
  }
}

function syncFilterToggleVisibility() {
  const isProjects = document.documentElement.dataset.page === 'projects';
  const toggle = document.querySelector<HTMLButtonElement>(TOGGLE_SELECTOR);
  const root = document.querySelector<HTMLElement>(ROOT_SELECTOR);

  toggle?.toggleAttribute('hidden', !isProjects);

  if (!isProjects && root) {
    setPanelOpen(root, false);
  }
}

function applyFilters(root: HTMLElement) {
  const grid = document.querySelector<HTMLElement>(GRID_SELECTOR);

  if (!grid) {
    return;
  }

  grid.classList.remove('is-hovering');
  grid.querySelectorAll<HTMLElement>(ITEM_SELECTOR).forEach((item) => {
    item.classList.remove('is-hovered');
  });
  grid.querySelectorAll<HTMLElement>(PREVIEW_SELECTOR).forEach((preview) => {
    preview.classList.remove('is-visible');
  });

  const records = readFilterRecords(root);
  const selectedUses = getSelectedUses(root);
  const query = getSearchQuery(root);
  const visibleRecords = records.filter((record) => matchesFilters(record, selectedUses, query));

  applyLayout(grid, visibleRecords);
  updateResultsCount(root, visibleRecords.length);
}

export function initProjectsFilters() {
  syncFilterToggleVisibility();

  const cleanups: Array<() => void> = [];
  const toggle = document.querySelector<HTMLButtonElement>(TOGGLE_SELECTOR);
  const root = document.querySelector<HTMLElement>(ROOT_SELECTOR);

  if (!toggle || !root) {
    return () => {};
  }

  const search = root.querySelector<HTMLInputElement>(SEARCH_SELECTOR);
  const clear = root.querySelector<HTMLButtonElement>(CLEAR_SELECTOR);

  const onToggle = () => {
    setPanelOpen(root, !root.classList.contains('is-open'));
  };

  const onUseClick = (event: Event) => {
    const target = event.currentTarget;

    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    target.classList.toggle('active');
    applyFilters(root);
  };

  const onSearch = () => {
    applyFilters(root);
  };

  const onClear = () => {
    root.querySelectorAll<HTMLButtonElement>(USE_SELECTOR).forEach((button) => {
      button.classList.remove('active');
    });

    if (search) {
      search.value = '';
    }

    applyFilters(root);
  };

  toggle.addEventListener('click', onToggle);
  search?.addEventListener('input', onSearch);
  clear?.addEventListener('click', onClear);

  root.querySelectorAll<HTMLButtonElement>(USE_SELECTOR).forEach((button) => {
    button.addEventListener('click', onUseClick);
    cleanups.push(() => button.removeEventListener('click', onUseClick));
  });

  cleanups.push(() => toggle.removeEventListener('click', onToggle));
  cleanups.push(() => search?.removeEventListener('input', onSearch));
  cleanups.push(() => clear?.removeEventListener('click', onClear));

  updateResultsCount(root, readFilterRecords(root).length);

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}

export function initProjectsFiltersState() {
  let cleanup: (() => void) | undefined;

  const run = () => {
    cleanup?.();
    cleanup = initProjectsFilters();
  };

  run();
  document.addEventListener('astro:page-load', run);
}

/** Column order for the projects filter panel (matches design). */
export const FILTER_USE_COLUMN_SLUGS: string[][] = [
  ['homes', 'facilities'],
  ['collective-living', 'workspaces'],
  ['hospitality', 'urban'],
  ['culture', 'landscape'],
  ['civic'],
];

export function groupUsesForFilter<T extends { slug: string }>(uses: T[]): T[][] {
  const bySlug = new Map(uses.map((use) => [use.slug, use]));

  return FILTER_USE_COLUMN_SLUGS.map((columnSlugs) =>
    columnSlugs
      .map((slug) => bySlug.get(slug))
      .filter((use): use is T => Boolean(use)),
  );
}
