const VISIBLE_THUMB_MAX = 6;

type GalleryImage = {
  src: string;
  thumbSrc: string;
  alt: string;
  originalIndex: number;
};

function padIndex(index: number) {
  return String(index + 1).padStart(2, '0');
}

function readGalleryImages(gallery: HTMLElement): GalleryImage[] {
  const raw = gallery.dataset.entryGalleryImages;

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as GalleryImage[];
  } catch {
    return [];
  }
}

function setActiveThumb(thumbs: HTMLElement[], index: number) {
  thumbs.forEach((thumb, thumbIndex) => {
    thumb.classList.toggle('is-active', thumbIndex === index);
  });
}

function showImage(
  main: HTMLImageElement,
  counter: HTMLElement | null,
  image: GalleryImage,
) {
  main.src = image.src;
  if (image.alt) {
    main.alt = image.alt;
  }

  if (counter) {
    counter.textContent = padIndex(image.originalIndex);
  }
}

function rotateImages(images: GalleryImage[], visibleIndex: number): GalleryImage[] {
  if (visibleIndex <= 0 || visibleIndex >= images.length) {
    return images;
  }

  return [...images.slice(visibleIndex), ...images.slice(0, visibleIndex)];
}

function getThumbElements(gallery: HTMLElement): HTMLElement[] {
  return [...gallery.querySelectorAll<HTMLElement>('[data-entry-thumb]')];
}

function renderVisibleThumbs(gallery: HTMLElement, images: GalleryImage[]) {
  const visible = images.slice(0, VISIBLE_THUMB_MAX);
  let thumbs = getThumbElements(gallery);

  // Grow or shrink the thumbnail list to match the visible window.
  while (thumbs.length < visible.length) {
    const template = thumbs[0];
    if (!template) {
      break;
    }

    const clone = template.cloneNode(true) as HTMLElement;
    gallery.appendChild(clone);
    thumbs = getThumbElements(gallery);
  }

  while (thumbs.length > visible.length) {
    thumbs[thumbs.length - 1]?.remove();
    thumbs = getThumbElements(gallery);
  }

  visible.forEach((image, index) => {
    const thumb = thumbs[index];
    if (!thumb) {
      return;
    }

    thumb.dataset.entrySrc = image.src;
    thumb.dataset.entryAlt = image.alt;
    thumb.dataset.entryIndex = String(index);
    thumb.dataset.entryOriginalIndex = String(image.originalIndex);
    thumb.classList.toggle('is-active', index === 0);

    const img = thumb.querySelector('img');
    if (img) {
      img.src = image.thumbSrc;
      img.alt = image.alt;
    }
  });

  return getThumbElements(gallery);
}

function preloadGalleryImages(images: GalleryImage[], skipSrc?: string) {
  const urls = [...new Set(
    images
      .map((image) => image.src)
      .filter((src) => Boolean(src) && src !== skipSrc),
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

  if (!main || !gallery) {
    return () => undefined;
  }

  let images = readGalleryImages(gallery);

  if (images.length === 0) {
    // Fallback for markup without the full image payload.
    images = getThumbElements(gallery).flatMap((thumb, index) => {
      const src = thumb.dataset.entrySrc;
      if (!src) {
        return [];
      }

      const img = thumb.querySelector('img');

      return [
        {
          src,
          thumbSrc: img?.currentSrc || img?.src || src,
          alt: thumb.dataset.entryAlt ?? '',
          originalIndex: Number(thumb.dataset.entryOriginalIndex ?? index),
        },
      ];
    });
  }

  if (images.length === 0) {
    return () => undefined;
  }

  preloadGalleryImages(images, main.currentSrc || main.src);

  let rotated = images;
  let thumbs = renderVisibleThumbs(gallery, rotated);
  let committedIndex = 0;
  let previewIndex: number | null = null;

  main.style.cursor = 'pointer';

  const commit = (visibleIndex: number) => {
    rotated = rotateImages(rotated, visibleIndex);
    thumbs = renderVisibleThumbs(gallery, rotated);
    committedIndex = 0;
    previewIndex = null;
    showImage(main, counter, rotated[0]);
    setActiveThumb(thumbs, 0);
  };

  const preview = (visibleIndex: number) => {
    const image = rotated[visibleIndex];
    if (!image) {
      return;
    }

    previewIndex = visibleIndex;
    showImage(main, counter, image);
    setActiveThumb(thumbs, visibleIndex);
  };

  const revert = () => {
    if (previewIndex === null || previewIndex === committedIndex) {
      previewIndex = null;
      setActiveThumb(thumbs, committedIndex);
      return;
    }

    previewIndex = null;
    const image = rotated[committedIndex];
    if (image) {
      showImage(main, counter, image);
      setActiveThumb(thumbs, committedIndex);
    }
  };

  const onMainClick = () => {
    if (rotated.length < 2) {
      return;
    }

    commit(1);
  };

  const onThumbEnter = (event: MouseEvent) => {
    const thumb = (event.target as Element | null)?.closest<HTMLElement>('[data-entry-thumb]');
    if (!thumb || !gallery.contains(thumb)) {
      return;
    }

    const related = event.relatedTarget;
    if (related instanceof Node && thumb.contains(related)) {
      return;
    }

    const index = Number(thumb.dataset.entryIndex);
    if (Number.isNaN(index)) {
      return;
    }

    preview(index);
  };

  const onThumbClick = (event: MouseEvent) => {
    const thumb = (event.target as Element | null)?.closest<HTMLElement>('[data-entry-thumb]');
    if (!thumb || !gallery.contains(thumb)) {
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

  main.addEventListener('click', onMainClick);
  gallery.addEventListener('mouseover', onThumbEnter);
  gallery.addEventListener('click', onThumbClick);
  gallery.addEventListener('mouseleave', onGalleryLeave);

  return () => {
    main.removeEventListener('click', onMainClick);
    gallery.removeEventListener('mouseover', onThumbEnter);
    gallery.removeEventListener('click', onThumbClick);
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
