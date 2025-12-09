/**
 * Helper to call the Supabase Edge Function for sending transactional emails
 */

import { supabase } from '@/integrations/supabase/client';

type TransactionalEmailTemplateId = 'welcome_verify' | 'payment_receipt' | 'access_upgraded' | 'access_expired' | 'password_reset';

export async function sendTransactionalEmail({
  to,
  templateId,
  data = {},
}: {
  to: string;
  templateId: TransactionalEmailTemplateId;
  data?: Record<string, string>;
}) {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL is not set');
    }

    // Get current session for authorization
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if session exists
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to,
        templateId,
        data,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send transactional email:', error);
      throw new Error(error.error || 'Failed to send email');
    }

    const result = await response.json();
    console.log(`Transactional email (${templateId}) sent to ${to}:`, result);
    return result;
  } catch (error) {
    console.error('Error sending transactional email:', error);
    throw error;
  }
}
