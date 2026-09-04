import { createHmac } from 'crypto';

function getSecret(): string {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) throw new Error('TOKEN_SECRET environment variable is not set');
  return secret;
}

function base64url(data: string): string {
  return Buffer.from(data).toString('base64url');
}

function fromBase64url(data: string): string {
  return Buffer.from(data, 'base64url').toString('utf-8');
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

export function generatePaymentToken(email: string): string {
  const payload = base64url(
    JSON.stringify({ email: email.toLowerCase() })
  );
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function validatePaymentToken(token: string): { valid: true; email: string } | { valid: false; reason: string } {
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false, reason: 'Malformed token' };

  const [payload, signature] = parts;
  const expectedSig = sign(payload);

  if (signature !== expectedSig) return { valid: false, reason: 'Invalid signature' };

  try {
    const data = JSON.parse(fromBase64url(payload)) as { email: string };

    if (!data.email) return { valid: false, reason: 'Malformed payload' };

    return { valid: true, email: data.email };
  } catch {
    return { valid: false, reason: 'Malformed payload' };
  }
}
