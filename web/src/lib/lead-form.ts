import {
  emptyLeadInput,
  isLeadProfileId,
  leadFieldIds,
  profileFields,
  validateLead,
  type LeadFieldId,
  type LeadInput,
  type LeadRecord,
} from './lead-profile';

type PlaceHit = {
  city: string;
  country: string;
  label: string;
};

const PLACE_TYPES = new Set(['city', 'town', 'village', 'municipality', 'hamlet', 'locality']);

function formControl(form: HTMLFormElement, name: string) {
  const control = form.elements.namedItem(name);
  if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement) {
    return control;
  }
  return null;
}

function readValue(form: HTMLFormElement, name: string) {
  return formControl(form, name)?.value.trim() ?? '';
}

export function readLeadInput(form: HTMLFormElement): LeadInput {
  const input = emptyLeadInput();
  (Object.keys(input) as (keyof LeadInput)[]).forEach((key) => {
    input[key] = readValue(form, key);
  });
  return input;
}

function setFilled(control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  const field = control.closest('.about-form-field, .project-deeper-field');
  field?.classList.toggle('is-filled', control.value.trim().length > 0);
}

function fieldElement(form: HTMLFormElement, name: string) {
  return form.querySelector<HTMLElement>(`[data-lead-field="${name}"]`);
}

function setFieldEnabled(field: HTMLElement, enabled: boolean) {
  field.hidden = !enabled;
  field.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea').forEach((control) => {
    if (control instanceof HTMLInputElement && control.type === 'hidden') {
      control.disabled = !enabled;
      return;
    }

    control.disabled = !enabled;
    control.required = enabled;
    if (!enabled) {
      control.setCustomValidity('');
    }
  });
}

function selectedNote(form: HTMLFormElement) {
  const sector = formControl(form, 'sector');
  const note = form.querySelector<HTMLElement>('[data-lead-sector-note]');
  if (!note || !(sector instanceof HTMLSelectElement)) return;

  const text = sector.selectedOptions[0]?.dataset.note?.trim() ?? '';
  const visible = !sector.disabled && text.length > 0;
  note.hidden = !visible;
  note.textContent = visible ? text : '';
}

export function syncLeadFields(form: HTMLFormElement) {
  const profile = readValue(form, 'profile');
  const needed = new Set(isLeadProfileId(profile) ? profileFields[profile] : []);
  const role = readValue(form, 'role');
  const origin = readValue(form, 'origin');

  form.querySelectorAll<HTMLElement>('[data-lead-field]').forEach((field) => {
    const name = field.dataset.leadField ?? '';
    let enabled = false;

    if (name === 'profile') enabled = true;
    else if (name === 'profileOther') enabled = profile === 'other';
    else if (name === 'roleOther') enabled = needed.has('role') && role === 'other';
    else if (name === 'originSocial') enabled = needed.has('origin') && origin === 'social';
    else if (name === 'originOther') enabled = needed.has('origin') && origin === 'other';
    else enabled = (leadFieldIds as readonly string[]).includes(name) && needed.has(name as LeadFieldId);

    setFieldEnabled(field, enabled);
  });

  form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea').forEach((control) => {
    if (control instanceof HTMLInputElement && control.type === 'hidden') return;
    setFilled(control);
  });
  selectedNote(form);
}

function markInvalid(form: HTMLFormElement, fieldName: string) {
  const control = formControl(form, fieldName);
  if (!control) {
    form.reportValidity();
    return;
  }

  const message = control.dataset.leadInvalid;
  if (message && control.value.trim()) {
    control.setCustomValidity(message);
  }

  control.reportValidity();
}

export function leadFromForm(form: HTMLFormElement): LeadRecord | null {
  syncLeadFields(form);
  form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea').forEach((control) => {
    control.setCustomValidity('');
  });

  const result = validateLead(readLeadInput(form));
  if (result.ok) return result.lead;

  markInvalid(form, result.field);
  return null;
}

function clearPlace(form: HTMLFormElement) {
  const city = formControl(form, 'city');
  const country = formControl(form, 'country');
  if (city) city.value = '';
  if (country) country.value = '';
}

