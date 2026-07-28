import { initFiltersPanelMetrics, setFiltersPanelOpen } from './filters-panel';

const ROOT_SELECTOR = '[data-journal-filters]';
const TOGGLE_SELECTOR = '[data-projects-filter-toggle]';
const CATEGORY_SELECTOR = '[data-journal-filter-category]';
const SEARCH_SELECTOR = '[data-journal-filter-search]';
const CLEAR_SELECTOR = '[data-journal-filter-clear]';
const COUNT_SELECTOR = '[data-journal-filter-count]';
const LIST_SELECTOR = '[data-journal-list]';
const LIST_ITEM_SELECTOR = '[data-journal-list-item]';
const LIST_INDEX_SELECTOR = '[data-journal-list-index]';

type JournalFilterRecord = {
  id: string;
  orderIndex: number;
  category: string;
  searchText: string;
};

function readFilterRecords(root: HTMLElement): JournalFilterRecord[] {
  const raw = root.dataset.journalFilterRecords;

  if (!raw) {
    return [];
  }

  return JSON.parse(raw) as JournalFilterRecord[];
}

function getSelectedCategories(root: HTMLElement): Set<string> {
  const selected = new Set<string>();

  root.querySelectorAll<HTMLButtonElement>(`${CATEGORY_SELECTOR}.active`).forEach((button) => {
    const category = button.dataset.journalCategory;

    if (category) {
      selected.add(category);
    }
  });

  return selected;
}

function getSearchQuery(root: HTMLElement): string {
  return root.querySelector<HTMLInputElement>(SEARCH_SELECTOR)?.value.trim().toLowerCase() ?? '';
}

function matchesFilters(
  record: JournalFilterRecord,
  selectedCategories: Set<string>,
  query: string,
): boolean {
  if (selectedCategories.size > 0 && !selectedCategories.has(record.category)) {
    return false;
  }

  if (query && !record.searchText.includes(query)) {
    return false;
  }

  return true;
}

function applyListFilter(list: HTMLElement, visibleRecords: JournalFilterRecord[]) {
  const visibleIds = new Set(visibleRecords.map((record) => record.id));
  const visibleItems: HTMLElement[] = [];

  list.querySelectorAll<HTMLElement>(LIST_ITEM_SELECTOR).forEach((item) => {
    const id = item.dataset.journalId ?? '';
    const isVisible = visibleIds.has(id);

    item.toggleAttribute('hidden', !isVisible);
    item.classList.toggle('is-filtered-out', !isVisible);
    item.classList.remove('is-hovered');

    if (isVisible) {
      visibleItems.push(item);
    }
  });

  visibleItems.forEach((item, index) => {
    const indexLabel = item.querySelector<HTMLElement>(LIST_INDEX_SELECTOR);

    if (indexLabel) {
      indexLabel.textContent = `( ${index + 1} )`;
    }
  });
}

function updateResultsCount(root: HTMLElement, count: number) {
  const counter = root.querySelector<HTMLElement>(COUNT_SELECTOR);

  if (counter) {
    counter.textContent = String(count);
  }
}

function setPanelOpen(root: HTMLElement, open: boolean) {
  setFiltersPanelOpen(root, open);
}

function applyFilters(root: HTMLElement) {
  const list = document.querySelector<HTMLElement>(LIST_SELECTOR);

  if (!list) {
    return;
  }

  const records = readFilterRecords(root);
  const selectedCategories = getSelectedCategories(root);
  const query = getSearchQuery(root);
  const visibleRecords = records.filter((record) =>
    matchesFilters(record, selectedCategories, query),
  );

  list.classList.remove('is-hovering');
  applyListFilter(list, visibleRecords);
  updateResultsCount(root, visibleRecords.length);
}

export function initJournalFilters() {
  const root = document.querySelector<HTMLElement>(ROOT_SELECTOR);

  if (!root) {
    return () => {};
  }

  const cleanups: Array<() => void> = [];
  const toggle = document.querySelector<HTMLButtonElement>(TOGGLE_SELECTOR);
  const search = root.querySelector<HTMLInputElement>(SEARCH_SELECTOR);
  const clear = root.querySelector<HTMLButtonElement>(CLEAR_SELECTOR);

  const onToggle = () => {
    setPanelOpen(root, !root.classList.contains('is-open'));
  };

  const onCategoryClick = (event: Event) => {
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
    root.querySelectorAll<HTMLButtonElement>(CATEGORY_SELECTOR).forEach((button) => {
      button.classList.remove('active');
    });

    if (search) {
      search.value = '';
    }

    applyFilters(root);
  };

  toggle?.addEventListener('click', onToggle);
  search?.addEventListener('input', onSearch);
  clear?.addEventListener('click', onClear);

  root.querySelectorAll<HTMLButtonElement>(CATEGORY_SELECTOR).forEach((button) => {
    button.addEventListener('click', onCategoryClick);
    cleanups.push(() => button.removeEventListener('click', onCategoryClick));
  });

  cleanups.push(() => toggle?.removeEventListener('click', onToggle));
  cleanups.push(() => search?.removeEventListener('input', onSearch));
  cleanups.push(() => clear?.removeEventListener('click', onClear));

  updateResultsCount(root, readFilterRecords(root).length);

  const stopObservingPanel = initFiltersPanelMetrics(root);
  cleanups.push(stopObservingPanel);

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}

export function initJournalFiltersState() {
  let cleanup: (() => void) | undefined;

  const run = () => {
    cleanup?.();
    cleanup = initJournalFilters();
  };

  run();
  document.addEventListener('astro:page-load', run);
}

export const JOURNAL_CATEGORY_ORDER = [
  'prize',
  'press',
  'event',
  'interview',
  'news',
  'recognition',
  'publication',
  'exhibition',
  'initiative',
] as const;

export function sortJournalCategories(categories: string[]): string[] {
  const order = new Map<string, number>(
    JOURNAL_CATEGORY_ORDER.map((category, index) => [category, index]),
  );

  return [...categories].sort((left, right) => {
    const leftIndex = order.get(left) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = order.get(right) ?? Number.MAX_SAFE_INTEGER;

    return leftIndex - rightIndex;
  });
}

const FILTER_CATEGORY_COLUMN_COUNT = 5;

export function groupJournalCategoriesForFilter(categories: string[]): string[][] {
  const sorted = sortJournalCategories(categories);
  const columns = Array.from({ length: FILTER_CATEGORY_COLUMN_COUNT }, () => [] as string[]);

  sorted.forEach((category, index) => {
    columns[index % FILTER_CATEGORY_COLUMN_COUNT].push(category);
  });

  return columns;
}
