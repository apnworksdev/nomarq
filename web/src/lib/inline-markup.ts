function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/** **bold** and *italic* marks typed in Sanity plain-text fields. */
export function formatInlineMarkup(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^<*])\*([^*]+)\*/g, '$1<em>$2</em>');
}
