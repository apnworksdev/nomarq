export const leadProfileIds = [
  'student',
  'editor',
  'promoter',
  'investor',
  'client',
  'ambassador',
  'collaborator',
  'other',
] as const;

export type LeadProfileId = (typeof leadProfileIds)[number];

export const leadFieldIds = [
  'name',
  'lastNames',
  'email',
  'phone',
  'city',
  'organization',
  'role',
  'sector',
  'origin',
] as const;

export type LeadFieldId = (typeof leadFieldIds)[number];

export const profileFields: Record<LeadProfileId, readonly LeadFieldId[]> = {
  student: ['name', 'lastNames', 'email', 'city', 'organization', 'origin'],
  editor: ['name', 'lastNames', 'email', 'phone', 'city', 'organization', 'role', 'origin'],
  promoter: ['name', 'lastNames', 'email', 'phone', 'city', 'organization', 'role', 'sector', 'origin'],
  investor: ['name', 'lastNames', 'email', 'phone', 'city', 'organization', 'role', 'sector', 'origin'],
  client: ['name', 'lastNames', 'email', 'phone'],
  ambassador: ['name', 'lastNames', 'email', 'phone'],
  collaborator: ['name', 'lastNames', 'email', 'phone'],
  other: ['name', 'lastNames', 'email', 'phone', 'city', 'organization', 'role', 'sector', 'origin'],
};

export const roleIds = ['founder', 'director', 'technical', 'other'] as const;
export type RoleId = (typeof roleIds)[number];

export const sectorIds = ['building', 'financial', 'hospitality', 'creative', 'consulting'] as const;
export type SectorId = (typeof sectorIds)[number];

export const originIds = ['members', 'ambassadors', 'social', 'search', 'website', 'other'] as const;
export type OriginId = (typeof originIds)[number];

export const socialIds = ['instagram', 'linkedin', 'youtube', 'vimeo'] as const;
export type SocialId = (typeof socialIds)[number];

export type LeadInput = {
  profile: string;
  profileOther: string;
  name: string;
  lastNames: string;
  email: string;
  phonePrefix: string;
  phoneNumber: string;
  city: string;
  country: string;
  organization: string;
  role: string;
  roleOther: string;
  sector: string;
  origin: string;
  originSocial: string;
  originOther: string;
};

export type LeadRecord = LeadInput & {
  profile: LeadProfileId;
  phone: string;
};

const profileCrmName: Record<LeadProfileId, string> = {
  student: 'Estudiante',
  editor: 'Editor o divulgador',
  promoter: 'Promotor',
  investor: 'Inversor',
  client: 'Cliente nomarq',
  ambassador: 'Embajador nomarq',
  collaborator: 'Colaborador',
  other: 'Otro',
};

const roleCrmName: Record<RoleId, string> = {
  founder: 'Fundador',
  director: 'Director',
  technical: 'Técnico',
  other: 'Otro',
};

const sectorCrmName: Record<SectorId, string> = {
  building: 'Building',
  financial: 'Financiero',
  hospitality: 'Hotelero y wellness',
  creative: 'Creativo & Cultura',
  consulting: 'Consultores',
};

const originCrmName: Record<OriginId, string> = {
  members: 'Miembros nomarq',
  ambassadors: 'Embajadores nomarq',
  social: 'Redes sociales',
  search: 'Google / Buscadores',
  website: 'Página web',
  other: 'Otro',
};

const socialCrmName: Record<SocialId, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  vimeo: 'Vimeo',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const prefixPattern = /^\+?\d{1,4}$/;

export function isLeadProfileId(value: string): value is LeadProfileId {
  return (leadProfileIds as readonly string[]).includes(value);
}

function isOneOf<T extends string>(values: readonly T[], value: string): value is T {
  return (values as readonly string[]).includes(value);
}

function digits(value: string) {
  return value.replace(/\D/g, '');
}

export function emptyLeadInput(): LeadInput {
  return {
    profile: '',
    profileOther: '',
    name: '',
    lastNames: '',
    email: '',
    phonePrefix: '',
    phoneNumber: '',
    city: '',
    country: '',
    organization: '',
    role: '',
    roleOther: '',
    sector: '',
    origin: '',
    originSocial: '',
    originOther: '',
  };
}

export function leadInputFromRecord(value: Record<string, unknown>): LeadInput {
  const read = (key: keyof LeadInput) => (typeof value[key] === 'string' ? value[key].trim() : '');

  return {
    profile: read('profile'),
    profileOther: read('profileOther'),
    name: read('name'),
    lastNames: read('lastNames'),
    email: read('email'),
    phonePrefix: read('phonePrefix'),
    phoneNumber: read('phoneNumber'),
    city: read('city'),
    country: read('country'),
    organization: read('organization'),
    role: read('role'),
    roleOther: read('roleOther'),
    sector: read('sector'),
    origin: read('origin'),
    originSocial: read('originSocial'),
    originOther: read('originOther'),
  };
}

