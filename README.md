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

## Sanity content model

### Documents

- **Project** — title, slug, location, uses, year, collaborators, photography, description, images (max 6)
- **Journal** — title, slug, category, year, metadata, description, optional external link, images (max 6)
- **Person** — name, position
- **Use** — taxonomy tags for project filters

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

- Home project list (`/`)
- Project detail pages (`/projects/[slug]`) with gallery, location, and alt text fallbacks

Not yet implemented on the frontend:

- Home sections layout
- Journal pages
- About page (team, swiper, lists, contact)

Content is fetched from Sanity at build time (`npm run build` in `web/`).

## Deploy

- **Web:** deploy the `web/` folder to Vercel, Netlify, or Cloudflare Pages
- **Studio:** run `npm run deploy` from `studio/` to host at `*.sanity.studio`

Add a Sanity webhook later to trigger rebuilds when content is published.
