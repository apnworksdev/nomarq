/** Sanity year fields are sometimes strings ("2021") and sometimes numbers. */
export function formatYear(year: string | number | null | undefined): string | undefined {
  if (year == null || year === '') {
    return undefined;
  }

  const value = String(year).trim();
  return value || undefined;
}
