const VISIBLE_THUMB_MAX = 6;
const MOBILE_MQ = '(max-width: 820px)';
const SWIPE_THRESHOLD_PX = 36;
const SWIPE_DURATION_MS = 380;

type GalleryImage = {
  src: string;
  thumbSrc: string;
  alt: string;
  originalIndex: number;
};

function isMobileViewport() {
  return window.matchMedia(MOBILE_MQ).matches;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

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

function waitForTransition(el: HTMLElement, propertyName: string) {
  return new Promise<void>((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;
      el.removeEventListener('transitionend', onEnd);
      window.clearTimeout(timer);
      resolve();
    };

    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName === propertyName && event.target === el) {
        finish();
      }
    };

    el.addEventListener('transitionend', onEnd);
    const timer = window.setTimeout(finish, SWIPE_DURATION_MS + 80);
  });
}

function ensureFadeLayer(media: HTMLElement) {
  const existing = media.querySelector<HTMLImageElement>('[data-entry-fade]');
  if (existing) {
    return existing;
  }

  const layer = document.createElement('img');
  layer.dataset.entryFade = '';
  layer.alt = '';
  layer.setAttribute('aria-hidden', 'true');
  layer.decoding = 'async';
  media.appendChild(layer);
  return layer;
}

function fadeLayerCleanup(main: HTMLImageElement) {
  const media = main.closest<HTMLElement>('[data-entry-media]');
  media?.classList.remove('is-swiping');
  media?.querySelectorAll('[data-entry-fade]').forEach((node) => node.remove());
  main.style.transition = '';
  main.style.transform = '';
  main.style.cursor = '';
}

/** direction: 1 = next (swipe left), -1 = previous (swipe right) */
async function showImageMobile(
  main: HTMLImageElement,
  counter: HTMLElement | null,
  image: GalleryImage,
  direction: 1 | -1,
) {
  if (counter) {
    counter.textContent = padIndex(image.originalIndex);
  }

  if (image.alt) {
    main.alt = image.alt;
  }

  const current = main.getAttribute('src') || '';
  if (current === image.src || main.currentSrc === image.src) {
    return;
  }

  const media = main.closest<HTMLElement>('[data-entry-media]');
  if (!media || prefersReducedMotion()) {
    main.src = image.src;
    return;
  }

  const layer = ensureFadeLayer(media);

  // Place incoming slide off-screen in the swipe direction.
  media.classList.add('is-swiping');
  layer.style.transition = 'none';
  main.style.transition = 'none';
  layer.style.transform = `translate3d(${direction * 100}%, 0, 0)`;
  main.style.transform = 'translate3d(0, 0, 0)';
  layer.src = image.src;

  try {
    await layer.decode();
  } catch {
    // Still animate if decode fails.
  }

  void layer.offsetWidth;

  layer.style.transition = '';
  main.style.transition = '';
  layer.style.transform = 'translate3d(0, 0, 0)';
  main.style.transform = `translate3d(${direction * -100}%, 0, 0)`;

  await Promise.all([waitForTransition(main, 'transform'), waitForTransition(layer, 'transform')]);

  main.style.transition = 'none';
  layer.style.transition = 'none';
  main.src = image.src;
  main.style.transform = 'translate3d(0, 0, 0)';
  layer.style.transform = `translate3d(${direction * 100}%, 0, 0)`;
  void main.offsetWidth;
  main.style.transition = '';
  layer.style.transition = '';
  media.classList.remove('is-swiping');
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

function renderVisibleThumbs(
  gallery: HTMLElement,
  images: GalleryImage[],
  visibleMax: number,
  activeIndex = 0,
) {
  const visible = images.slice(0, visibleMax);
  let thumbs = getThumbElements(gallery);

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
    thumb.classList.toggle('is-active', index === activeIndex);

    const img = thumb.querySelector('img');
    if (img) {
      img.src = image.thumbSrc;
      img.alt = image.alt;
    }
  });

  return getThumbElements(gallery);
}

