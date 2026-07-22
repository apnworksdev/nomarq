# Project detail gallery & technical info

## Goal

Project detail matches the editorial layout in the reference: 4-column media with a thumbnail selector, technical information on the right, caption + description below. Gallery visuals share CSS with the homepage so home → project transitions feel continuous.

## Approach

**Shared gallery layer (option C)** — extract media + thumbnail strip into a shared component and stylesheet. Home keeps expand/collapse behavior; project adds hover-preview / click-commit interaction.

## Shared gallery

- Component: `EntryGallery.astro`
- Styles: `styles/components/entry-gallery.css` (moved from home media/gallery rules)
- Markup: cover figure (`.entry-media`) + thumbnail strip (`.entry-gallery`)
- Home: wraps strip in existing fixed overlay; expand/collapse unchanged
- Project: cover always visible; strip always under media when 2+ images; counter `01 / 06`

## Project layout

- 8-column grid: media `span 4`; right column holds technical info + caption/description
- Caption via `EntryCaption`; description always visible (no hover expand)
- Technical block from Sanity: location, use, year, collaborators, photography
- UI labels in `ui.ts` (EN/ES); omit empty rows

## Interaction (project only)

- Hover thumbnail → temporarily swap main image + counter
- Click → commit selection
- Leave strip without click → revert to committed image
- Active thumb full opacity; others dimmed

## Out of scope

- Changing homepage expand UX
- View-transition `transition:name` wiring (CSS parity first; can add later)
