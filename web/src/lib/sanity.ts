import { createClient } from '@sanity/client';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    'Missing PUBLIC_SANITY_PROJECT_ID or PUBLIC_SANITY_DATASET. Copy web/.env.example to web/.env and fill in your Sanity project details.',
  );
}

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: import.meta.env.PROD,
});
