import type { ImageField, Project } from './queries';

export const PROJECT_GRID_COLUMNS = 8;

export type ProjectGridOrderStyle = {
  span: 1 | 2 | 3;
  maxPreviews: 3 | 4;
};

/** Fixed span + preview limits cycled by project order (index % 8). */
export const PROJECT_GRID_ORDER_STYLES: ProjectGridOrderStyle[] = [
  { span: 1, maxPreviews: 4 }, // 1 → 4
  { span: 2, maxPreviews: 4 }, // 2 → 4
  { span: 2, maxPreviews: 3 }, // 3 → 3
  { span: 3, maxPreviews: 4 }, // 4 → 4
  { span: 2, maxPreviews: 4 }, // 5 → 4
  { span: 1, maxPreviews: 4 }, // 6 → 4
  { span: 3, maxPreviews: 3 }, // 7 → 3
  { span: 2, maxPreviews: 4 }, // 8 → 4
];

export type ProjectGridPreview = {
  column: number;
  image: ImageField;
  imageIndex: number;
};

export type ProjectGridItem = {
  slug: string;
  title: string;
  place?: string;
  country?: string;
  orderIndex: number;
  row: number;
  startColumn: number;
  span: number;
  previewSide: 'left' | 'right';
  coverImage: ImageField;
  previews: ProjectGridPreview[];
};

export type ProjectGridPlacement = Pick<
  ProjectGridItem,
  'slug' | 'row' | 'startColumn' | 'span' | 'previews'
>;

export function getProjectGridOrderStyle(index: number): ProjectGridOrderStyle {
  return PROJECT_GRID_ORDER_STYLES[index % PROJECT_GRID_ORDER_STYLES.length]!;
}

function getAvailableSideColumns(
  startColumn: number,
  span: number,
): { left: number; right: number } {
  return {
    left: startColumn - 1,
    right: PROJECT_GRID_COLUMNS - (startColumn + span - 1),
  };
}

function resolvePreviewSide(startColumn: number, span: number): 'left' | 'right' {
  const { left, right } = getAvailableSideColumns(startColumn, span);
  // Prefer left when both sides have the same space.
  return left >= right ? 'left' : 'right';
}

function buildPreviewColumns(
  startColumn: number,
  span: number,
  side: 'left' | 'right',
  count: number,
): number[] {
  if (count <= 0) {
    return [];
  }

  if (side === 'right') {
    const firstColumn = startColumn + span;
    return Array.from({ length: count }, (_, index) => firstColumn + index);
  }

  const firstColumn = startColumn - count;
  return Array.from({ length: count }, (_, index) => firstColumn + index);
}

function getPreviewCount(
  imageCount: number,
  orderStyle: ProjectGridOrderStyle,
  startColumn: number,
  span: number,
  side: 'left' | 'right',
): number {
  const remainingImages = Math.max(imageCount - 1, 0);
  const available =
    side === 'left'
      ? startColumn - 1
      : PROJECT_GRID_COLUMNS - (startColumn + span - 1);

  return Math.min(remainingImages, orderStyle.maxPreviews, available);
}

type ProjectGridLayoutEntry = {
  slug: string;
  orderIndex: number;
  imageCount: number;
  images?: ImageField[];
  project?: Project;
  coverImage?: ImageField;
};

function buildProjectsGridLayoutEntries(
  entries: ProjectGridLayoutEntry[],
): ProjectGridItem[] {
  const items: ProjectGridItem[] = [];
  let column = 1;
  let row = 1;

  for (const entry of entries) {
    const { slug, orderIndex, imageCount } = entry;
    const orderStyle = getProjectGridOrderStyle(orderIndex);
    const span = orderStyle.span;

    if (column + span - 1 > PROJECT_GRID_COLUMNS) {
      row += 1;
      column = 1;
    }

    const startColumn = column;
    const previewSide = resolvePreviewSide(startColumn, span);
    const previewCount = getPreviewCount(
      imageCount,
      orderStyle,
      startColumn,
      span,
      previewSide,
    );
    const previewColumns = buildPreviewColumns(
      startColumn,
      span,
      previewSide,
      previewCount,
    );
    const previews = previewColumns.map((previewColumn, previewIndex) => ({
      column: previewColumn,
      image: entry.images?.[previewIndex + 1] ?? ({} as ImageField),
      imageIndex: previewIndex + 1,
    }));

    const project = entry.project;
    const place = project?.location?.place?.trim() || undefined;
    const country =
      project?.location?.country?.full?.trim() ||
      project?.location?.country?.short?.trim() ||
      undefined;

    items.push({
      slug,
      title: project?.title ?? '',
      place,
      country,
      orderIndex,
      row,
      startColumn,
      span,
      previewSide,
      coverImage: entry.coverImage ?? ({} as ImageField),
      previews,
    });

    column += span;

    if (column > PROJECT_GRID_COLUMNS) {
      row += 1;
      column = 1;
    }
  }

  return items;
}

export function buildProjectsGridLayout(projects: Project[]): ProjectGridItem[] {
  const entries = projects.flatMap((project, orderIndex) => {
    const images = (project.images ?? []).filter((image) => image.image);
    const coverImage = images[0];

    if (!coverImage) {
      return [];
    }

    return [
      {
        slug: project.slug,
        orderIndex,
        imageCount: images.length,
        images,
        project,
        coverImage,
      },
    ];
  });

  return buildProjectsGridLayoutEntries(entries);
}

export function buildProjectsGridPlacements(
  entries: Array<{ slug: string; orderIndex: number; imageCount: number }>,
): ProjectGridPlacement[] {
  return buildProjectsGridLayoutEntries(entries).map(
    ({ slug, row, startColumn, span, previews }) => ({
      slug,
      row,
      startColumn,
      span,
      previews,
    }),
  );
}
