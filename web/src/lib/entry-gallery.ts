function padIndex(index: number) {
  return String(index + 1).padStart(2, '0');
}

function setActiveThumb(thumbs: NodeListOf<HTMLElement>, index: number) {
  thumbs.forEach((thumb, thumbIndex) => {
    thumb.classList.toggle('is-active', thumbIndex === index);
  });
}

function showImage(
  main: HTMLImageElement,
  counter: HTMLElement | null,
  thumb: HTMLElement,
  index: number,
) {
  const src = thumb.dataset.entrySrc;
  const alt = thumb.dataset.entryAlt;

  if (!src) {
    return;
  }

  main.src = src;
  if (alt) {
    main.alt = alt;
  }

  if (counter) {
    counter.textContent = padIndex(index);
  }
}

function preloadGalleryImages(thumbs: NodeListOf<HTMLElement>, skipSrc?: string) {
  const urls = [...new Set(
    [...thumbs]
      .map((thumb) => thumb.dataset.entrySrc)
      .filter((src): src is string => Boolean(src) && src !== skipSrc),
  )];

  const start = () => {
    for (const src of urls) {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
    }
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(start, { timeout: 2000 });
    return;
  }

  window.setTimeout(start, 1);
}

function initGallery(root: HTMLElement) {
  const main = root.querySelector<HTMLImageElement>('[data-entry-main]');
  const gallery = root.querySelector<HTMLElement>('[data-entry-gallery]');
  const counter = root.querySelector<HTMLElement>('[data-entry-counter-current]');
  const thumbs = root.querySelectorAll<HTMLElement>('[data-entry-thumb]');

  if (!main || !gallery || thumbs.length === 0) {
    return () => undefined;
  }

  preloadGalleryImages(thumbs, main.currentSrc || main.src);

  let committedIndex = 0;
  let previewIndex: number | null = null;

  const commit = (index: number) => {
    const thumb = thumbs[index];
    if (!thumb) {
      return;
    }

    committedIndex = index;
    previewIndex = null;
    showImage(main, counter, thumb, index);
    setActiveThumb(thumbs, index);
  };

  const preview = (index: number) => {
    const thumb = thumbs[index];
    if (!thumb) {
      return;
    }

    previewIndex = index;
    showImage(main, counter, thumb, index);
    setActiveThumb(thumbs, index);
  };

  const revert = () => {
    if (previewIndex === null || previewIndex === committedIndex) {
      previewIndex = null;
      setActiveThumb(thumbs, committedIndex);
      return;
    }

    previewIndex = null;
    const thumb = thumbs[committedIndex];
    if (thumb) {
      showImage(main, counter, thumb, committedIndex);
      setActiveThumb(thumbs, committedIndex);
    }
  };

  const onThumbEnter = (event: Event) => {
    const thumb = event.currentTarget;
    if (!(thumb instanceof HTMLElement)) {
      return;
    }

    const index = Number(thumb.dataset.entryIndex);
    if (Number.isNaN(index)) {
      return;
    }

    preview(index);
  };

  const onThumbClick = (event: Event) => {
    const thumb = event.currentTarget;
    if (!(thumb instanceof HTMLElement)) {
      return;
    }

    const index = Number(thumb.dataset.entryIndex);
    if (Number.isNaN(index)) {
      return;
    }

    commit(index);
  };

  const onGalleryLeave = (event: MouseEvent) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && gallery.contains(nextTarget)) {
      return;
    }

    revert();
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener('mouseenter', onThumbEnter);
    thumb.addEventListener('click', onThumbClick);
  });
  gallery.addEventListener('mouseleave', onGalleryLeave);

  return () => {
    thumbs.forEach((thumb) => {
      thumb.removeEventListener('mouseenter', onThumbEnter);
      thumb.removeEventListener('click', onThumbClick);
    });
    gallery.removeEventListener('mouseleave', onGalleryLeave);
  };
}

export function initEntryGallery() {
  const cleanups: Array<() => void> = [];

  document.querySelectorAll<HTMLElement>('[data-entry-gallery-root]').forEach((root) => {
    cleanups.push(initGallery(root));
  });

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}

export function initEntryGalleryState() {
  let cleanup: (() => void) | undefined;

  const run = () => {
    cleanup?.();
    cleanup = initEntryGallery();
  };

  run();
  document.addEventListener('astro:page-load', run);
}
