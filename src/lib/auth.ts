import { createHmac } from 'crypto';
import { cookies } from 'next/headers';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const CODE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const SESSION_COOKIE = 'mirai_session';

function getSecret(): string {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) throw new Error('TOKEN_SECRET environment variable is not set');
  return secret;
}

// ---------------------------------------------------------------------------
// Login code store (in-memory — resets on server restart)
// ---------------------------------------------------------------------------

const codeStore = new Map<string, { code: string; expiresAt: number }>();

export function generateLoginCode(email: string): string {
  const code = String(Math.floor(100_000 + Math.random() * 900_000)); // 6 digits
  codeStore.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + CODE_EXPIRY_MS,
  });
  return code;
}

export function verifyLoginCode(
  email: string,
  code: string,
): boolean {
  const key = email.toLowerCase();
  const entry = codeStore.get(key);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    codeStore.delete(key);
    return false;
  }
  if (entry.code !== code) return false;
  codeStore.delete(key); // single-use
  return true;
}

// ---------------------------------------------------------------------------
// Session — HMAC-signed cookie (same pattern as tokens.ts)
// ---------------------------------------------------------------------------

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

function base64url(data: string): string {
  return Buffer.from(data).toString('base64url');
}

function fromBase64url(data: string): string {
  return Buffer.from(data, 'base64url').toString('utf-8');
}

export function createSessionToken(email: string): string {
  const payload = base64url(
    JSON.stringify({ email: email.toLowerCase(), exp: Date.now() + SESSION_EXPIRY_MS }),
  );
  return `${payload}.${sign(payload)}`;
}

export function validateSessionToken(
  token: string,
): { valid: true; email: string } | { valid: false } {
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false };

  const [payload, signature] = parts;
  if (sign(payload) !== signature) return { valid: false };

  try {
    const data = JSON.parse(fromBase64url(payload)) as { email: string; exp: number };
    if (!data.email || !data.exp) return { valid: false };
    if (Date.now() > data.exp) return { valid: false };
    return { valid: true, email: data.email };
  } catch {
    return { valid: false };
  }
}

// ---------------------------------------------------------------------------
// Cookie helpers (for use in API routes / server components)
// ---------------------------------------------------------------------------

export async function setSessionCookie(email: string): Promise<void> {
  const token = createSessionToken(email);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(SESSION_EXPIRY_MS / 1000),
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ email: string } | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const result = validateSessionToken(token);
  if (!result.valid) return null;
  return { email: result.email };
}

// ---------------------------------------------------------------------------
// Admin check
// ---------------------------------------------------------------------------

export function isAdmin(email: string): boolean {
  const adminList = process.env.ADMIN_EMAILS ?? '';
  const admins = adminList
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}
