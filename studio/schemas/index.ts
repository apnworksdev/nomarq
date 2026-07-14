import journal from './documents/journal';
import person from './documents/person';
import project from './documents/project';
import use from './documents/use';
import homeSection from './objects/homeSection';
import imageWithAlt from './objects/imageWithAlt';
import location from './objects/location';
import teamSection from './objects/teamSection';
import about from './singletons/about';
import home from './singletons/home';

export const schemaTypes = [
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
];
