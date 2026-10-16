import type { APIRoute } from 'astro';

import {
  buildAccessEmailHtml,
  buildAccessNoticeHtml,
  getEmailFrom,
  getOwnerEmail,
  getResendClient,
} from '../../lib/email';
import { leadInputFromRecord, validateLead } from '../../lib/lead-profile';

export const prerender = false;

type AccessBody = Record<string, unknown> & {
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
    const result = validateLead(leadInputFromRecord(body));
    const projectTitle = body.projectTitle?.trim() ?? '';
    const privUrl = body.privUrl?.trim() ?? '';
    const locale = body.locale === 'es' ? 'es' : 'en';

    if (!result.ok || ![projectTitle, privUrl].every(isNonEmptyString)) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resend = getResendClient();
    const visitor = await resend.emails.send({
      from: getEmailFrom(),
      to: [result.lead.email],
      subject:
        locale === 'es'
          ? `Acceso privado — ${projectTitle}`
          : `Private access — ${projectTitle}`,
      html: buildAccessEmailHtml({ name: result.lead.name, projectTitle, privUrl, locale }),
    });

    if (visitor.error) {
      console.error('Resend access email error:', visitor.error);
      return new Response(JSON.stringify({ error: visitor.error.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const notice = await resend.emails.send({
      from: getEmailFrom(),
      to: [getOwnerEmail()],
      replyTo: result.lead.email,
      subject: `Project access — ${projectTitle}`,
      html: buildAccessNoticeHtml({
        lead: result.lead,
        projectTitle,
        privUrl,
      }),
    });

    if (notice.error) {
      console.error('Resend access notice error:', notice.error);
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
