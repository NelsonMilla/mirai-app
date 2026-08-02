# Contributing to Mirai

Thanks for helping build the site! It's a small codebase with strong conventions — a few minutes of reading saves a review round-trip.

## Setup

```bash
npm install
npm run dev
```

No env vars needed for landing-page work. See [.env.example](.env.example) if you're touching analytics or the dormant routes.

## Ground rules

1. **Read [AGENTS.md](AGENTS.md) first.** It's the source of truth for where styles live, how sections are wired, and what not to touch. It applies to humans and AI agents alike.
2. **Keep diffs surgical.** Touch only what your change needs. Don't reformat, refactor, or "improve" adjacent code — it makes review harder and has broken things before.
3. **Don't edit frozen data.** Copy and numbers in `src/lib/constants.ts` and `src/data/` are audited against the event deck. If something looks wrong, open an issue instead of changing it.
4. **Leave dormant code alone.** `src/app/checkout|console|invite` and their libs are intentionally kept (see [src/app/checkout/README.md](src/app/checkout/README.md)).
5. **Design/copy changes need context.** Read [PRODUCT.md](PRODUCT.md) and [DESIGN.md](DESIGN.md) before proposing visual or wording changes, and say in the PR why the change fits the brand.

## Before opening a PR

All three must pass locally:

```bash
npx tsc --noEmit
npm run build
npm run smoke   # first run: npx playwright install chromium
```

## PR guidelines

- One concern per PR — small PRs get reviewed fast.
- Describe *what* changed and *why*; screenshots for anything visual (desktop + mobile widths).
- For anything bigger than a fix, open an issue first so we can agree on direction before you invest time.

## License

By contributing, you agree your contributions are licensed under the [MIT License](LICENSE). Note that Mirai brand assets are excluded from MIT — see the License section of the [README](README.md#license).
