export type Location = {
  place?: string;
  country?: {
    full?: string;
    short?: string;
  };
};

export type LocationStyle = 'full' | 'short';

export function formatLocation(
  location?: Location | null,
  style: LocationStyle = 'full',
): string {
  if (!location) {
    return '';
  }

  const { place, country } = location;

  if (style === 'short') {
    if (place && country?.short) {
      return `${place} ${country.short}`;
    }

    if (place && country?.full) {
      return `${place} ${country.full}`;
    }

    return place || country?.short || country?.full || '';
  }

  if (place && country?.full) {
    return `${place} / ${country.full}`;
  }

  if (place && country?.short) {
    return `${place} / ${country.short}`;
  }

  return place || country?.full || country?.short || '';
}
