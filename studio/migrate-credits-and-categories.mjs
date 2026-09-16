/**
 * Create photographer / collaborator / journalCategory documents and
 * convert string fields on project + journal into references.
 *
 * Run from studio/:
 *   npx sanity exec migrate-credits-and-categories.mjs --with-user-token
 */

import sanityCli from 'sanity/cli';

const { getCliClient } = sanityCli;

const JOURNAL_CATEGORIES = [
  { slug: 'prize', titleEn: 'Prize', titleEs: 'Premio', section: 'recognition' },
  { slug: 'press', titleEn: 'Press', titleEs: 'Prensa', section: 'recognition' },
  { slug: 'conferences', titleEn: 'Conferences', titleEs: 'Conferencias', section: 'recognition' },
  { slug: 'editorial', titleEn: 'Editorial', titleEs: 'Editorial', section: 'initiatives' },
  { slug: 'exhibition', titleEn: 'Exhibition', titleEs: 'Exposición', section: 'initiatives' },
  { slug: 'events', titleEn: 'Events', titleEs: 'Eventos', section: 'initiatives' },
];

const client = getCliClient({ apiVersion: '2024-01-01' }).config({
  perspective: 'raw',
});

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function splitNames(value) {
  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split(/[\n,]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function isReferenceArray(value) {
  return Array.isArray(value) && value.some((item) => item && typeof item._ref === 'string');
}

function refsFromNames(names, idForName) {
  const seen = new Set();
  const refs = [];

  for (const name of names) {
    const id = idForName(name);

    if (!id || seen.has(id)) {
      continue;
    }

    seen.add(id);
    refs.push({ _type: 'reference', _ref: id, _key: id.replace(/[^a-z0-9]/g, '').slice(0, 32) });
  }

  return refs;
}

const photographerId = (name) => `photographer-${slugify(name)}`;
const collaboratorId = (name) => `collaborator-${slugify(name)}`;
const categoryId = (slug) => `journalCategory-${slug}`;

const docs = await client.fetch(`*[_type in ["project", "journal"]]{
  _id,
  _type,
  photography,
  collaborators,
  category
}`);

const photographers = new Map();
const collaborators = new Map();

for (const doc of docs) {
  if (!isReferenceArray(doc.photography)) {
    for (const name of splitNames(doc.photography)) {
      photographers.set(photographerId(name), name);
    }
  }

  if (!isReferenceArray(doc.collaborators)) {
    for (const name of splitNames(doc.collaborators)) {
      collaborators.set(collaboratorId(name), name);
    }
  }
}

let tx = client.transaction();
let created = 0;
let patched = 0;

for (const category of JOURNAL_CATEGORIES) {
  tx.createIfNotExists({
    _id: categoryId(category.slug),
    _type: 'journalCategory',
    titleEn: category.titleEn,
    titleEs: category.titleEs,
    slug: { _type: 'slug', current: category.slug },
    section: category.section,
  });
  created += 1;
}

for (const [id, name] of photographers) {
  tx.createIfNotExists({
    _id: id,
    _type: 'photographer',
    name,
  });
  created += 1;
}

for (const [id, name] of collaborators) {
  tx.createIfNotExists({
    _id: id,
    _type: 'collaborator',
    name,
  });
  created += 1;
}

for (const doc of docs) {
  const patch = {};

  if (typeof doc.category === 'string' && JOURNAL_CATEGORIES.some((item) => item.slug === doc.category)) {
    patch.category = { _type: 'reference', _ref: categoryId(doc.category) };
  }

  if (!isReferenceArray(doc.photography) && typeof doc.photography === 'string') {
    patch.photography = refsFromNames(splitNames(doc.photography), photographerId);
  }

  if (!isReferenceArray(doc.collaborators) && typeof doc.collaborators === 'string') {
    patch.collaborators = refsFromNames(splitNames(doc.collaborators), collaboratorId);
  }

  if (Object.keys(patch).length === 0) {
    continue;
  }

  tx.patch(doc._id, { set: patch });
  patched += 1;
}

await tx.commit({ autoGenerateArrayKeys: true, visibility: 'async' });

console.log(
  JSON.stringify(
    {
      createdCategories: JOURNAL_CATEGORIES.length,
      createdPhotographers: photographers.size,
      createdCollaborators: collaborators.size,
      patchedDocuments: patched,
      queuedCreates: created,
    },
    null,
    2,
  ),
);