export type LeadValidation =
  | { ok: true; lead: LeadRecord }
  | { ok: false; field: string };

export function validateLead(input: LeadInput): LeadValidation {
  if (!isLeadProfileId(input.profile)) {
    return { ok: false, field: 'profile' };
  }

  const profile = input.profile;
  const needed = new Set(profileFields[profile]);

  if (profile === 'other' && !input.profileOther.trim()) {
    return { ok: false, field: 'profileOther' };
  }

  const name = input.name.trim();
  const lastNames = input.lastNames.trim();
  const email = input.email.trim();

  if (!name) return { ok: false, field: 'name' };
  if (!lastNames) return { ok: false, field: 'lastNames' };
  if (!emailPattern.test(email)) return { ok: false, field: 'email' };

  const phonePrefix = input.phonePrefix.trim();
  const phoneNumber = input.phoneNumber.trim();
  let phone = '';

  if (needed.has('phone')) {
    if (!prefixPattern.test(phonePrefix)) return { ok: false, field: 'phonePrefix' };
    if (digits(phoneNumber).length < 6) return { ok: false, field: 'phoneNumber' };
    const prefix = phonePrefix.startsWith('+') ? phonePrefix : `+${phonePrefix}`;
    phone = `${prefix} ${phoneNumber}`;
  }

  const city = input.city.trim();
  const country = input.country.trim();
  if (needed.has('city') && (!city || !country)) {
    return { ok: false, field: 'place' };
  }

  const organization = input.organization.trim();
  if (needed.has('organization') && !organization) {
    return { ok: false, field: 'organization' };
  }

  const role = input.role.trim();
  const roleOther = input.roleOther.trim();
  if (needed.has('role')) {
    if (!isOneOf(roleIds, role)) return { ok: false, field: 'role' };
    if (role === 'other' && !roleOther) return { ok: false, field: 'roleOther' };
  }

  const sector = input.sector.trim();
  if (needed.has('sector') && !isOneOf(sectorIds, sector)) {
    return { ok: false, field: 'sector' };
  }

  const origin = input.origin.trim();
  const originSocial = input.originSocial.trim();
  const originOther = input.originOther.trim();
  if (needed.has('origin')) {
    if (!isOneOf(originIds, origin)) return { ok: false, field: 'origin' };
    if (origin === 'social' && !isOneOf(socialIds, originSocial)) {
      return { ok: false, field: 'originSocial' };
    }
    if (origin === 'other' && !originOther) return { ok: false, field: 'originOther' };
  }

  return {
    ok: true,
    lead: {
      profile,
      profileOther: profile === 'other' ? input.profileOther.trim() : '',
      name,
      lastNames,
      email,
      phonePrefix: needed.has('phone') ? phonePrefix : '',
      phoneNumber: needed.has('phone') ? phoneNumber : '',
      phone,
      city: needed.has('city') ? city : '',
      country: needed.has('city') ? country : '',
      organization: needed.has('organization') ? organization : '',
      role: needed.has('role') && isOneOf(roleIds, role) ? role : '',
      roleOther: needed.has('role') && role === 'other' ? roleOther : '',
      sector: needed.has('sector') && isOneOf(sectorIds, sector) ? sector : '',
      origin: needed.has('origin') && isOneOf(originIds, origin) ? origin : '',
      originSocial: needed.has('origin') && origin === 'social' && isOneOf(socialIds, originSocial) ? originSocial : '',
      originOther: needed.has('origin') && origin === 'other' ? originOther : '',
    },
  };
}

function withDetail(label: string, detail: string) {
  return detail ? `${label} — ${detail}` : label;
}

export function leadEmailRows(lead: LeadRecord): [string, string][] {
  const rows: [string, string][] = [
    ['Profile', withDetail(profileCrmName[lead.profile], lead.profileOther)],
    ['Name', lead.name],
    ['Last names', lead.lastNames],
    ['Email', lead.email],
  ];

  if (lead.phone) rows.push(['Phone', lead.phone]);
  if (lead.city) rows.push(['City', lead.country ? `${lead.city}, ${lead.country}` : lead.city]);
  if (lead.organization) rows.push(['Company / Entity', lead.organization]);
  if (isOneOf(roleIds, lead.role)) {
    rows.push(['Role', withDetail(roleCrmName[lead.role], lead.roleOther)]);
  }
  if (isOneOf(sectorIds, lead.sector)) rows.push(['Sector', sectorCrmName[lead.sector]]);
  if (isOneOf(originIds, lead.origin)) {
    const detail = lead.origin === 'social' && isOneOf(socialIds, lead.originSocial)
      ? socialCrmName[lead.originSocial]
      : lead.originOther;
    rows.push(['Origin', withDetail(originCrmName[lead.origin], detail)]);
  }

  return rows;
}
