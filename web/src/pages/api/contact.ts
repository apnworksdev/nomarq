import type { APIRoute } from 'astro';

import {
  buildContactEmailHtml,
  getEmailFrom,
  getOwnerEmail,
  getResendClient,
  type ContactMessage,
} from '../../lib/email';
import { leadInputFromRecord, validateLead } from '../../lib/lead-profile';

export const prerender = false;

type ContactBody = Record<string, unknown> & {
  subject?: string;
  message?: string;
  privacy?: boolean;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as ContactBody;
    const result = validateLead(leadInputFromRecord(body));
    const subject = body.subject?.trim() ?? '';
    const messageText = body.message?.trim() ?? '';

    if (!body.privacy) {
      return new Response(JSON.stringify({ error: 'Privacy consent is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!result.ok || !isNonEmptyString(messageText)) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const message: ContactMessage = {
      ...result.lead,
      subject,
      message: messageText,
    };

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
