import type { LocalizedUse } from '../use';

export const usesQuery = `*[_type == "use"] | order(titleEn asc) {
  titleEn,
  titleEs,
  "slug": slug.current
}`;

export type UseDocument = LocalizedUse & {
  slug: string;
};
