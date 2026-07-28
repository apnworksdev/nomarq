const TOGGLE_SELECTOR = '[data-projects-filter-toggle]';
const PANEL_INNER_SELECTOR = '.projects-filters-panel-inner';

export function updateFiltersPanelOffset(root: HTMLElement | null) {
  if (!root?.classList.contains('is-open')) {
    document.documentElement.style.setProperty('--projects-filters-offset', '0px');
    return;
  }

  const inner = root.querySelector<HTMLElement>(PANEL_INNER_SELECTOR);

  if (!inner) {
    return;
  }

  const height = inner.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--projects-filters-offset', `${height}px`);
}

export function setFiltersPanelOpen(root: HTMLElement, open: boolean) {
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

  if (open) {
    requestAnimationFrame(() => {
      updateFiltersPanelOffset(root);
    });
  } else {
    document.documentElement.style.setProperty('--projects-filters-offset', '0px');
  }
}

export function closeFiltersPanel(root: HTMLElement) {
  setFiltersPanelOpen(root, false);
}

export function observeFiltersPanel(root: HTMLElement) {
  const inner = root.querySelector<HTMLElement>(PANEL_INNER_SELECTOR);

  if (!inner) {
    return () => {};
  }

  const observer = new ResizeObserver(() => {
    updateFiltersPanelOffset(root);
  });

  observer.observe(inner);

  return () => {
    observer.disconnect();
  };
}

export function initFiltersPanelMetrics(root: HTMLElement) {
  updateFiltersPanelOffset(root);
  return observeFiltersPanel(root);
}
