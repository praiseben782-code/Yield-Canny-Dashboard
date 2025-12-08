import { Resend } from 'resend';
import {
  transactionalEmailTemplates,
  TransactionalEmailTemplate,
} from '../../emails/transactionalTemplates';

type TemplateData = Record<string, string | undefined>;

const resendApiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || '';
const resendFromAddress = process.env.RESEND_FROM_EMAIL || 'YieldCanary HQ <hello@yieldcanary.com>';

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const formatNameFromEmail = (email: string): string | undefined => {
  if (!email) return undefined;
  const localPart = email.split('@')[0];
  if (!localPart) return undefined;
  const token = localPart.split(/[._\s-]/)[0];
  if (!token) return undefined;
  return token.charAt(0).toUpperCase() + token.slice(1);
};

const replacePlaceholders = (input: string, data: TemplateData = {}) =>
  input.replace(/{{([^}]+)}}/g, (_, token) => {
    const [rawKey, fallback] = token.split('|');
    const key = rawKey.trim();
    const value = data[key];

    if (value && value.length > 0) {
      return value;
    }

    return fallback ? fallback.trim() : '';
  });

export async function sendTransactionalEmail({
  to,
  templateId,
  data = {},
}: {
  to: string;
  templateId: TransactionalEmailTemplate['id'];
  data?: TemplateData;
}) {
  if (!resend) {
    console.warn('Resend API key missing. Skipping transactional email send.');
    return;
  }

  const template = transactionalEmailTemplates.find((tpl) => tpl.id === templateId);

  if (!template) {
    console.warn(`Transactional email template "${templateId}" not found.`);
    return;
  }

  const normalizedData: TemplateData = {
    first_name: data.first_name || formatNameFromEmail(to),
    ...data,
  };

  const subject = replacePlaceholders(template.subject, normalizedData);
  const body = replacePlaceholders(template.body, normalizedData);

  try {
    await resend.emails.send({
      from: resendFromAddress,
      to,
      subject,
      text: body,
    });
  } catch (error) {
    console.error(`Failed to send transactional email (${templateId}) to ${to}:`, error);
  }
}
