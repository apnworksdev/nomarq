import type { StructureResolver } from 'sanity/structure';

const singletonListItem = (
  S: Parameters<StructureResolver>[0],
  typeName: string,
  title: string,
) =>
  S.listItem()
    .title(title)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title));

const documentList = (
  S: Parameters<StructureResolver>[0],
  typeName: string,
  title: string,
  ordering: { field: string; direction: 'asc' | 'desc' }[],
) =>
  S.listItem()
    .title(title)
    .child(
      S.documentTypeList(typeName)
        .title(title)
        .defaultOrdering(ordering),
    );

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      singletonListItem(S, 'home', 'Home'),
      singletonListItem(S, 'about', 'About'),
      S.divider(),
      documentList(S, 'project', 'Projects', [{ field: 'year', direction: 'desc' }]),
      documentList(S, 'journal', 'Journal', [{ field: 'year', direction: 'desc' }]),
      S.divider(),
      documentList(S, 'person', 'People', [{ field: 'name', direction: 'asc' }]),
      documentList(S, 'use', 'Uses', [{ field: 'title', direction: 'asc' }]),
    ]);
