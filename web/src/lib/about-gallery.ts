const GALLERY_SELECTOR = '[data-about-gallery]';
const SLIDE_SELECTOR = '[data-about-gallery-slide]';

const EDGE_PX = 2;

function maxScroll(gallery: HTMLElement) {
  return Math.max(gallery.scrollWidth - gallery.clientWidth, 0);
}

function slideLeft(gallery: HTMLElement, slide: HTMLElement) {
  const galleryRect = gallery.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  return slideRect.left - galleryRect.left + gallery.scrollLeft;
}

function currentIndex(gallery: HTMLElement, slides: HTMLElement[]) {
  const left = gallery.scrollLeft;
  let index = 0;

  slides.forEach((slide, slideIndex) => {
    if (slideLeft(gallery, slide) <= left + EDGE_PX) {
      index = slideIndex;
    }
  });

  return index;
}

function stepGallery(gallery: HTMLElement, slides: HTMLElement[], direction: -1 | 1) {
  const max = maxScroll(gallery);
  const index = currentIndex(gallery, slides);
  let left = gallery.scrollLeft;

  if (direction > 0) {
    const next = slides[index + 1];
    left = next ? Math.min(slideLeft(gallery, next), max) : max;
  } else {
    const currentLeft = slideLeft(gallery, slides[index] ?? gallery);
    if (gallery.scrollLeft - currentLeft > EDGE_PX) {
      left = currentLeft;
    } else {
      const previous = slides[index - 1];
      left = previous ? slideLeft(gallery, previous) : 0;
    }
  }

  if (Math.abs(left - gallery.scrollLeft) <= EDGE_PX) {
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gallery.scrollTo({
    left,
    behavior: reduceMotion ? 'auto' : 'smooth',
  });
}

function syncCursor(gallery: HTMLElement, clientX: number | null) {
  gallery.classList.remove('is-nav-prev', 'is-nav-next');

  if (clientX === null || maxScroll(gallery) <= EDGE_PX) {
    return;
  }

  const rect = gallery.getBoundingClientRect();
  const onRight = clientX - rect.left > rect.width / 2;
  const canNext = gallery.scrollLeft < maxScroll(gallery) - EDGE_PX;
  const canPrev = gallery.scrollLeft > EDGE_PX;

  if (onRight && canNext) {
    gallery.classList.add('is-nav-next');
  } else if (!onRight && canPrev) {
    gallery.classList.add('is-nav-prev');
  }
}

export function initAboutGallery() {
  const cleanups: Array<() => void> = [];

  document.querySelectorAll<HTMLElement>(GALLERY_SELECTOR).forEach((gallery) => {
    const slides = [...gallery.querySelectorAll<HTMLElement>(SLIDE_SELECTOR)];

    if (slides.length === 0) {
      return;
    }

    let pointerX: number | null = null;

    const onPointer = (event: PointerEvent) => {
      pointerX = event.clientX;
      syncCursor(gallery, pointerX);
    };

    const onLeave = () => {
      pointerX = null;
      syncCursor(gallery, null);
    };

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) {
        return;
      }

      const rect = gallery.getBoundingClientRect();
      const direction = event.clientX - rect.left > rect.width / 2 ? 1 : -1;
      stepGallery(gallery, slides, direction);
    };

    const onScroll = () => {
      syncCursor(gallery, pointerX);
    };

    gallery.addEventListener('pointermove', onPointer);
    gallery.addEventListener('pointerleave', onLeave);
    gallery.addEventListener('click', onClick);
    gallery.addEventListener('scroll', onScroll);

    cleanups.push(() => {
      gallery.removeEventListener('pointermove', onPointer);
      gallery.removeEventListener('pointerleave', onLeave);
      gallery.removeEventListener('click', onClick);
      gallery.removeEventListener('scroll', onScroll);
    });
  });

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}

export function initAboutGalleryState() {
  let cleanup: (() => void) | undefined;

  const run = () => {
    cleanup?.();
    cleanup = initAboutGallery();
  };

  run();
  document.addEventListener('astro:page-load', run);
}
