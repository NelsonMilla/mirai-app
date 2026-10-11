/* MTCDb — thin wrapper around Supabase for the citizens directory. Plain script, no modules:
     <script src="/citizens/avatar/config.js"></script>
     <script src="/citizens/avatar/db.js"></script>
     MTCDb.configured() // true once config.js has a url + anonKey
     MTCDb.listCitizens().then(function (rows) { ... });
   Loads the supabase-js v2 UMD build from a CDN lazily (only once something actually needs it),
   using the url/anonKey from window.MTC_SUPABASE (see config.example.js). Every method below
   returns a Promise. When not configured, each rejects with an Error whose .code is
   'NOT_CONFIGURED' so pages can fall back to local-only behaviour on that one check. Any other
   failure rejects with an Error carrying a plain-English .message and the original error on
   .cause.

   Session is always async: MTCDb.session() returns a Promise<{email, userId} | null> — that is
   the only correct way to ask supabase-js for the current session. For UI that needs a
   synchronous read (e.g. painting "Signed in as..." before anything has had a chance to await),
   use MTCDb.currentSession(), which returns that same shape directly, never wrapped in a
   Promise. It's a cache, kept current from onAuth() events and from session()'s own
   getSession() resolution; it reads as null (same as "signed out") until the first of those
   resolves, so don't treat a null from it as proof there's no session this early. */
