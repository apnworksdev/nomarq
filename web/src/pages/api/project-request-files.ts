import type { APIRoute } from 'astro';

import {
  buildRequestFilesEmailHtml,
  getEmailFrom,
  getOwnerEmail,
  getResendClient,
  type AccessLead,
} from '../../lib/email';

export const prerender = false;

type RequestBody = {
  name?: string;
  profile?: string;
  phone?: string;
  location?: string;
  email?: string;
  projectTitle?: string;
  projectUrl?: string;
  privUrl?: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as RequestBody;
    const lead: AccessLead = {
      name: body.name?.trim() ?? '',
      profile: body.profile?.trim() ?? '',
      phone: body.phone?.trim() ?? '',
      location: body.location?.trim() ?? '',
      email: body.email?.trim() ?? '',
    };
    const projectTitle = body.projectTitle?.trim() ?? '';
    const projectUrl = body.projectUrl?.trim() ?? '';
    const privUrl = body.privUrl?.trim() ?? '';

    if (
      ![
        lead.name,
        lead.profile,
        lead.phone,
        lead.location,
        lead.email,
        projectTitle,
        projectUrl,
        privUrl,
      ].every(isNonEmptyString)
    ) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: getEmailFrom(),
      to: [getOwnerEmail()],
      replyTo: lead.email,
      subject: `File request — ${projectTitle}`,
      html: buildRequestFilesEmailHtml({
        lead,
        projectTitle,
        projectUrl,
        privUrl,
      }),
    });

    if (error) {
      console.error('Resend request-files email error:', error);
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
    console.error('Request-files email endpoint error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send request email.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
