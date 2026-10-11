# Citizen avatar

Shared foundation for the pixel-art citizen avatar: a static layer catalog, a 10-char code that
identifies a build, and a plain-JS renderer. No build step, no framework — `avatar.js` loads like
any other script and sets `window.MTCAvatar`.

```html
<script src="/citizens/avatar/avatar.js"></script>
<script>
  var state = MTCAvatar.render(document.getElementById('char'), MTCAvatar.defaults());
  var code = MTCAvatar.encode(state); // "1m0000----" — save this in a profile, not the state object
</script>
```

## Code format

10 characters, versioned so old codes keep decoding the same way even if the format changes later.

| chars | meaning |
|---|---|
| 0 | format version, always `'1'` for this format |
| 1 | body: `m` or `f` |
| 2 | skin — base36 index into the skins list |
| 3 | hair style — base36 index into *that body's* style list (`m` and `f` have different lists — `m`: short, buzz, mohawk, big, long, wild; `f`: bob, wild, swept, bun) |
| 4 | hair colour — base36 index into the colours list |
| 5 | eyes — base36 index into the eyes list |
| 6 | head augment — base36 index into the head options, or `-` for none |
| 7 | eye augment — base36 index into the eyewear options, or `-` for none |
| 8 | chest augment — base36 index into the chest options, or `-` for none |
| 9 | hand augment — base36 index into the hands options, or `-` for none |

Index 0 of every list is that field's default value, so the default build's code reads `...0000----`.

**Examples**

- `MTCAvatar.encode(MTCAvatar.defaults())` → `"1m0000----"` — Type 1, light skin, short black hair,
  round eyes, no augments.
- `"1f11450-11"` → Type 2, porcelain skin, wild cyan hair, wide eyes, a neural crown, no
  eye augment, the reactor chest augment, spark-fist hands.

`decode()` is the exact inverse of `encode()` and round-trips for every valid state; it returns
`null` for anything malformed (wrong length, wrong version, unknown body, or an index out of range
for that field).

## Versioning

`v1/` under this folder holds the current PNG layer cut. If the art is ever re-cut, the new files
go in `v2/` and `avatar.js` switches its layer root — existing saved codes keep rendering against
whichever version they were made for, and nothing needs cache-busting query strings.

## Profile storage

`saveProfile()` / `loadProfile()` read and write one JSON object in `localStorage` under the key
`MTCAvatar.PROFILE_KEY` (`"mtc_citizen"`):

```json
{
  "v": 1,
  "code": "1m0000----",
  "name": "Nelson",
  "bio": "Building the thing.",
  "x": "nelson",
  "linkedin": "nelson-okwuosa",
  "createdAt": "2026-10-10T18:13:20.000Z"
}
```

`saveProfile()` also mirrors `profile.name` into `localStorage["mtc_name"]`, which is what the map
page reads for the "you" pin. Both helpers catch storage errors (private mode, blocked storage) and
never throw; `loadProfile()` returns `null` if there is no profile or it can't be parsed.

## Layer order

Bottom to top: `gear_<head>` (**only** when the head augment is `crown` — it sits *behind* the
body) → `skin` → `hair` → `eyes` → `gear_<eyewear>` → `gear_<chest>` → `gear_<hands>` →
`gear_<head>` (when the head augment is anything other than `crown`, it draws on top instead).

## API

- `MTCAvatar.load()` → `Promise<catalog>`. Fetches and caches `/citizens/avatar/catalog.json` — the
  full option catalog (bodies, skins, colours, eyes, augment slots, labels, swatches) a page needs
  to build its own pickers, so no page hardcodes the option lists.
- `MTCAvatar.defaults()` → a default state object.
- `MTCAvatar.encode(state)` → the 10-char code for a state. Falls back to encoding `defaults()` if
  the state is invalid; never throws.
- `MTCAvatar.decode(code)` → the state object for a code, or `null` if malformed.
- `MTCAvatar.random()` → a random valid state (each augment slot 50% none).
- `MTCAvatar.render(el, stateOrCode, opts)` → clears `el`, sizes it to `64*scale × 80*scale` px
  (`opts.scale`, default 4), stacks one `<img>` per layer in order, and returns the state it rendered
  (falling back to defaults for invalid input). Accepts either a code string or a state object.
- `MTCAvatar.layers(state)` → the ordered array of layer file paths for a state (for a future PNG
  export). Accepts a code string or a state object.
- `MTCAvatar.PROFILE_KEY` → `"mtc_citizen"`, the localStorage key.
- `MTCAvatar.loadProfile()` / `MTCAvatar.saveProfile(profile)` → read/write the profile above.

## Changelog

- 2026-10-11 — removed `long` and `pony` from the `f` style list (they looked identical to `wild`);
  the new `f` order is `bob, wild, swept, bun`. Any code made before this change with an `f` style
  index of `long` or `pony` is not compatible — there are none in the wild, since storage is
  local-only.
