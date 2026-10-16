import { initLeadForm, leadFromForm, syncLeadFields } from './lead-form';

function getValue(form: HTMLFormElement, name: string) {
  const field = form.elements.namedItem(name);

  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
    return field.value.trim();
  }

  return '';
}

function initAboutContactForm(form: HTMLFormElement) {
  const submitButton = form.querySelector<HTMLButtonElement>('.about-form-submit');
  const privacy = form.querySelector<HTMLInputElement>('#about-privacy');
  const defaultLabel = submitButton?.textContent?.trim() ?? 'Submit';
  const sentLabel =
    form.dataset.aboutFormSent?.trim() || 'Your request has been sent successfully';
  const cleanupLead = initLeadForm(form);

  const onSubmit = async (event: Event) => {
    event.preventDefault();

    const lead = leadFromForm(form);
    const message = getValue(form, 'message');
    const messageField = form.elements.namedItem('message');

    if (!lead) return;

    if (!message && messageField instanceof HTMLTextAreaElement) {
      messageField.reportValidity();
      return;
    }

    if (!privacy?.checked) {
      privacy?.focus();
      privacy?.reportValidity?.();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lead,
          subject: getValue(form, 'subject'),
          message,
          privacy: true,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Request failed (${response.status})`);
      }

      if (submitButton) {
        submitButton.textContent = sentLabel;
        submitButton.classList.add('is-sent');
      }

      form.reset();
      syncLeadFields(form);
    } catch (error) {
      console.error('Failed to send contact email:', error);
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultLabel;
      }
    }
  };

  form.addEventListener('submit', onSubmit);

  return () => {
    form.removeEventListener('submit', onSubmit);
    cleanupLead();
  };
}

export function initAboutContactForms() {
  const stops = [...document.querySelectorAll<HTMLFormElement>('[data-about-contact-form]')].map(
    initAboutContactForm,
  );

  return () => {
    stops.forEach((stop) => stop());
  };
}

export function initAboutContactFormState() {
  let cleanup: (() => void) | undefined;

  const run = () => {
    cleanup?.();
    cleanup = initAboutContactForms();
  };

  run();
  document.addEventListener('astro:page-load', run);
}
