import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'location',
  title: 'Location',
  type: 'object',
  fields: [
    defineField({
      name: 'place',
      title: 'Place',
      description: 'e.g. Benisa, Alicante',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'object',
      fields: [
        defineField({
          name: 'full',
          title: 'Full',
          description: 'e.g. Spain',
          type: 'string',
        }),
        defineField({
          name: 'short',
          title: 'Short',
          description: 'e.g. SP',
          type: 'string',
        }),
      ],
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value) => {
      const hasPlace = Boolean(value?.place);
      const hasCountry = Boolean(value?.country?.full || value?.country?.short);

      if (!hasPlace && !hasCountry) {
        return 'Enter a place, country, or both';
      }

      return true;
    }),
  preview: {
    select: {
      place: 'place',
      countryFull: 'country.full',
      countryShort: 'country.short',
    },
    prepare({ place, countryFull, countryShort }) {
      const full =
        place && countryFull ? `${place} / ${countryFull}` : place || countryFull;
      const short =
        place && countryShort ? `${place} ${countryShort}` : undefined;

      return {
        title: full || countryShort,
        subtitle: short && short !== full ? short : undefined,
      };
    },
  },
});
