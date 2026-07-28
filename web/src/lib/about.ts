import type { SanityImageSource } from '@sanity/image-url';

import type { JournalEntry } from './journal';
import type { ImageField } from './queries/shared';

export type AboutJournalEntry = JournalEntry;

export type AboutTeamMember = {
  name: string;
  positionEn: string;
  positionEs: string;
};

export type AboutTeamSection = {
  title: string;
  members: AboutTeamMember[];
};

export type AboutDocument = {
  videoUrl?: string;
  contactImage?: SanityImageSource & { alt?: string };
  studioDescription?: string;
  direction?: string;
  email?: string;
  phone?: string;
  imageSwiper?: ImageField[];
  recognitions?: AboutJournalEntry[];
  initiatives?: AboutJournalEntry[];
  teamSections?: AboutTeamSection[];
};
