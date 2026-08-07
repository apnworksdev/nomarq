import journal from './documents/journal';
import person from './documents/person';
import project from './documents/project';
import use from './documents/use';
import blockContent from './objects/blockContent';
import deeperSection from './objects/deeperSection';
import footerLink from './objects/footerLink';
import homeSection from './objects/homeSection';
import imageWithAlt from './objects/imageWithAlt';
import location from './objects/location';
import teamSection from './objects/teamSection';
import about from './singletons/about';
import footer from './singletons/footer';
import home from './singletons/home';
import {
  cookiesPolicy,
  legalNotice,
  privacyPolicy,
} from './singletons/legalPages';

export const schemaTypes = [
  blockContent,
  deeperSection,
  footerLink,
  imageWithAlt,
  location,
  teamSection,
  homeSection,
  use,
  project,
  journal,
  person,
  home,
  about,
  footer,
  privacyPolicy,
  legalNotice,
  cookiesPolicy,
];
