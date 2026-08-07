import { Resend } from 'resend';

export type AccessLead = {
  name: string;
  profile: string;
  phone: string;
  location: string;
  email: string;
};

function requireEnv(name: string): string {
  const value = import.meta.env[name];

  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value.trim();
}

export function getResendClient() {
  return new Resend(requireEnv('RESEND_API_KEY'));
}

export function getEmailFrom() {
  return import.meta.env.RESEND_FROM_EMAIL?.trim() || 'Nomarq <onboarding@resend.dev>';
}

export function getOwnerEmail() {
  return (
    import.meta.env.RESEND_OWNER_EMAIL?.trim() ||
    import.meta.env.PUBLIC_OWNER_EMAIL?.trim() ||
    'administracio@nomarq.com'
  );
}

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildAccessEmailHtml(input: {
  name: string;
  projectTitle: string;
  privUrl: string;
  locale: 'en' | 'es';
}) {
  const name = escapeHtml(input.name);
  const title = escapeHtml(input.projectTitle);
  const url = escapeHtml(input.privUrl);

  if (input.locale === 'es') {
    return `
      <p>Estimado/a ${name},</p>
      <p>Es un placer concederte acceso a la presentación solicitada de <strong>${title}</strong>. Hemos preparado un recorrido digital para que puedas explorar este proyecto en profundidad.</p>
      <p>Puedes acceder a la presentación completa a través del siguiente enlace privado:</p>
      <p><a href="${url}">${url}</a></p>
      <p><strong>Recomendaciones para una experiencia óptima:</strong></p>
      <ul>
        <li>Utiliza preferiblemente un ordenador o tablet para una visualización cómoda.</li>
        <li>Asegúrate de tener una buena conexión a internet, ya que incluye elementos multimedia.</li>
        <li>El enlace es personal; por favor, no lo compartas.</li>
        <li>Si encuentras algún problema técnico, contáctanos respondiendo a este correo.</li>
      </ul>
      <p>Esperamos que disfrutes de este itinerario visual.</p>
      <p>Un cordial saludo,<br />El equipo de Nomarq</p>
    `;
  }

  return `
    <p>Dear ${name},</p>
    <p>It is our pleasure to grant you access to the requested presentation of <strong>${title}</strong>. We have prepared a digital tour so that you can explore this project in depth.</p>
    <p>You can access the full presentation via the following private link:</p>
    <p><a href="${url}">${url}</a></p>
    <p><strong>Recommendations for an optimal experience:</strong></p>
    <ul>
      <li>Preferably use a computer or tablet for comfortable viewing.</li>
      <li>Ensure you have a good internet connection, as it includes multimedia elements.</li>
      <li>The link is personal; please do not share it.</li>
      <li>If you encounter any technical problems, please contact us by replying to this email.</li>
    </ul>
    <p>We hope you enjoy this visual itinerary.</p>
    <p>Kind regards,<br />The Nomarq team</p>
  `;
}

export function buildRequestFilesEmailHtml(input: {
  lead: AccessLead;
  projectTitle: string;
  projectUrl: string;
  privUrl: string;
}) {
  const lead = input.lead;

  return `
    <p>New file request for <strong>${escapeHtml(input.projectTitle)}</strong>.</p>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(lead.name)}</li>
      <li><strong>Profile:</strong> ${escapeHtml(lead.profile)}</li>
      <li><strong>Phone:</strong> ${escapeHtml(lead.phone)}</li>
      <li><strong>Location:</strong> ${escapeHtml(lead.location)}</li>
      <li><strong>Email:</strong> ${escapeHtml(lead.email)}</li>
    </ul>
    <p><strong>Public project:</strong> <a href="${escapeHtml(input.projectUrl)}">${escapeHtml(input.projectUrl)}</a></p>
    <p><strong>Priv page:</strong> <a href="${escapeHtml(input.privUrl)}">${escapeHtml(input.privUrl)}</a></p>
  `;
}

export type ContactMessage = {
  name: string;
  lastNames: string;
  phone: string;
  email: string;
  website: string;
  subject: string;
  message: string;
};

export function buildContactEmailHtml(input: ContactMessage) {
  const rows = [
    ['Name', input.name],
    ['Last names', input.lastNames],
    ['Phone', input.phone],
    ['Email', input.email],
    ['Website', input.website],
    ['Subject', input.subject],
  ]
    .filter(([, value]) => value.trim())
    .map(([label, value]) => `<li><strong>${label}:</strong> ${escapeHtml(value)}</li>`)
    .join('');

  return `
    <p>New contact form message from the About page.</p>
    <ul>${rows}</ul>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(input.message).replaceAll('\n', '<br />')}</p>
  `;
}
