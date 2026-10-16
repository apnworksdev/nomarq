import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

import { sanity } from './sanity';

const builder = createImageUrlBuilder(sanity);
const IMAGE_QUALITY = 90;

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function imageUrl(source: SanityImageSource, width: number) {
  return urlFor(source).width(width).fit('max').auto('format').quality(IMAGE_QUALITY).url();
}

export function responsiveImage(
  source: SanityImageSource,
  widths: number[],
  sizes: string,
) {
  const sorted = [...widths].sort((left, right) => left - right);
  const fallback = sorted[Math.min(1, sorted.length - 1)] ?? sorted[0] ?? 1600;

  return {
    src: imageUrl(source, fallback),
    srcset: sorted.map((width) => `${imageUrl(source, width)} ${width}w`).join(', '),
    sizes,
  };
}
