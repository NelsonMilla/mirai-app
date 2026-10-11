# Supabase — citizens directory

One table (`public.citizens`), one public view (`public.citizens_public`), email-OTP auth. Backs
the "you" / "directory" pages under `new-site/citizens/`.

## Set up a project

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the contents of `migrations/0001_citizens.sql`, and run it. It's
   idempotent — safe to re-run if you need to.
3. Go to **Authentication → Providers → Email**:
   - Enable the Email provider.
   - Turn on **Email OTP** (6-digit code sign-in).
   - Turn off **Confirm email** if it's on — citizens sign in with the code itself, there's no
     separate confirmation step.
4. **Authentication → URL Configuration**: add the page's URLs as **Redirect URLs**, and set the
   **Site URL** to the production one:
   - `http://localhost:4321/citizens/you/` (local dev)
   - `https://mirai-tech-city.vercel.app/citizens/you/` (production — also the Site URL)

   The page itself handles either delivery style Supabase's mailer might send: a six-digit code
   typed into the page, or a button/link in the email that opens one of these URLs and signs the
   person in automatically (no code needed). Both need to work, so both the template step below
   and this redirect allowlist matter.
5. **Email templates: send a code, not a link**.
   Supabase's default "Confirm signup" and "Magic Link" templates contain a confirmation link.
   The site's sign-in expects a six-digit code instead. Edit both templates under
   **Authentication → Email Templates** to remove the link and include the `{{ .Token }}` placeholder:

   ```html
   <h2>Your Mirai Tech City code</h2>
   <p>Enter this code on the page to sign in:</p>
   <p style="font-size:28px;letter-spacing:4px"><strong>{{ .Token }}</strong></p>
   <p>It expires in one hour. If you didn't request it, ignore this email.</p>
   ```

   Verify **Email OTP length** under **Providers → Email** is set to 6. The first test on
   2026-10-11 failed because the default template was in place (symptom: an email saying
   "Confirm your email address" with a link instead of a code).
6. **Before the event**: Supabase's built-in email sender allows only about two emails per hour,
   total, across all sign-ins — plainly not enough to test with, let alone survive a room full of
   people signing up at once. Any testing beyond a couple of sign-ins needs custom SMTP (Settings
   → Authentication → SMTP Settings) with a real provider — Resend or similar — set up ahead of
   time.

## Wire up the site

Copy from the project's **Settings → API** page:
- **Project URL** → `url` in `new-site/citizens/avatar/config.js`
- **anon / public key** → `anonKey` in the same file

```js
window.MTC_SUPABASE = { url: 'https://xxxx.supabase.co', anonKey: 'eyJ...' };
```

The anon key is public by design — it's meant to sit in client-side code, and Row Level Security
(enabled on `citizens`) is what actually restricts what it can read and write. **Never** put the
service role key anywhere in `new-site/` — it bypasses RLS entirely.

## Verify

Open `new-site/citizens/avatar/db-test.html` (served statically, e.g. via the `new-site` preview
config) with `config.js` filled in:
- "configured" should read yes.
- **List citizens** should return the 16 seed rows plus any real signups.
- Sign in with an email you control, retrieve the 6-digit code, verify it, then **Save sample
  citizen** using any valid code (see `new-site/citizens/avatar/README.md` for the format — the
  default build's code is `1m0000----`).
- **My citizen** should return what you just saved; **Delete** should remove it; **Sign out**
  should clear the session.

## Table and policy summary

- `public.citizens` — one row per citizen, RLS enabled. Anyone can read rows where `visible =
  true`; a signed-in user can insert/update/delete only their own row (`user_id = auth.uid()`),
  and only non-seed inserts.
- `public.citizens_public` — the columns safe to show publicly (no `user_id`), `security_invoker`
  so the same RLS still applies through the view.

## Clear seed rows

The 16 mock citizens from `new-site/citizens/data/citizens.json` are inserted with `is_seed =
true` and no `user_id`. To remove them once real citizens exist:

```sql
delete from public.citizens where is_seed;
```
