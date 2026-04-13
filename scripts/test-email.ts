/**
 * Email test script — runs server-side only, never exposed to clients.
 *
 * Usage:
 *   npx tsx scripts/test-email.ts                     # sends to delivered@resend.dev (no real delivery)
 *   npx tsx scripts/test-email.ts you@email.com       # sends to your real inbox
 *
 * Requires RESEND_API_KEY in .env.local (loaded automatically below).
 */

import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import {
  sendApprovalEmail,
  sendLoginCode,
  sendPaymentConfirmation,
  checkLoginCodeRateLimit,
} from '../src/lib/email';

const to = process.argv[2] ?? 'delivered@resend.dev';

function log(label: string, result: { success: boolean; error?: string }) {
  const icon = result.success ? '\u2705' : '\u274c';
  console.log(`${icon} ${label}${result.error ? ` — ${result.error}` : ''}`);
}

async function main() {
  console.log(`\nTesting emails → ${to}\n`);

  // ---- 1. Approval email ----
  const approval = await sendApprovalEmail({
    to,
    name: 'Test User',
    paymentUrl: 'https://mirai.city/checkout?token=test_abc123',
  });
  log('Approval email', approval);

  // ---- 2. Login code email ----
  const loginCode = await sendLoginCode({
    to,
    code: '482901',
  });
  log('Login code email', loginCode);

  // ---- 3. Payment confirmation email ----
  const confirmation = await sendPaymentConfirmation({
    to,
    name: 'Test User',
  });
  log('Payment confirmation email', confirmation);

  // ---- 4. Rate limiter test ----
  console.log('\nRate limiter test (4 requests, limit is 3):');
  const testEmail = 'ratelimit-test@example.com';

  for (let i = 1; i <= 4; i++) {
    const check = checkLoginCodeRateLimit(testEmail);
    if (check.allowed) {
      console.log(`  Request ${i}: \u2705 allowed`);
    } else {
      console.log(`  Request ${i}: \u26d4 blocked — retry in ${check.retryAfterMinutes} min`);
    }
  }

  console.log('\nDone.\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