function preloadGalleryImages(images: GalleryImage[], skipSrc?: string) {
  const urls = [
    ...new Set(
      images.map((image) => image.src).filter((src) => Boolean(src) && src !== skipSrc),
    ),
  ];

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

function scrollThumbIntoView(thumb: HTMLElement | undefined) {
  thumb?.scrollIntoView({
    behavior: 'smooth',
    inline: 'center',
    block: 'nearest',
  });
}

function initDesktopGallery(
  main: HTMLImageElement,
  gallery: HTMLElement,
  counter: HTMLElement | null,
  images: GalleryImage[],
) {
  let rotated = images;
  let thumbs = renderVisibleThumbs(gallery, rotated, VISIBLE_THUMB_MAX, 0);
  let committedIndex = 0;
  let previewIndex: number | null = null;

  main.style.cursor = 'pointer';

  const commit = (visibleIndex: number) => {
    rotated = rotateImages(rotated, visibleIndex);
    thumbs = renderVisibleThumbs(gallery, rotated, VISIBLE_THUMB_MAX, 0);
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
    fadeLayerCleanup(main);
  };
}

function initMobileGallery(
  main: HTMLImageElement,
  gallery: HTMLElement,
  counter: HTMLElement | null,
  images: GalleryImage[],
) {
  const media = main.closest<HTMLElement>('[data-entry-media]') ?? main;
  let activeIndex = 0;
  let thumbs = renderVisibleThumbs(gallery, images, images.length, activeIndex);
  let touchStartX = 0;
  let touchStartY = 0;
  let touchAxis: 'x' | 'y' | null = null;
  let animating = false;

  main.style.cursor = 'default';

  const goTo = async (index: number, direction: 1 | -1) => {
    if (animating || images.length < 2) {
      return;
    }

    const next = ((index % images.length) + images.length) % images.length;
    const image = images[next];
    if (!image || next === activeIndex) {
      return;
    }

    activeIndex = next;
    setActiveThumb(thumbs, next);
    scrollThumbIntoView(thumbs[next]);

    animating = true;
    await showImageMobile(main, counter, image, direction);
    animating = false;
  };

  const onThumbClick = (event: MouseEvent) => {
    const thumb = (event.target as Element | null)?.closest<HTMLElement>('[data-entry-thumb]');
    if (!thumb || !gallery.contains(thumb)) {
      return;
    }

    const index = Number(thumb.dataset.entryIndex);
    if (Number.isNaN(index) || index === activeIndex) {
      return;
    }

    void goTo(index, index > activeIndex ? 1 : -1);
  };

  const onTouchStart = (event: TouchEvent) => {
    if (animating || event.touches.length !== 1) {
      return;
    }

    touchStartX = event.touches[0]?.clientX ?? 0;
    touchStartY = event.touches[0]?.clientY ?? 0;
    touchAxis = null;
  };

  const onTouchMove = (event: TouchEvent) => {
    if (animating || event.touches.length !== 1 || touchAxis === 'y') {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (!touchAxis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
        return;
      }

      touchAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }

    if (touchAxis === 'x') {
      event.preventDefault();
    }
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (animating || event.changedTouches.length !== 1) {
      touchAxis = null;
      return;
    }

    const touch = event.changedTouches[0];
    if (!touch) {
      touchAxis = null;
      return;
    }

    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    const axis = touchAxis;
    touchAxis = null;

    if (axis === 'y') {
      return;
    }

    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) {
      return;
    }

    void goTo(activeIndex + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  };

  media.addEventListener('touchstart', onTouchStart, { passive: true });
  media.addEventListener('touchmove', onTouchMove, { passive: false });
  media.addEventListener('touchend', onTouchEnd, { passive: true });
  gallery.addEventListener('click', onThumbClick);

  return () => {
    media.removeEventListener('touchstart', onTouchStart);
    media.removeEventListener('touchmove', onTouchMove);
    media.removeEventListener('touchend', onTouchEnd);
    gallery.removeEventListener('click', onThumbClick);
    fadeLayerCleanup(main);
  };
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

  if (isMobileViewport()) {
    return initMobileGallery(main, gallery, counter, images);
  }

  return initDesktopGallery(main, gallery, counter, images);
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
  const mediaQuery = window.matchMedia(MOBILE_MQ);

  const run = () => {
    cleanup?.();
    cleanup = initEntryGallery();
  };

  run();
  mediaQuery.addEventListener('change', run);
  document.addEventListener('astro:page-load', run);
}
