# Project deeper level

## Goal

Project detail pages can expose a gated “deeper level”: extra images grouped into named sections. Visitors fill a short form once (saved in localStorage), click Acceder on each project visit, then browse a scroll-snap image stack driven by section navigation and can request files (UI-only until Resend).

## Approach

Extend the existing project detail page (Approach 1). No new route. Unlock is page-session only; form fields persist globally in localStorage.

## CMS

- Project document tabs: **Main** (existing fields) and **Deeper Level**
- `deeperSections[]` of `{ name: string, images: imageWithAlt[] }`
- Section `name` is written per language document (document-level i18n)
- Frontend only shows deeper UI when ≥1 section has ≥1 image

## UI states

**Locked (default):** public gallery unchanged; “More information” form with name, profile, phone, location, email + Acceder. Prefill from localStorage. All five required.

**Unlocked (after Acceder):** public gallery replaced by vertical scroll-snap stack of all deeper images (section order). Form replaced by numbered section links + “Solicitar archivos”. No exit control — leave the page to reset.

**Section sync:** click section → scroll to that section’s first image; scroll → active section updates via intersection / snap position.

**Request files:** click swaps button text to “tu peticion ha sido enviada correctamente” (no backend yet).

## Architecture

- Studio: `deeperSection` object + project field/group
- GROQ/types: coalesce translated `deeperSections`
- `EntryDetailPage` optional deeper props (projects only)
- `project-deeper.ts`: localStorage, validation, unlock, scroll sync, request UI
- Copy in `ui.ts` (EN/ES)
- Storage key: `nomarq-deeper-access` → `{ name, profile, phone, location, email }`

## Out of scope

- Resend / email delivery
- Exit-deeper control
- Cookies (localStorage only)
- Auto-unlock across projects
