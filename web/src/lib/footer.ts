export type FooterLink = {
  _key: string;
  label: string;
  href: string;
};

export type FooterDocument = {
  phone?: string;
  email?: string;
  address?: string;
  legalLinks?: FooterLink[];
  socialLinks?: FooterLink[];
};

export function isExternalHref(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:');
}