async function searchPlaces(query: string, signal: AbortSignal): Promise<PlaceHit[]> {
  const url = new URL('https://photon.komoot.io/api/');
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '8');
  url.searchParams.set('lang', document.documentElement.lang || 'en');

  const response = await fetch(url, { signal });
  if (!response.ok) return [];

  const payload = (await response.json()) as {
    features?: { properties?: Record<string, unknown> }[];
  };
  const hits: PlaceHit[] = [];

  for (const feature of payload.features ?? []) {
    const properties = feature.properties ?? {};
    const osmKey = String(properties.osm_key ?? '');
    const osmValue = String(properties.osm_value ?? '');
    if (osmKey !== 'place' || !PLACE_TYPES.has(osmValue)) continue;

    const city = String(properties.name ?? properties.city ?? '').trim();
    const country = String(properties.country ?? '').trim();
    if (!city || !country) continue;

    const label = `${city}, ${country}`;
    if (hits.some((hit) => hit.label === label)) continue;
    hits.push({ city, country, label });
    if (hits.length === 5) break;
  }

  return hits;
}

function initPlaceField(form: HTMLFormElement) {
  const field = fieldElement(form, 'city');
  const input = form.querySelector<HTMLInputElement>('[data-lead-place-input]');
  const list = form.querySelector<HTMLUListElement>('[data-lead-place-list]');
  if (!field || !input || !list) return () => {};

  let request: AbortController | undefined;
  let timer = 0;

  const hideList = () => {
    list.hidden = true;
    list.replaceChildren();
    input.setAttribute('aria-expanded', 'false');
  };

  const positionList = () => {
    const rect = input.getBoundingClientRect();
    list.style.position = 'fixed';
    list.style.top = `${rect.bottom + 4}px`;
    list.style.left = `${rect.left}px`;
    list.style.width = `${rect.width}px`;
  };

  const choose = (hit: PlaceHit) => {
    const city = formControl(form, 'city');
    const country = formControl(form, 'country');
    if (city) city.value = hit.city;
    if (country) country.value = hit.country;
    input.value = hit.label;
    input.setCustomValidity('');
    setFilled(input);
    hideList();
  };

  const showHits = (hits: PlaceHit[]) => {
    list.replaceChildren();
    if (hits.length === 0 || field.hidden) {
      hideList();
      return;
    }

    hits.forEach((hit) => {
      const item = document.createElement('li');
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'lead-place-option';
      option.textContent = hit.label;
      option.addEventListener('mousedown', (event) => {
        event.preventDefault();
        choose(hit);
      });
      item.append(option);
      list.append(item);
    });

    positionList();
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  };

  const onInput = () => {
    clearPlace(form);
    setFilled(input);
    window.clearTimeout(timer);
    request?.abort();

    const query = input.value.trim();
    if (query.length < 2) {
      hideList();
      return;
    }

    timer = window.setTimeout(async () => {
      const next = new AbortController();
      request = next;
      try {
        showHits(await searchPlaces(query, next.signal));
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        hideList();
      }
    }, 250);
  };

  const onBlur = () => {
    window.setTimeout(hideList, 120);
  };

  const onScroll = () => {
    if (!list.hidden) positionList();
  };

  input.addEventListener('input', onInput);
  input.addEventListener('blur', onBlur);
  window.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', onScroll);

  return () => {
    window.clearTimeout(timer);
    request?.abort();
    input.removeEventListener('input', onInput);
    input.removeEventListener('blur', onBlur);
    window.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('resize', onScroll);
  };
}

export function initLeadForm(form: HTMLFormElement) {
  const onChange = (event: Event) => {
    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLSelectElement ||
      target instanceof HTMLTextAreaElement
    ) {
      target.setCustomValidity('');
      setFilled(target);
    }
    syncLeadFields(form);
  };

  form.addEventListener('input', onChange);
  form.addEventListener('change', onChange);
  syncLeadFields(form);
  const cleanupPlace = initPlaceField(form);

  return () => {
    form.removeEventListener('input', onChange);
    form.removeEventListener('change', onChange);
    cleanupPlace();
  };
}

export function restoreLeadForm(form: HTMLFormElement, stored: Partial<LeadRecord>) {
  (Object.keys(emptyLeadInput()) as (keyof LeadInput)[]).forEach((key) => {
    const value = stored[key];
    const control = formControl(form, key);
    if (control && typeof value === 'string') {
      control.value = value;
    }
  });

  const place = form.querySelector<HTMLInputElement>('[data-lead-place-input]');
  if (place && stored.city && stored.country) {
    place.value = `${stored.city}, ${stored.country}`;
  }

  syncLeadFields(form);
}
