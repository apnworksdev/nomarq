import { documentInternationalization } from '@sanity/document-internationalization';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { defaultLanguage, localizedSchemaTypes, supportedLanguages } from './lib/i18n';
import { schemaTypes } from './schemas';
import { structure } from './structure';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    'Missing SANITY_STUDIO_PROJECT_ID or SANITY_STUDIO_DATASET. Copy studio/.env.example to studio/.env and fill in your Sanity project details.',
  );
}

export default defineConfig({
  name: 'default',
  title: 'Nomarq',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [...supportedLanguages],
      schemaTypes: [...localizedSchemaTypes],
      languageField: 'language',
      weakReferences: true,
      allowCreateMetaDoc: true,
    }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type !== 'global') {
        return prev;
      }

      return prev.filter((option) => {
        if (!localizedSchemaTypes.includes(option.templateId as (typeof localizedSchemaTypes)[number])) {
          return true;
        }

        return option.parameters?.language === defaultLanguage;
      });
    },
  },
});
