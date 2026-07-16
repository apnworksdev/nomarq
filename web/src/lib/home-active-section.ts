const SECTION_SELECTOR = '[data-home-section]';

let activeSection: HTMLElement | null = null;
const listeners = new Set<(section: HTMLElement | null) => void>();

export function getActiveHomeSection() {
  return activeSection;
}

export function setActiveHomeSection(section: HTMLElement | null) {
  if (activeSection === section) {
    return;
  }

  document.querySelectorAll<HTMLElement>(SECTION_SELECTOR).forEach((entry) => {
    entry.classList.toggle('is-active', entry === section);
  });

  activeSection = section;

  for (const listener of listeners) {
    listener(section);
  }
}

export function onHomeActiveSectionChange(listener: (section: HTMLElement | null) => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function resetActiveHomeSection() {
  activeSection = null;

  document.querySelectorAll<HTMLElement>(SECTION_SELECTOR).forEach((entry) => {
    entry.classList.remove('is-active');
  });
}
