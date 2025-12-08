export type TransactionalEmailTemplate = {
  id: 'welcome_verify' | 'payment_receipt' | 'access_upgraded' | 'access_expired' | 'password_reset';
  title: string;
  subject: string;
  previewText?: string;
  body: string;
};

/**
 * Central source of truth for Resend transactional messages.
 * Keep the {{placeholders}} intact so the mailer can inject user-specific values.
 */
export const transactionalEmailTemplates: TransactionalEmailTemplate[] = [
  {
    id: 'welcome_verify',
    title: 'Welcome + Verify Email',
    subject: 'Welcome to YieldCanary – confirm your email',
    previewText: 'Confirm your email to unlock every high-yield ETF insight.',
    body: `Hi {{first_name|there}},\nYou're one click away from seeing every high-yield ETFs with no illusions.\nConfirm your email address here:\n{{verification_link}}\nOnce confirmed, the full dashboard (including Canary Health colors) will unlock instantly.\nTalk soon,\nRyan Fish\nFounder, YieldCanary`,
  },
  {
    id: 'payment_receipt',
    title: 'Payment Receipt / Unlock notice',
    subject: 'You’re in! YieldCanary Pro is now unlocked!',
    previewText: 'Death Clock, True Income Yield, and Take-Home Cash Return are now visible.',
    body: `Hey {{first_name}},\nWelcome to the real numbers. The blur is gone and you now see:\n• Death Clock on every ETF\n• True Income Yield after ROC\n• Take-Home Cash Return after taxes\n\nYour dashboard → https://app.yieldcanary.com\nLet’s go find some dead canaries,\n-YieldCanary HQ`,
  },
  {
    id: 'access_upgraded',
    title: 'Blur Removed / Access Upgraded',
    subject: 'Your YieldCanary Pro access just went live!',
    previewText: 'Full ETF metrics, including Take-Home Cash Return, are now visible.',
    body: `{{first_name}},\nBoom — the blur is gone!\nYou now have full access to every metric on our list of income ETFs, including the Take-Home Cash Return column.\nOpen the dashboard → https://app.yieldcanary.com\nEnjoy the truth,\n-YieldCanary HQ`,
  },
  {
    id: 'access_expired',
    title: 'Access Expired / Churn notice',
    subject: 'Your YieldCanary Pro access has expired',
    previewText: 'Blurred data is back, but your watchlist is saved if you return.',
    body: `Hey {{first_name}},\nYour Pro access expired today — the blur is back on.\nWant it back? Reactivate anytime here (your watchlist is still saved):\nhttps://app.yieldcanary.com/pricing\nNo pressure — we’ll keep your data safe.\n-YieldCanary HQ`,
  },
  {
    id: 'password_reset',
    title: 'Password Reset',
    subject: 'Reset your YieldCanary password',
    previewText: 'Use the secure link below to set a new password.',
    body: `Hey {{first_name}},\nSomeone (hopefully you) requested a password reset.\nClick here to set a new password:\n{{reset_link}}\nIf you didn’t ask for this, just ignore this email.\n\n-YieldCanary HQ`,
  },
];

export function getTransactionalTemplate(id: TransactionalEmailTemplate['id']) {
  return transactionalEmailTemplates.find((template) => template.id === id);
}
