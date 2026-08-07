function getValue(form: HTMLFormElement, name: string) {
  const field = form.elements.namedItem(name);

  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
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

  const onSubmit = async (event: Event) => {
    event.preventDefault();

    const name = getValue(form, 'name');
    const email = getValue(form, 'email');
    const message = getValue(form, 'message');

    if (!name || !email || !message) {
      form.reportValidity();
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
          name,
          lastNames: getValue(form, 'lastNames'),
          phone: getValue(form, 'phone'),
          email,
          website: getValue(form, 'website'),
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
  };
}

export function initAboutContactForms() {
  const cleanups = [
    ...document.querySelectorAll<HTMLFormElement>('[data-about-contact-form]'),
  ].map(initAboutContactForm);

  return () => {
    cleanups.forEach((cleanup) => cleanup());
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
