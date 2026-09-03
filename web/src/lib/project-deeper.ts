const STORAGE_KEY = 'nomarq-deeper-access';

export type DeeperAccessFields = {
  name: string;
  profile: string;
  phone: string;
  location: string;
  email: string;
};

const FIELD_KEYS = ['name', 'profile', 'phone', 'location', 'email'] as const;

function readStoredFields(): Partial<DeeperAccessFields> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Partial<DeeperAccessFields>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStoredFields(fields: DeeperAccessFields) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
  } catch {
    // Ignore quota / private mode failures.
  }
}

function collectFields(form: HTMLFormElement): DeeperAccessFields {
  const data = new FormData(form);

  return {
    name: String(data.get('name') ?? '').trim(),
    profile: String(data.get('profile') ?? '').trim(),
    phone: String(data.get('phone') ?? '').trim(),
    location: String(data.get('location') ?? '').trim(),
    email: String(data.get('email') ?? '').trim(),
  };
}

function fieldsAreComplete(fields: DeeperAccessFields) {
  return FIELD_KEYS.every((key) => fields[key].length > 0);
}

function toAbsoluteUrl(path: string) {
  try {
    return new URL(path, window.location.origin).toString();
  } catch {
    return path;
  }
}

async function postJson(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error || `Request failed (${response.status})`);
  }
}