(function () {
  var CDN_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';

  var scriptPromise = null;
  function loadSupabaseScript() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    if (scriptPromise) return scriptPromise;
    scriptPromise = new Promise(function (resolve, reject) {
      var el = document.createElement('script');
      el.src = CDN_URL;
      el.onload = function () {
        if (window.supabase && window.supabase.createClient) resolve();
        else reject(new Error('Supabase script loaded but did not set up window.supabase.'));
      };
      el.onerror = function () { reject(new Error('Could not load the Supabase client script.')); };
      document.head.appendChild(el);
    });
    return scriptPromise;
  }

  var clientPromise = null;
  function getClient() {
    if (!clientPromise) {
      clientPromise = loadSupabaseScript().then(function () {
        // detectSessionInUrl covers both delivery styles: a PKCE `?code=...` (link-style email)
        // and the implicit `#access_token=...` fragment; either is resolved before getSession()
        // (and so consumeAuthRedirect() below) returns.
        return window.supabase.createClient(window.MTC_SUPABASE.url, window.MTC_SUPABASE.anonKey, {
          auth: { detectSessionInUrl: true, flowType: 'pkce', persistSession: true }
        });
      });
    }
    return clientPromise;
  }

  function configured() {
    var cfg = window.MTC_SUPABASE;
    return !!(cfg && cfg.url && cfg.anonKey);
  }

  function notConfiguredError() {
    var err = new Error('Supabase is not configured yet.');
    err.code = 'NOT_CONFIGURED';
    return err;
  }

  function notSignedInError() {
    var err = new Error('Sign in before saving or deleting your citizen.');
    err.code = 'NOT_SIGNED_IN';
    return err;
  }

  // true for a 429 or any error whose message mentions a rate limit — Supabase's shared
  // signInWithOtp/verifyOtp rate limit shows up this way regardless of which call hit it.
  function isRateLimited(err) {
    if (!err) return false;
    if (err.status === 429) return true;
    return /rate limit/i.test(err.message || '');
  }

  // wraps any other failure in a readable message, keeping the original error on .cause
  function fail(err, message) {
    if (err && (err.code === 'NOT_CONFIGURED' || err.code === 'NOT_SIGNED_IN')) throw err;
    if (isRateLimited(err)) {
      var rateLimited = new Error('Too many sign-in emails were sent recently. Wait a while and try again.');
      rateLimited.cause = err;
      throw rateLimited;
    }
    var wrapped = new Error(message);
    wrapped.cause = err;
    throw wrapped;
  }

  function toSession(s) {
    return (s && s.user) ? { email: s.user.email, userId: s.user.id } : null;
  }

  // last-known session, kept current by session() and onAuth() below; null until either has
  // resolved once. Synchronous — see MTCDb.currentSession() for the contract.
  var cachedSession = null;

  function toCitizen(row) {
    if (!row) return null;
    return { no: row.no, code: row.code, name: row.name, bio: row.bio, x: row.x,
      linkedin: row.linkedin, createdAt: row.created_at, updatedAt: row.updated_at };
  }

  function toPublicCitizen(row) {
    return { no: row.no, code: row.code, name: row.name, bio: row.bio, x: row.x,
      linkedin: row.linkedin, createdAt: row.created_at };
  }

  // resolves the current session (or null), throwing any transport error for the caller to wrap
  function getSession(client) {
    return client.auth.getSession().then(function (res) {
      if (res.error) throw res.error;
      return res.data.session;
    });
  }

  function session() {
    if (!configured()) return Promise.reject(notConfiguredError());
    return getClient().then(getSession).then(toSession)
      .then(function (s) { cachedSession = s; return s; })
      .catch(function (err) { fail(err, 'Could not check the current session.'); });
  }

  // synchronous read of the last-known session — see the file header comment for the contract.
  function currentSession() {
    return cachedSession;
  }

  function onAuth(callback) {
    var subscription = null, unsubscribed = false;
    if (configured()) {
      getClient().then(function (client) {
        if (unsubscribed) return;
        var res = client.auth.onAuthStateChange(function (event, sess) {
          var s = toSession(sess);
          cachedSession = s;
          callback(s);
        });
        subscription = res.data.subscription;
      });
    }
    return function () {
      unsubscribed = true;
      if (subscription) subscription.unsubscribe();
    };
  }

  // current page's URL with no hash and no query string — where a link-style confirmation
  // email should return the browser to.
  function currentPageUrlNoHashNoQuery() {
    return window.location.origin + window.location.pathname;
  }

  function requestCode(email, redirectTo) {
    if (!configured()) return Promise.reject(notConfiguredError());
    var redirect = redirectTo || currentPageUrlNoHashNoQuery();
    return getClient().then(function (client) {
      return client.auth.signInWithOtp({ email: email, options: { shouldCreateUser: true, emailRedirectTo: redirect } });
    }).then(function (res) { if (res.error) throw res.error; })
      .catch(function (err) { fail(err, 'Could not send the sign-in code. Check the email address and try again.'); });
  }

  function verifyCode(email, code) {
    if (!configured()) return Promise.reject(notConfiguredError());
    return getClient().then(function (client) {
      return client.auth.verifyOtp({ email: email, token: code, type: 'email' });
    }).then(function (res) {
      if (res.error) throw res.error;
      return toSession(res.data.session);
    }).catch(function (err) {
      if (/expired|invalid/i.test((err && err.message) || '')) {
        var badCode = new Error('That code is wrong or has expired. Request a new one.');
        badCode.cause = err;
        throw badCode;
      }
      fail(err, 'That code did not work. Check it and try again.');
    });
  }

  // ---- auth redirect (link-style email return): parsing/stripping the URL params Supabase
  // uses for both the PKCE (?code=...) and implicit (#access_token=...) flows.
  var AUTH_PARAM_KEYS = ['code', 'access_token', 'refresh_token', 'expires_in', 'token_type', 'type',
    'error', 'error_code', 'error_description'];

  function parseParamString(str) {
    var out = {};
    if (!str) return out;
    str = str.replace(/^[?#]/, '');
    if (!str) return out;
    str.split('&').forEach(function (pair) {
      if (!pair) return;
      var idx = pair.indexOf('=');
      var k = idx >= 0 ? pair.slice(0, idx) : pair;
      var v = idx >= 0 ? pair.slice(idx + 1) : '';
      try { k = decodeURIComponent(k); } catch (e) {}
      try { v = decodeURIComponent(v.replace(/\+/g, '%20')); } catch (e) {}
      out[k] = v;
    });
    return out;
  }

  // merges query-string and hash-fragment params — a redirect only ever uses one or the
  // other, but checking both is cheap and avoids guessing which flow is in play.
  function authParamsFromUrl() {
    var out = {}, k;
    var searchParams = parseParamString(window.location.search);
    var hashParams = parseParamString(window.location.hash);
    for (k in searchParams) if (searchParams.hasOwnProperty(k)) out[k] = searchParams[k];
    for (k in hashParams) if (hashParams.hasOwnProperty(k)) out[k] = hashParams[k];
    return out;
  }

  // removes any of AUTH_PARAM_KEYS from the query string, and drops the hash entirely if it
  // carries any of those keys (an auth fragment, never one of the page's own step hashes like
  // #look, which has no '=' in it) — leaving any other hash exactly as it was.
  function stripAuthParams() {
    var loc = window.location, changed = false;

    var search = loc.search || '';
    if (search) {
      var kept = search.slice(1).split('&').filter(function (pair) {
        if (!pair) return false;
        var k = pair.split('=')[0];
        if (AUTH_PARAM_KEYS.indexOf(k) >= 0) { changed = true; return false; }
        return true;
      });
      search = kept.length ? '?' + kept.join('&') : '';
    }

    var hash = loc.hash || '';
    if (hash) {
      var hashParams = parseParamString(hash);
      var isAuthHash = AUTH_PARAM_KEYS.some(function (k) { return hashParams.hasOwnProperty(k); });
      if (isAuthHash) { hash = ''; changed = true; }
    }

    if (changed) history.replaceState(null, '', loc.pathname + search + hash);
  }

  // resolves any auth redirect in the current URL (a code or token from a sign-in email) to a
  // session, or null if the URL carries none. Safe to call with nothing in the URL — resolves
  // null immediately without even loading the Supabase script. Rejects with a readable message
  // if the URL itself carried an error (e.g. an expired link), or if exchanging a valid-looking
  // code/token failed. Always strips the auth params from the address bar before settling,
  // whatever the outcome.
  function consumeAuthRedirect() {
    var params = authParamsFromUrl();
    if (!params.code && !params.access_token && !params.error && !params.error_description) {
      return Promise.resolve(null);
    }

    if (params.error || params.error_description) {
      var message = params.error_description || params.error || 'The sign-in link failed.';
      stripAuthParams();
      return Promise.reject(new Error(message));
    }

    if (!configured()) {
      stripAuthParams();
      return Promise.resolve(null);
    }

    return getClient().then(getSession).then(function (sess) {
      stripAuthParams();
      var s = toSession(sess);
      cachedSession = s;
      return s;
    }).catch(function (err) {
      stripAuthParams();
      fail(err, 'Could not complete sign-in from the link.');
    });
  }

  function signOut() {
    if (!configured()) return Promise.reject(notConfiguredError());
    return getClient().then(function (client) { return client.auth.signOut(); })
      .then(function (res) { if (res.error) throw res.error; })
      .catch(function (err) { fail(err, 'Could not sign out.'); });
  }

  function myCitizen() {
    if (!configured()) return Promise.reject(notConfiguredError());
    return getClient().then(function (client) {
      return getSession(client).then(function (sess) {
        if (!sess || !sess.user) return null;
        return client.from('citizens')
          .select('no, code, name, bio, x, linkedin, created_at, updated_at')
          .eq('user_id', sess.user.id)
          .maybeSingle()
          .then(function (res) {
            if (res.error) throw res.error;
            return toCitizen(res.data);
          });
      });
    }).catch(function (err) { fail(err, 'Could not load your citizen.'); });
  }

  function saveCitizen(input) {
    if (!configured()) return Promise.reject(notConfiguredError());
    return getClient().then(function (client) {
      return getSession(client).then(function (sess) {
        if (!sess || !sess.user) throw notSignedInError();
        var row = {
          user_id: sess.user.id,
          code: input.code,
          name: input.name,
          bio: input.bio || '',
          x: input.x ? input.x : null,
          linkedin: input.linkedin ? input.linkedin : null
        };
        return client.from('citizens').upsert(row, { onConflict: 'user_id' })
          .select('no, code, name, bio, x, linkedin, created_at, updated_at')
          .single()
          .then(function (res) {
            if (res.error) throw res.error;
            return toCitizen(res.data);
          });
      });
    }).catch(function (err) { fail(err, 'Could not save your citizen. Check the code, name, X handle and LinkedIn URL.'); });
  }

  function listCitizens() {
    if (!configured()) return Promise.reject(notConfiguredError());
    return getClient().then(function (client) {
      return client.from('citizens_public')
        .select('no, code, name, bio, x, linkedin, created_at')
        .order('no', { ascending: true });
    }).then(function (res) {
      if (res.error) throw res.error;
      var rows = res.data || [], out = [];
      for (var i = 0; i < rows.length; i++) out.push(toPublicCitizen(rows[i]));
      return out;
    }).catch(function (err) { fail(err, 'Could not load the citizens list.'); });
  }

  function deleteCitizen() {
    if (!configured()) return Promise.reject(notConfiguredError());
    return getClient().then(function (client) {
      return getSession(client).then(function (sess) {
        if (!sess || !sess.user) throw notSignedInError();
        return client.from('citizens').delete().eq('user_id', sess.user.id)
          .then(function (res) { if (res.error) throw res.error; });
      });
    }).catch(function (err) { fail(err, 'Could not delete your citizen.'); });
  }

  window.MTCDb = {
    configured: configured,
    session: session,
    currentSession: currentSession,
    onAuth: onAuth,
    requestCode: requestCode,
    verifyCode: verifyCode,
    consumeAuthRedirect: consumeAuthRedirect,
    signOut: signOut,
    myCitizen: myCitizen,
    saveCitizen: saveCitizen,
    listCitizens: listCitizens,
    deleteCitizen: deleteCitizen
  };
})();
