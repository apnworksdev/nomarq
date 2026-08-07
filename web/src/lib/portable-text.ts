import { toHTML, type PortableTextComponents } from '@portabletext/to-html';
import type {
  PortableTextBlock,
  PortableTextSpan,
  TypedObject,
} from '@portabletext/types';

type SpanChild = PortableTextSpan | TypedObject;

type LinkMarkDef = {
  _type: 'link';
  _key: string;
  href: string;
};

const LIST_LABEL =
  /^(Address|Phone|Email|Domain name|Access|Rectification|Deletion|Treatment limitation|Opposition to processing|Right to the portability of your data)\s*:/i;

const PURPOSE_BULLET = /^To [a-z]/;
const URL_OR_EMAIL =
  /((?:https?:\/\/|www\.)[^\s<]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;

const components: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === 'string' ? value.href : '#';
      const external = /^https?:\/\//.test(href);

      return `<a href="${escapeAttribute(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${children}</a>`;
    },
  },
};

function escapeAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function isSpan(child: SpanChild): child is PortableTextSpan {
  return child._type === 'span' && typeof (child as PortableTextSpan).text === 'string';
}

function blockHasSoftBreaks(block: PortableTextBlock) {
  return (block.children ?? []).some(
    (child) => isSpan(child) && (child.text.includes('\n') || child.text.includes('\r')),
  );
}

function isHeadingLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed) return false;

  const letters = trimmed.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, '');
  if (letters.length < 8) return false;

  return letters === letters.toUpperCase();
}

function hrefForMatch(raw: string) {
  const trailing = /[.,)]$/.test(raw) ? raw.slice(-1) : '';
  const core = trailing ? raw.slice(0, -1) : raw;

  if (core.includes('@')) {
    return { href: `mailto:${core}`, display: core, trailing };
  }

  if (core.startsWith('http')) {
    return { href: core, display: core, trailing };
  }

  return { href: `https://${core}`, display: core, trailing };
}

function linkifyText(text: string): { children: PortableTextSpan[]; markDefs: LinkMarkDef[] } {
  const children: PortableTextSpan[] = [];
  const markDefs: LinkMarkDef[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const pattern = new RegExp(URL_OR_EMAIL.source, URL_OR_EMAIL.flags);

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      children.push({
        _type: 'span',
        _key: uid('t'),
        text: text.slice(lastIndex, match.index),
        marks: [],
      });
    }

    const { href, display, trailing } = hrefForMatch(match[0]);
    const markKey = uid('link');
    markDefs.push({ _type: 'link', _key: markKey, href });
    children.push({
      _type: 'span',
      _key: uid('u'),
      text: display,
      marks: [markKey],
    });

    if (trailing) {
      children.push({
        _type: 'span',
        _key: uid('p'),
        text: trailing,
        marks: [],
      });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex === 0) {
    return {
      children: [{ _type: 'span', _key: uid('span'), text, marks: [] }],
      markDefs: [],
    };
  }

  if (lastIndex < text.length) {
    children.push({
      _type: 'span',
      _key: uid('t'),
      text: text.slice(lastIndex),
      marks: [],
    });
  }

  return { children, markDefs };
}

function withBoldLabel(text: string): { children: PortableTextSpan[]; markDefs: LinkMarkDef[] } {
  const match = text.match(/^([^:]{1,80}:)(\s*)([\s\S]*)$/);

  if (!match) {
    return linkifyText(text);
  }

  const [, label, space, rest] = match;
  const restLinked = linkifyText(`${space}${rest}`);

  return {
    markDefs: restLinked.markDefs,
    children: [
      {
        _type: 'span',
        _key: uid('label'),
        text: label,
        marks: ['strong'],
      },
      ...restLinked.children,
    ],
  };
}

function lineToBlock(line: string, source: PortableTextBlock, index: number): PortableTextBlock {
  const key = `${source._key || 'block'}-${index}`;

  if (isHeadingLine(line)) {
    return {
      ...source,
      _key: key,
      style: 'h2',
      listItem: undefined,
      level: undefined,
      markDefs: [],
      children: [{ _type: 'span', _key: uid('span'), text: line, marks: [] }],
    };
  }

  if (LIST_LABEL.test(line)) {
    const labeled = withBoldLabel(line);
    return {
      ...source,
      _key: key,
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      markDefs: labeled.markDefs,
      children: labeled.children,
    };
  }

  if (PURPOSE_BULLET.test(line)) {
    const linked = linkifyText(line);
    return {
      ...source,
      _key: key,
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      markDefs: linked.markDefs,
      children: linked.children,
    };
  }

  const linked = linkifyText(line);
  return {
    ...source,
    _key: key,
    style: 'normal',
    listItem: undefined,
    level: undefined,
    markDefs: linked.markDefs,
    children: linked.children,
  };
}

/**
 * Pasted Studio content often lands as one block with \n soft breaks.
 * Expand those into real paragraphs / headings / list items so CSS can style them.
 */
export function normalizeLegalBody(body: PortableTextBlock[]): PortableTextBlock[] {
  const normalized: PortableTextBlock[] = [];

  body.forEach((block) => {
    if (block._type !== 'block' || !blockHasSoftBreaks(block)) {
      normalized.push(block);
      return;
    }

    const text = ((block.children ?? []) as SpanChild[])
      .filter(isSpan)
      .map((child) => child.text)
      .join('')
      .replaceAll('\r\n', '\n')
      .replaceAll('\r', '\n');

    const lines = text.split('\n');
    let lineIndex = 0;

    for (const rawLine of lines) {
      const line = rawLine.replace(/\u00a0/g, ' ').trim();
      if (!line) continue;
      normalized.push(lineToBlock(line, block, lineIndex));
      lineIndex += 1;
    }
  });

  return normalized;
}

export function renderLegalBody(body: PortableTextBlock[] | null | undefined) {
  if (!body?.length) {
    return '';
  }

  return toHTML(normalizeLegalBody(body), { components });
}
