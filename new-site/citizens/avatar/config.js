/* MTC_SUPABASE — Supabase project connection. Filled in per environment; left empty by default
   so MTCDb.configured() is false and pages fall back to local-only behaviour until this is set.
   See supabase/README.md for where to copy these from. Do not commit real keys here if this repo
   is public — the anon key is safe to ship (RLS gates everything), but keep it out of git history
   if that matters to you. */
window.MTC_SUPABASE = {
  url: 'https://kccbjkzdnpintyyfyadz.supabase.co',
  anonKey: 'sb_publishable_PqhynjEx4PomcVFhNW-yTA_Wz8exfyy'
};
