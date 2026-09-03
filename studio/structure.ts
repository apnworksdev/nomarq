import type { StructureResolver } from 'sanity/structure';

import { defaultLanguage } from './lib/i18n';

const singletonListItem = (
  S: Parameters<StructureResolver>[0],
  typeName: string,
  title: string,
) =>
  S.listItem()
    .title(title)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title));

const localizedDocumentList = (
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
        .filter(
          `_type == "${typeName}" && (!defined(language) || language == "${defaultLanguage}")`,
        )
        .defaultOrdering(ordering),
    );

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      singletonListItem(S, 'home', 'Home'),
      singletonListItem(S, 'about', 'About'),
      singletonListItem(S, 'footer', 'Footer'),
      S.listItem()
        .title('Legal')
        .child(
          S.list()
            .title('Legal')
            .items([
              singletonListItem(S, 'privacyPolicy', 'Privacy Policy'),
              singletonListItem(S, 'legalNotice', 'Legal Notice'),
              singletonListItem(S, 'cookiesPolicy', 'Cookies Policy'),
            ]),
        ),
      S.divider(),
      localizedDocumentList(S, 'project', 'Projects', [{ field: 'year', direction: 'desc' }]),
      localizedDocumentList(S, 'journal', 'Expanded Practice', [{ field: 'year', direction: 'desc' }]),
      S.divider(),
      S.listItem()
        .title('People')
        .child(
          S.documentTypeList('person')
            .title('People')
            .defaultOrdering([{ field: 'name', direction: 'asc' }]),
        ),
      S.listItem()
        .title('Uses')
        .child(
          S.documentTypeList('use')
            .title('Uses')
            .defaultOrdering([{ field: 'titleEn', direction: 'asc' }]),
        ),
    ]);
