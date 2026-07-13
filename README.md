# Nomarq

Minimal Astro + Sanity MVP for an architecture studio portfolio.

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

Open [http://localhost:3333](http://localhost:3333), create a few **Project** documents, and publish them.

### 5. Run the Astro site

In a second terminal:

```bash
cd web
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) to see your projects.

## What's included

- **Sanity schema:** `project` (title, slug, description, image)
- **Astro pages:** home (project list) and `/projects/[slug]` (project detail)
- **Build-time fetching:** content is pulled from Sanity when you run `npm run build`

## Deploy

- **Web:** deploy the `web/` folder to Vercel, Netlify, or Cloudflare Pages
- **Studio:** run `npm run deploy` from `studio/` to host at `*.sanity.studio`

Add a Sanity webhook later to trigger rebuilds when content is published.
