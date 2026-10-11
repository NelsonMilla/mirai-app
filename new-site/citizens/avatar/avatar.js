/* MTCAvatar — shared pixel-art citizen avatar: catalog loading, a 10-char code for a build, and a renderer.
   Usage (plain script, no modules):
     <script src="/citizens/avatar/avatar.js"></script>
     MTCAvatar.load().then(function (catalog) { ... build pickers from catalog ... });
     var state = MTCAvatar.render(document.getElementById('char'), MTCAvatar.defaults());
     var code = MTCAvatar.encode(state); // save this, not the state object
   catalog.json is the single option list pages read to build their own pickers (ids + labels + swatches),
   so no page hardcodes skin/hair/eyes/augment option lists. The same ordered lists are mirrored as plain
   arrays below so encode/decode/render/layers work synchronously — they don't need to await a fetch.
   Keep the two in sync by hand if an option is ever added or reordered. */
(function () {
  var BASE = '/citizens/avatar/';
  var LAYER_ROOT = BASE + 'v1/'; // v1 = this layer cut; a re-cut goes in v2/ so old codes keep rendering the old art
  var CATALOG_URL = BASE + 'catalog.json';
  var VERSION = '1'; // code format version, char 0
  var PROFILE_KEY = 'mtc_citizen';

  // index 0 of every list is the default() value, so the default build's code reads "...0000----".
  var BODIES = {
    m: ['short', 'buzz', 'mohawk', 'big', 'long', 'wild'],
    f: ['bob', 'wild', 'swept', 'bun']
  };
  var SKINS = ['light', 'porcelain', 'tan', 'olive', 'brown', 'deep'];
  var COLOURS = ['black', 'brown', 'blonde', 'pink', 'cyan', 'silver'];
  var EYES = ['round', 'happy', 'narrow', 'sleepy', 'cyborg', 'wide'];
  var AUG = {
    head: ['crown', 'sleep_halo', 'antenna'],
    eyewear: ['mono', 'hud', 'third_eye'],
    chest: ['core', 'reactor', 'harness'],
    hands: ['gauntlet', 'spark', 'pipette']
  };
  // the code's augment chars (6-9) in this order; also the tail of the visible stack order below
  var AUG_SLOTS = ['head', 'eyewear', 'chest', 'hands'];

  var catalogPromise = null;

  function load() {
    if (!catalogPromise) {
      catalogPromise = fetch(CATALOG_URL).then(function (res) { return res.json(); });
    }
    return catalogPromise;
  }

  function defaults() {
    return { body: 'm', skin: 'light', style: 'short', colour: 'black', eyes: 'round',
      head: null, eyewear: null, chest: null, hands: null };
  }

  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  function random() {
    var body = Math.random() < 0.5 ? 'm' : 'f', styles = BODIES[body];
    var state = { body: body, skin: pick(SKINS), style: pick(styles), colour: pick(COLOURS), eyes: pick(EYES) };
    for (var i = 0; i < AUG_SLOTS.length; i++) {
      var slot = AUG_SLOTS[i];
      state[slot] = Math.random() < 0.5 ? pick(AUG[slot]) : null; // 50% none, per slot
    }
    return state;
  }

  // a full, valid state (never partial) — any invalid input falls back whole to defaults()
  function normalize(input) {
    var s;
    if (typeof input === 'string') { s = decode(input); return s || defaults(); }
    s = input || {};
    var body = s.body === 'f' ? 'f' : (s.body === 'm' ? 'm' : null);
    if (!body) return defaults();
    var styles = BODIES[body];
    if (SKINS.indexOf(s.skin) < 0 || styles.indexOf(s.style) < 0 ||
        COLOURS.indexOf(s.colour) < 0 || EYES.indexOf(s.eyes) < 0) return defaults();
    for (var i = 0; i < AUG_SLOTS.length; i++) {
      var slot = AUG_SLOTS[i], v = s[slot];
      if (v && AUG[slot].indexOf(v) < 0) return defaults();
    }
    return { body: body, skin: s.skin, style: s.style, colour: s.colour, eyes: s.eyes,
      head: s.head || null, eyewear: s.eyewear || null, chest: s.chest || null, hands: s.hands || null };
  }

  function b36(i) { return i.toString(36); }

  function indexOrZero(list, id) { var i = list.indexOf(id); return i >= 0 ? i : 0; }

  function encode(state) {
    var s = normalize(state); // encode never throws on a bad state; it encodes the defaults instead
    var styles = BODIES[s.body];
    var out = VERSION + s.body +
      b36(indexOrZero(SKINS, s.skin)) +
      b36(indexOrZero(styles, s.style)) +
      b36(indexOrZero(COLOURS, s.colour)) +
      b36(indexOrZero(EYES, s.eyes));
    for (var i = 0; i < AUG_SLOTS.length; i++) {
      var slot = AUG_SLOTS[i], list = AUG[slot], id = s[slot], at = id ? list.indexOf(id) : -1;
      out += at >= 0 ? b36(at) : '-';
    }
    return out;
  }

  function decode(code) {
    if (typeof code !== 'string' || code.length !== 10) return null;
    if (code.charAt(0) !== VERSION) return null;
    var body = code.charAt(1);
    if (body !== 'm' && body !== 'f') return null;
    var styles = BODIES[body];
    var skinI = parseInt(code.charAt(2), 36);
    var styleI = parseInt(code.charAt(3), 36);
    var colourI = parseInt(code.charAt(4), 36);
    var eyesI = parseInt(code.charAt(5), 36);
    if (!(skinI >= 0 && skinI < SKINS.length)) return null;
    if (!(styleI >= 0 && styleI < styles.length)) return null;
    if (!(colourI >= 0 && colourI < COLOURS.length)) return null;
    if (!(eyesI >= 0 && eyesI < EYES.length)) return null;
    var state = { body: body, skin: SKINS[skinI], style: styles[styleI], colour: COLOURS[colourI], eyes: EYES[eyesI] };
    for (var i = 0; i < AUG_SLOTS.length; i++) {
      var slot = AUG_SLOTS[i], ch = code.charAt(6 + i), list = AUG[slot];
      if (ch === '-') { state[slot] = null; continue; }
      var ai = parseInt(ch, 36);
      if (!(ai >= 0 && ai < list.length)) return null;
      state[slot] = list[ai];
    }
    return state;
  }

  // ordered layer file paths, bottom to top. gear_crown is the one augment drawn behind the body.
  function layers(state) {
    var s = normalize(state), dir = LAYER_ROOT + s.body + '/', out = [];
    if (s.head === 'crown') out.push(dir + 'gear_crown.png');
    out.push(dir + 'skin_' + s.skin + '.png');
    out.push(dir + 'hair_' + s.style + '_' + s.colour + '.png');
    out.push(dir + 'eyes_' + s.eyes + '.png');
    if (s.eyewear) out.push(dir + 'gear_' + s.eyewear + '.png');
    if (s.chest) out.push(dir + 'gear_' + s.chest + '.png');
    if (s.hands) out.push(dir + 'gear_' + s.hands + '.png');
    if (s.head && s.head !== 'crown') out.push(dir + 'gear_' + s.head + '.png');
    return out;
  }

  function render(el, stateOrCode, opts) {
    var s = normalize(stateOrCode), o = opts || {}, scale = o.scale || 4;
    var w = 64 * scale, h = 80 * scale;
    el.innerHTML = '';
    el.style.position = 'relative';
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    var files = layers(s);
    for (var i = 0; i < files.length; i++) {
      var img = document.createElement('img');
      img.src = files[i];
      img.alt = '';
      img.draggable = false;
      img.style.position = 'absolute';
      img.style.left = '0';
      img.style.top = '0';
      img.style.width = w + 'px';
      img.style.imageRendering = 'pixelated';
      el.appendChild(img);
    }
    return s;
  }

  function loadProfile() {
    try {
      var raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return null;
      var p = JSON.parse(raw);
      return (p && typeof p === 'object') ? p : null;
    } catch (e) { return null; } // blocked/private storage: treat as no profile, never throw
  }

  function saveProfile(profile) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      if (profile && profile.name) localStorage.setItem('mtc_name', profile.name); // the map's "you" pin reads this
    } catch (e) {}
  }

  window.MTCAvatar = {
    load: load,
    defaults: defaults,
    encode: encode,
    decode: decode,
    random: random,
    render: render,
    layers: layers,
    PROFILE_KEY: PROFILE_KEY,
    loadProfile: loadProfile,
    saveProfile: saveProfile
  };
})();