function setActiveSection(buttons: HTMLElement[], sectionId: string) {
  buttons.forEach((button) => {
    const isActive = button.dataset.projectDeeperSection === sectionId;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

function setOverlayDescription(hero: HTMLElement, sectionId: string) {
  const overlay = hero.querySelector<HTMLElement>('[data-project-deeper-overlay-description]');
  if (!overlay) {
    return;
  }

  const template = hero.querySelector<HTMLTemplateElement>(
    `template[data-project-deeper-description="${sectionId}"]`,
  );
  const paragraphs = template
    ? [...template.content.querySelectorAll('p')].map((paragraph) =>
        paragraph.cloneNode(true),
      )
    : [];

  overlay.replaceChildren(...paragraphs);
  overlay.classList.toggle('is-empty', paragraphs.length === 0);
}

function initAccessForm(form: HTMLFormElement) {
  const stored = readStoredFields();
  FIELD_KEYS.forEach((key) => {
    const input = form.elements.namedItem(key);
    if (input instanceof HTMLInputElement && stored[key]) {
      input.value = stored[key] ?? '';
    }
  });

  const onSubmit = async (event: Event) => {
    event.preventDefault();
    const fields = collectFields(form);

    if (!fieldsAreComplete(fields)) {
      form.reportValidity();
      return;
    }

    writeStoredFields(fields);

    const href = form.dataset.projectDeeperPrivHref;
    const projectTitle = form.dataset.projectTitle?.trim() || '';
    const locale = form.dataset.projectLocale === 'es' ? 'es' : 'en';
    const submitButton = form.querySelector<HTMLButtonElement>('[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      if (href && projectTitle) {
        await postJson('/api/project-access', {
          ...fields,
          projectTitle,
          privUrl: toAbsoluteUrl(href),
          locale,
        });
      }
    } catch (error) {
      console.error('Failed to send access email:', error);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }

    if (href) {
      window.location.assign(href);
    }
  };

  form.addEventListener('submit', onSubmit);

  return () => {
    form.removeEventListener('submit', onSubmit);
  };
}

function initSectionsPanel(root: HTMLElement) {
  const hero = root.closest<HTMLElement>('[data-entry-detail]');
  const requestButton = root.querySelector<HTMLButtonElement>('[data-project-deeper-request]');
  const sectionButtons = [
    ...root.querySelectorAll<HTMLElement>('[data-project-deeper-section]'),
  ];
  const scroll = hero?.querySelector<HTMLElement>('[data-project-deeper-scroll]');
  const slides = scroll
    ? [...scroll.querySelectorAll<HTMLElement>('[data-project-deeper-slide]')]
    : [];

  if (!scroll || sectionButtons.length === 0) {
    return () => {};
  }

  let activeSectionId: string | null = null;
  let lockedSectionId: string | null = null;

  const applyActiveSection = (sectionId: string) => {
    if (activeSectionId === sectionId) {
      return;
    }

    activeSectionId = sectionId;
    setActiveSection(sectionButtons, sectionId);
    if (hero) {
      setOverlayDescription(hero, sectionId);
    }
  };

  const getSectionIdAtScroll = () => {
    if (slides.length === 0) {
      return null;
    }

    const anchor = scroll.scrollTop + 1;
    let activeSlide = slides[0];

    for (const slide of slides) {
      if (slide.offsetTop <= anchor) {
        activeSlide = slide;
      } else {
        break;
      }
    }

    return activeSlide?.dataset.projectDeeperSlide ?? null;
  };

  const onScroll = () => {
    const sectionId = getSectionIdAtScroll();

    if (lockedSectionId) {
      if (sectionId === lockedSectionId) {
        lockedSectionId = null;
      }
      return;
    }

    if (sectionId) {
      applyActiveSection(sectionId);
    }
  };

  const onUserScrollIntent = () => {
    lockedSectionId = null;
  };

  const onSectionClick = (event: Event) => {
    const button = event.currentTarget as HTMLElement;
    const sectionId = button.dataset.projectDeeperSection;
    if (!sectionId) {
      return;
    }

    const target = slides.find((slide) => slide.dataset.projectDeeperSlide === sectionId);
    if (!target) {
      return;
    }

    applyActiveSection(sectionId);
    lockedSectionId = getSectionIdAtScroll() === sectionId ? null : sectionId;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  sectionButtons.forEach((button) => {
    button.addEventListener('click', onSectionClick);
  });

  scroll.addEventListener('scroll', onScroll, { passive: true });
  scroll.addEventListener('wheel', onUserScrollIntent, { passive: true });
  scroll.addEventListener('touchstart', onUserScrollIntent, { passive: true });

  const onRequestClick = async () => {
    if (!requestButton) {
      return;
    }

    const stored = readStoredFields();
    const fields: DeeperAccessFields = {
      name: stored.name?.trim() ?? '',
      profile: stored.profile?.trim() ?? '',
      phone: stored.phone?.trim() ?? '',
      location: stored.location?.trim() ?? '',
      email: stored.email?.trim() ?? '',
    };

    if (!fieldsAreComplete(fields)) {
      console.error('Missing access form data for file request.');
      return;
    }

    const projectTitle = root.dataset.projectTitle?.trim() || '';
    const publicHref = root.dataset.projectPublicHref?.trim() || '';
    const privHref = root.dataset.projectPrivHref?.trim() || window.location.pathname;
    const sentLabel = requestButton.dataset.projectDeeperRequestSent ?? requestButton.textContent;

    requestButton.disabled = true;

    try {
      await postJson('/api/project-request-files', {
        ...fields,
        projectTitle,
        projectUrl: toAbsoluteUrl(publicHref),
        privUrl: toAbsoluteUrl(privHref),
      });

      requestButton.textContent = sentLabel;
      requestButton.classList.add('is-sent');
    } catch (error) {
      console.error('Failed to send file request email:', error);
      requestButton.disabled = false;
    }
  };

  requestButton?.addEventListener('click', onRequestClick);

  return () => {
    sectionButtons.forEach((button) => {
      button.removeEventListener('click', onSectionClick);
    });
    scroll.removeEventListener('scroll', onScroll);
    scroll.removeEventListener('wheel', onUserScrollIntent);
    scroll.removeEventListener('touchstart', onUserScrollIntent);
    requestButton?.removeEventListener('click', onRequestClick);
  };
}

export function initProjectDeeper() {
  const cleanups = [
    ...[...document.querySelectorAll<HTMLFormElement>('[data-project-deeper-form]')].map(
      initAccessForm,
    ),
    ...[...document.querySelectorAll<HTMLElement>('[data-project-deeper-sections]')].map(
      initSectionsPanel,
    ),
  ];

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

export function initProjectDeeperState() {
  let cleanup: (() => void) | undefined;

  const run = () => {
    cleanup?.();
    cleanup = initProjectDeeper();
  };

  run();
  document.addEventListener('astro:page-load', run);
}
