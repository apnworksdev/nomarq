export type HomeSectionParent = {
  sectionType?: 'project' | 'journal';
  layout?: 'vertical' | 'horizontal';
};

export const startingColumnValues = (parent?: HomeSectionParent): string[] => {
  if (parent?.sectionType === 'journal') {
    return ['1', '2'];
  }

  if (parent?.sectionType === 'project' && parent.layout === 'vertical') {
    return ['1', '2', '3', '4', '5'];
  }

  if (parent?.sectionType === 'project' && parent.layout === 'horizontal') {
    return ['1', '2', '3'];
  }

  return [];
};

export const startingColumnList = (parent?: HomeSectionParent) =>
  startingColumnValues(parent).map((value) => ({
    title: value,
    value,
  }));

export const normalizeStartingColumn = (value: unknown): string | undefined => {
  if (value == null || value === '') {
    return undefined;
  }

  return String(value);
};

export const resolveStartingColumn = (
  section: HomeSectionParent & {
    startingColumn?: unknown;
    verticalCount?: unknown;
    horizontalCount?: unknown;
    journalCount?: unknown;
  },
): string | undefined => {
  const legacy =
    section.verticalCount ?? section.horizontalCount ?? section.journalCount;

  return normalizeStartingColumn(section.startingColumn ?? legacy);
};
