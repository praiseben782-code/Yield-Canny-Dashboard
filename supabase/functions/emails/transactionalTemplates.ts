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
    title: 'Welcome Email',
    subject: 'Welcome to YieldCanary!',
    previewText: 'Get ready to see every high-yield ETF with no illusions.',
    body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to YieldCanary</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 10px;
      letter-spacing: -0.5px;
    }
    .header p {
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 16px;
      color: #1f2937;
      margin-bottom: 20px;
    }
    .main-message {
      font-size: 18px;
      color: #1f2937;
      font-weight: 500;
      margin-bottom: 30px;
      line-height: 1.8;
    }
    .cta-button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff;
      padding: 14px 32px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      margin: 30px 0;
      transition: background-color 0.3s;
    }
    .cta-button:hover {
      background-color: #1d4ed8;
    }
    .features {
      font-size: 14px;
      color: #6b7280;
      margin-top: 20px;
      line-height: 1.8;
    }
    .features ul {
      margin: 20px 0 20px 20px;
      color: #1f2937;
    }
    .features li {
      margin-bottom: 8px;
    }
    .features strong {
      color: #1f2937;
    }
    .divider {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 40px 0;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-text {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 10px;
    }
    .signature {
      font-size: 14px;
      color: #1f2937;
      margin-top: 15px;
      font-weight: 500;
    }
    .founder {
      color: #2563eb;
      font-weight: 600;
    }
    @media (max-width: 600px) {
      .container {
        border-radius: 0;
      }
      .content {
        padding: 30px 20px;
      }
      .header {
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 24px;
      }
      .main-message {
        font-size: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>YieldCanary</h1>
      <p>High-Yield ETF Intelligence</p>
    </div>
    
    <div class="content">
      <p class="greeting">Welcome, <strong>{{first_name|friend}}</strong>! 👋</p>
      
      <p class="main-message">
        Your account is ready. You now have access to see every high-yield ETF with no illusions — no blur, no hidden metrics, just the truth.
      </p>
      
      <p style="text-align: center;">
        <a href="https://yieldcanary.com" class="cta-button">Go to Dashboard</a>
      </p>
      
      <div class="features">
        <p>You now have full access to:</p>
        <ul>
          <li><strong>Death Clock</strong> on every ETF</li>
          <li><strong>True Income Yield</strong> after ROC</li>
          <li><strong>Take-Home Cash Return</strong> after taxes</li>
        </ul>
        <p>
          Get started exploring the dashboard. If you have any questions or need help, just reply to this email.
        </p>
      </div>
    </div>
    
    <div style="border-top: 1px solid #e5e7eb;"></div>
    
    <div class="footer">
      <p class="footer-text">
        Questions? Reply to this email and we'll help.
      </p>
      <p class="signature">
        Let's find some dead canaries,<br>
        <span class="founder">Ryan Fish</span><br>
        Founder, YieldCanary
      </p>
      <p class="footer-text" style="margin-top: 20px; font-size: 12px;">
        © 2024 YieldCanary. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`,
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
    previewText: 'Set a new password for your account.',
    body: `Hey {{first_name}},\nSomeone (hopefully you) requested a password reset.\nClick here to set a new password:\n{{reset_link}}\nIf you didn’t ask for this, just ignore this email.\n\n-YieldCanary HQ`,
  },
];
