import type { APIRoute } from 'astro';

import {
  buildAccessEmailHtml,
  getEmailFrom,
  getResendClient,
} from '../../lib/email';

export const prerender = false;

type AccessBody = {
  name?: string;
  profile?: string;
  phone?: string;
  location?: string;
  email?: string;
  projectTitle?: string;
  privUrl?: string;
  locale?: 'en' | 'es';
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as AccessBody;
    const name = body.name?.trim() ?? '';
    const profile = body.profile?.trim() ?? '';
    const phone = body.phone?.trim() ?? '';
    const location = body.location?.trim() ?? '';
    const email = body.email?.trim() ?? '';
    const projectTitle = body.projectTitle?.trim() ?? '';
    const privUrl = body.privUrl?.trim() ?? '';
    const locale = body.locale === 'es' ? 'es' : 'en';

    if (
      ![name, profile, phone, location, email, projectTitle, privUrl].every(isNonEmptyString)
    ) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: getEmailFrom(),
      to: [email],
      subject:
        locale === 'es'
          ? `Acceso privado — ${projectTitle}`
          : `Private access — ${projectTitle}`,
      html: buildAccessEmailHtml({ name, projectTitle, privUrl, locale }),
    });

    if (error) {
      console.error('Resend access email error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Access email endpoint error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send access email.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
