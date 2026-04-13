import { Resend } from 'resend';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY environment variable is not set');
  return new Resend(key);
}

function fromAddress(): string {
  return process.env.EMAIL_FROM ?? 'Mirai <noreply@mirai.city>';
}

const CONSOLE_URL =
  process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/console`
    : 'https://mirai.city/console';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EmailResult {
  success: boolean;
  error?: string;
}

interface ApprovalEmailParams {
  to: string;
  name: string;
  paymentUrl: string;
}

interface LoginCodeParams {
  to: string;
  code: string;
}

interface PaymentConfirmationParams {
  to: string;
  name?: string;
}

// ---------------------------------------------------------------------------
// Rate limiting — login codes: max 3 per email per hour
// ---------------------------------------------------------------------------

const rateLimitMap = new Map<string, number[]>();

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export function checkLoginCodeRateLimit(
  email: string,
): { allowed: true } | { allowed: false; retryAfterMinutes: number } {
  const key = email.toLowerCase();
  const now = Date.now();
  const timestamps = (rateLimitMap.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );

  if (timestamps.length >= RATE_LIMIT_MAX) {
    const oldestInWindow = timestamps[0];
    const retryAfterMs = RATE_LIMIT_WINDOW_MS - (now - oldestInWindow);
    const retryAfterMinutes = Math.ceil(retryAfterMs / 60_000);
    return { allowed: false, retryAfterMinutes };
  }

  timestamps.push(now);
  rateLimitMap.set(key, timestamps);
  return { allowed: true };
}

// ---------------------------------------------------------------------------
// Branded HTML email layout
// ---------------------------------------------------------------------------

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Fraunces:opsz,wght@9..144,400..700&family=JetBrains+Mono:wght@400;700&display=swap';

const FONT_INTER = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_FRAUNCES = "'Fraunces', Georgia, 'Times New Roman', serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";

const INK = '#141420';
const INK_2 = '#1C1C2A';
const CHARCOAL = '#262638';
const PINK = '#F5A0B5';
const PINK_BRIGHT = '#FF6B92';
const WHITE = '#FFFFFF';
const SLATE = '#8585A8';

function emailLayout(content: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<link href="${FONTS_URL}" rel="stylesheet">
<title>Mirai</title>
<!--[if mso]><style>*{font-family:sans-serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${INK};font-family:${FONT_INTER};-webkit-font-smoothing:antialiased;">
<!-- Preview text -->
<div style="display:none;max-height:0;overflow:hidden;color:${INK};">${previewText}${'&#847; '.repeat(40)}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${INK};">
<tr><td align="center" style="padding:40px 16px;">

<!-- Container -->
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${INK_2};border:1px solid rgba(255,255,255,0.06);border-radius:16px;">

<!-- Header -->
<tr><td style="padding:32px 40px 0 40px;">
  <span style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:${PINK};">MIRAI</span>
</td></tr>

<!-- Content -->
<tr><td style="padding:24px 40px 32px 40px;">
${content}
</td></tr>

<!-- Divider -->
<tr><td style="padding:0 40px;">
  <div style="height:1px;background:rgba(255,255,255,0.06);"></div>
</td></tr>

<!-- Footer -->
<tr><td style="padding:24px 40px 32px 40px;">
  <p style="margin:0;font-family:${FONT_MONO};font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:${SLATE};line-height:1.6;">
    Mirai Tech PopUp City<br>
    Port Island, Kobe, Japan &middot; Oct 1&ndash;31, 2026
  </p>
</td></tr>

</table>
<!-- /Container -->

</td></tr>
</table>
</body>
</html>`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 16px 0;font-family:${FONT_FRAUNCES};font-size:28px;font-weight:600;color:${WHITE};line-height:1.3;">${text}</h1>`;
}

function paragraph(text: string, color: string = WHITE): string {
  return `<p style="margin:0 0 16px 0;font-family:${FONT_INTER};font-size:16px;line-height:1.65;color:${color};">${text}</p>`;
}

function ctaButton(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td style="background-color:${PINK_BRIGHT};border-radius:999px;">
  <a href="${url}" target="_blank" style="display:inline-block;padding:14px 32px;font-family:${FONT_MONO};font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${INK};text-decoration:none;">${text}</a>
</td></tr>
</table>`;
}

function detailsBox(lines: string[]): string {
  const rows = lines
    .map(
      (line) =>
        `<tr><td style="padding:4px 0;font-family:${FONT_INTER};font-size:14px;color:${WHITE};line-height:1.5;">${line}</td></tr>`,
    )
    .join('');
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:${CHARCOAL};border:1px solid rgba(255,255,255,0.06);border-radius:12px;margin:20px 0;">
<tr><td style="padding:20px 24px;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${rows}</table>
</td></tr>
</table>`;
}

function label(text: string): string {
  return `<span style="font-family:${FONT_MONO};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${PINK};">${text}</span>`;
}

function smallNote(text: string): string {
  return `<p style="margin:16px 0 0 0;font-family:${FONT_INTER};font-size:13px;line-height:1.5;color:${SLATE};">${text}</p>`;
}

// ---------------------------------------------------------------------------
// Plain text fallbacks
// ---------------------------------------------------------------------------

