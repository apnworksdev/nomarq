import type { APIRoute } from 'astro';

import {
  buildContactEmailHtml,
  getEmailFrom,
  getOwnerEmail,
  getResendClient,
  type ContactMessage,
} from '../../lib/email';

export const prerender = false;

type ContactBody = Partial<ContactMessage> & {
  privacy?: boolean;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as ContactBody;
    const message: ContactMessage = {
      name: body.name?.trim() ?? '',
      lastNames: body.lastNames?.trim() ?? '',
      phone: body.phone?.trim() ?? '',
      email: body.email?.trim() ?? '',
      website: body.website?.trim() ?? '',
      subject: body.subject?.trim() ?? '',
      message: body.message?.trim() ?? '',
    };

    if (!body.privacy) {
      return new Response(JSON.stringify({ error: 'Privacy consent is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (![message.name, message.email, message.message].every(isNonEmptyString)) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resend = getResendClient();
    const subjectLine = message.subject
      ? `Contact — ${message.subject}`
      : `Contact — ${message.name}`;

    const { error } = await resend.emails.send({
      from: getEmailFrom(),
      to: [getOwnerEmail()],
      replyTo: message.email,
      subject: subjectLine,
      html: buildContactEmailHtml(message),
    });

    if (error) {
      console.error('Resend contact email error:', error);
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
    console.error('Contact email endpoint error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send contact email.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
