import type { PortableTextBlock } from '@portabletext/types';

export type LegalPageId = 'privacyPolicy' | 'legalNotice' | 'cookiesPolicy';

export type LegalPageSlug = 'privacy-policy' | 'legal-notice' | 'cookies-policy';

export type LegalPageDocument = {
  body: PortableTextBlock[] | null;
};

export const legalPageBySlug: Record<
  LegalPageSlug,
  { id: LegalPageId; labelKey: string }
> = {
  'privacy-policy': { id: 'privacyPolicy', labelKey: 'privacy-policy' },
  'legal-notice': { id: 'legalNotice', labelKey: 'legal-notice' },
  'cookies-policy': { id: 'cookiesPolicy', labelKey: 'cookies-policy' },
};
