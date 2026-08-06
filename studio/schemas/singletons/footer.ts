import { defineField, defineType } from 'sanity';

import { languageField } from '../fields/language';

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    languageField,
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      initialValue: '(34) 965 583 132',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
      initialValue: 'administracio@nomarq.com',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 2,
      initialValue: 'Av. Pego 10 1º 03790 Orba, Alicante',
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal links',
      type: 'array',
      of: [{ type: 'footerLink' }],
      initialValue: [
        { _key: 'privacy-policy', label: 'Privacy Policy', href: '/privacy-policy' },
        { _key: 'legal-notice', label: 'Legal Notice', href: '/legal-notice' },
        { _key: 'cookies-policy', label: 'Cookies Policy', href: '/cookies-policy' },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [{ type: 'footerLink' }],
      initialValue: [{ _key: 'instagram', label: 'IG', href: 'https://www.instagram.com/nomarq' }],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Footer',
      };
    },
  },
});