function approvalPlainText(name: string, paymentUrl: string): string {
  return [
    `Hi ${name},`,
    '',
    "Great news \u2014 you've been accepted to Mirai Tech PopUp City!",
    '',
    'Complete your registration by securing your spot:',
    paymentUrl,
    '',
    'Event details:',
    '  Dates: October 1\u201331, 2026',
    '  Location: Port Island, Kobe, Japan',
    '  Venue: KBIC (Kobe Biomedical Innovation Cluster)',
    '',
    "This link is unique to you \u2014 please don't share it.",
    '',
    '\u2014 The Mirai Team',
  ].join('\n');
}

function loginCodePlainText(code: string): string {
  return [
    `Your login code is: ${code}`,
    '',
    'This code expires in 10 minutes.',
    '',
    "If you didn't request this, you can ignore this email.",
    '',
    '\u2014 The Mirai Team',
  ].join('\n');
}

function paymentConfirmationPlainText(name?: string): string {
  return [
    name ? `Hi ${name},` : 'Hi,',
    '',
    "Your payment is confirmed \u2014 you're officially coming to Mirai Tech PopUp City!",
    '',
    'Event details:',
    '  Dates: October 1\u201331, 2026',
    '  Location: Port Island, Kobe, Japan',
    '  Venue: KBIC (Kobe Biomedical Innovation Cluster)',
    '',
    'Check the event console for upcoming programming and updates:',
    CONSOLE_URL,
    '',
    'See you in Kobe!',
    '\u2014 The Mirai Team',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Email senders
// ---------------------------------------------------------------------------

export async function sendApprovalEmail({
  to,
  name,
  paymentUrl,
}: ApprovalEmailParams): Promise<EmailResult> {
  try {
    const resend = getResend();

    const html = emailLayout(
      [
        heading("You're in!"),
        paragraph(`Hi ${name}, great news &mdash; you've been accepted to Mirai Tech PopUp City.`),
        paragraph('Complete your registration by securing your spot:'),
        ctaButton('Complete Registration \u2192', paymentUrl),
        detailsBox([
          `${label('Dates')} &nbsp; October 1&ndash;31, 2026`,
          `${label('Location')} &nbsp; Port Island, Kobe, Japan`,
          `${label('Venue')} &nbsp; KBIC (Kobe Biomedical Innovation Cluster)`,
        ]),
        smallNote("This link is unique to you &mdash; please don't share it."),
      ].join('\n'),
      `You've been accepted to Mirai Tech PopUp City! Complete your registration.`,
    );

    await resend.emails.send({
      from: fromAddress(),
      to,
      subject: "You're in! Complete your Mirai registration",
      html,
      text: approvalPlainText(name, paymentUrl),
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[email] sendApprovalEmail failed', { to, name, error: message });
    return { success: false, error: message };
  }
}

export async function sendLoginCode({
  to,
  code,
}: LoginCodeParams): Promise<EmailResult> {
  try {
    const resend = getResend();

    const html = emailLayout(
      [
        heading('Your login code'),
        paragraph('Enter this code to sign in to the Mirai console:'),
        `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0;">
<tr><td align="center" style="background-color:${CHARCOAL};border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;">
  <span style="font-family:${FONT_MONO};font-size:36px;font-weight:700;letter-spacing:0.3em;color:${WHITE};">${code}</span>
</td></tr>
</table>`,
        smallNote('This code expires in 10 minutes.'),
        smallNote("If you didn't request this, you can safely ignore this email."),
      ].join('\n'),
      `Your Mirai login code is ${code}`,
    );

    await resend.emails.send({
      from: fromAddress(),
      to,
      subject: 'Your Mirai login code',
      html,
      text: loginCodePlainText(code),
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[email] sendLoginCode failed', { to, error: message });
    return { success: false, error: message };
  }
}

export async function sendPaymentConfirmation({
  to,
  name,
}: PaymentConfirmationParams): Promise<EmailResult> {
  try {
    const resend = getResend();

    const greeting = name ? `Hi ${name}, your` : 'Your';

    const html = emailLayout(
      [
        heading('See you in Kobe!'),
        paragraph(`${greeting} payment is confirmed &mdash; you're officially coming to Mirai Tech PopUp City.`),
        detailsBox([
          `${label('Status')} &nbsp; <span style="color:#4ADE80;">&#10003; Confirmed</span>`,
          `${label('Dates')} &nbsp; October 1&ndash;31, 2026`,
          `${label('Location')} &nbsp; Port Island, Kobe, Japan`,
          `${label('Venue')} &nbsp; KBIC (Kobe Biomedical Innovation Cluster)`,
        ]),
        paragraph('Check the event console for upcoming programming and updates:'),
        ctaButton('Open Event Console \u2192', CONSOLE_URL),
      ].join('\n'),
      `Payment confirmed! You're coming to Mirai Tech PopUp City in Kobe.`,
    );

    await resend.emails.send({
      from: fromAddress(),
      to,
      subject: 'Payment confirmed \u2014 see you in Kobe!',
      html,
      text: paymentConfirmationPlainText(name),
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[email] sendPaymentConfirmation failed', { to, error: message });
    return { success: false, error: message };
  }
}
