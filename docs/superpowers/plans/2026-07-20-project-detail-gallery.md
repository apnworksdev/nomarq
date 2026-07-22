# Project Detail Gallery Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Shared entry gallery CSS/component + project detail layout with tech info and hover/click image selection.

**Architecture:** Extract media/gallery visuals into `EntryGallery` + `entry-gallery.css`. HomeSection migrates to shared classes. Project page uses interactive gallery + technical info from Sanity.

**Tech Stack:** Astro, Sanity GROQ, vanilla TS client script, existing CSS variables/grid.

## File map

| File | Role |
|------|------|
| `web/src/styles/components/entry-gallery.css` | Shared media + gallery strip |
| `web/src/components/EntryGallery.astro` | Cover + optional strip + counter |
| `web/src/lib/project-gallery.ts` | Hover preview / click commit |
| `web/src/lib/queries.ts` | Fetch use, year, collaborators, photography |
| `web/src/lib/ui.ts` | Technical info labels |
| `web/src/components/HomeSection.astro` | Use EntryGallery |
| `web/src/styles/pages/home.css` | Keep overlay/expand only |
| `web/src/views/ProjectDetailPage.astro` | New layout |
| `web/src/styles/pages/project.css` | Project grid + tech info |

## Tasks

### Task 1: Shared gallery styles + component

Extract `.entry-media` / `.entry-gallery` from home; create `EntryGallery.astro`.

### Task 2: Migrate HomeSection

Use EntryGallery; home.css only keeps positioning/expand rules.

### Task 3: Queries + UI strings

Extend `Project` type and `projectBySlugQuery`; add technical labels to `ui.ts`.

### Task 4: Project page layout + interaction

Rebuild ProjectDetailPage; add `project-gallery.ts`; style tech info and 4-col media.
