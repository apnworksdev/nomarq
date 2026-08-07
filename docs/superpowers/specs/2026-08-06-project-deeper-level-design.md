# Project priv level (separate URL)

## Goal

Priv/deeper content lives on a public sibling URL. The normal project page keeps the public gallery + access form. Acceder navigates to `/priv` (email via Resend later). Same visual design as the previous same-page unlock.

## URLs

- `/projects/[slug]/priv`
- `/es/projects/[slug]/priv`
- Public; no unlock gate. Missing priv content → redirect to normal project page.

## Pages

**Normal project:** public images + thumbs; Más Información form when priv sections exist. Acceder validates, saves fields to `localStorage`, navigates to `/priv`.

**Priv page:** scroll-snap priv images; section nav + Solicitar archivos; technical info + related; description from `deeperDescription`.

## CMS

Deeper Level tab: `deeperDescription` (text) + `deeperSections[]` `{ name, images[] }`.

## Close

On `/priv`, Close returns to the public project page (`/projects/[slug]`), not the projects index.

## Email (Resend)

- Acceder → `POST /api/project-access` emails the visitor the priv URL, then navigates to `/priv`
- Solicitar archivos → `POST /api/project-request-files` emails the owner with the visitor lead + project links

Env: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_OWNER_EMAIL`
