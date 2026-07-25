/** Maps legacy Sanity use slugs to current filter slugs. */
const LEGACY_USE_SLUG_ALIASES: Record<string, string> = {
  residential: 'homes',
  'creative-space': 'workspaces',
};

export function normalizeProjectUseSlugs(slugs: string[]): string[] {
  const normalized = slugs.map((slug) => LEGACY_USE_SLUG_ALIASES[slug] ?? slug);

  return [...new Set(normalized)];
}
