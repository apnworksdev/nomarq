export type ImageWithAlt = {
  alt?: string;
};

export function imageAlt(
  alt: string | undefined,
  fallback: string,
  options?: { index?: number },
): string {
  const trimmed = alt?.trim();

  if (trimmed) {
    return trimmed;
  }

  if (options?.index !== undefined) {
    return `${fallback} — image ${options.index + 1}`;
  }

  return fallback;
}
