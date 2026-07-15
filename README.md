# Nomarq

Astro + Sanity portfolio for the Nomarq architecture studio.

## Structure

```
nomarq-web/
├── web/      # Astro frontend (public site)
└── studio/   # Sanity Studio (content editing)
```

## Setup

### 1. Create a Sanity project

1. Go to [sanity.io/manage](https://www.sanity.io/manage) and create a new project.
2. Note your **Project ID** and use `production` as the dataset (default).

### 2. Configure environment variables

```bash
cp studio/.env.example studio/.env
cp web/.env.example web/.env
```

Replace `your-project-id` in both files with your Sanity project ID.

### 3. Install dependencies

```bash
cd studio && npm install
cd ../web && npm install
```

### 4. Run Sanity Studio

```bash
cd studio
npm run dev
```

Open [http://localhost:3333](http://localhost:3333) to edit content.

### 5. Run the Astro site

In a second terminal:

```bash
cd web
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Languages (EN / ES)

Both Astro and Sanity use the same locale ids: `en` (default) and `es`.

### Astro routing

| Page | English | Spanish |
|------|---------|---------|
| Highlights | `/` | `/es` |
| Projects | `/projects` | `/es/projects` |
| Project detail | `/projects/[slug]` | `/es/projects/[slug]` |
| About | `/about` | `/es/about` |

- Config: `web/astro.config.mjs` (`prefixDefaultLocale: false` — English has no prefix)
- Shared page logic: `web/src/views/`
- Locale helpers: `web/src/lib/i18n.ts`, `web/src/lib/locale.ts`, `web/src/lib/ui.ts`
- View Transitions: `<ClientRouter />` in `Layout.astro`; header persists and updates active nav client-side

### Sanity localization

Document-level translations via `@sanity/document-internationalization`:

- **Localized types:** project, journal, home, about (one document per language, linked in Studio)
- **Field-level i18n:** use, person (one document with EN + ES title/position fields)
- Config: `studio/sanity.config.ts` and `studio/lib/i18n.ts`

**In Studio:** open an English document → use the **Translations** panel to create or edit the Spanish version.

Existing documents without a `language` field are treated as English until you publish them again.

Keep `studio/lib/i18n.ts` and `web/src/lib/i18n.ts` in sync when adding languages.

## Sanity content model

### Documents

- **Project** — title, slug, location, uses, year, collaborators, photography, description, images (max 6)
- **Journal** — title, slug, category, year, metadata, description, optional external link, images (max 6)
- **Person** — name, position (`positionEn`, `positionEs`)
- **Use** — taxonomy tags for project filters (`titleEn`, `titleEs`, shared slug)

### Singletons

- **Home** — ordered sections referencing projects or journal entries, each with layout and starting column options
- **About** — video, contact info, image swiper, recognitions/initiatives lists, team areas

### Shared objects

- **imageWithAlt** — image with optional alt text
- **location** — place + country (full/short)
- **homeSection** — project or journal block with layout settings
- **teamSection** — area title + ordered person references

## Astro site

Currently implemented:

- Highlights (`/` and `/es`)
- Projects index (`/projects` and `/es/projects`)
- Project detail pages with gallery, location, and alt text fallbacks
- About placeholder (`/about` and `/es/about`)
- Header with locale switcher and active nav states

Not yet implemented on the frontend:

- Home sections layout (from Sanity Home singleton)
- Journal pages
- About page content (team, swiper, lists, contact from Sanity)

Content is fetched from Sanity at build time (`npm run build` in `web/`).

## Deploy

- **Web:** deploy the `web/` folder to Vercel, Netlify, or Cloudflare Pages
- **Studio:** run `npm run deploy` from `studio/` to host at `*.sanity.studio`

Add a Sanity webhook later to trigger rebuilds when content is published.
