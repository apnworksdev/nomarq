# Legal pages design

## Goal

Three legal pages — privacy policy, legal notice, cookies policy — with Sanity-editable rich text and a half-page layout matching the provided desktop mock.

## CMS

- Three localized singletons: `privacyPolicy`, `legalNotice`, `cookiesPolicy`
- Shared `blockContent` Portable Text: paragraphs, h2/h3, bold/italic, bullet/numbered lists, links
- No separate title field on the page layout — headings live in the body
- Desk: Legal group with the three singletons
- EN/ES via document internationalization (same pattern as about/footer)

## Frontend

- Routes: `/privacy-policy`, `/legal-notice`, `/cookies-policy` (+ `/es/...`)
- Shared `LegalPage` view fetches by document id + locale
- Render body with `@portabletext/to-html`
- Footer links already point at these paths

## Layout

- Desktop: content in bottom-right — starts at 50vh, columns 5–9 (half width)
- Mobile: full width, still starts at 50vh
- Paragraphs after the first (or after a heading): first-line text indent (same idea as project descriptions)
- Styles can be refined later; ship a clear structural layout first

## Empty state

Empty or missing body → blank content column (no placeholder copy).
