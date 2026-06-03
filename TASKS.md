# TibiaTools — Delegatable Task List

Each task below is **self-contained** and written to be handed directly to an agent with no prior context. Work top-to-bottom by priority, but most tasks are independent and can run in parallel (dependencies are noted).

---

## 📌 Shared context (read once — applies to every task)

- **Stack:** React 19 + TypeScript + Vite 6, Tailwind v4, shadcn/ui ("new-york" style, lucide icons), Redux Toolkit, react-router-dom v7, Firebase (Auth + Firestore), i18next.
- **Routing:** Currently `HashRouter` in `src/App.tsx`. Routes defined in `src/routes.tsx` (all lazy-loaded via `React.lazy` + `<Suspense>`). App is wrapped in `AppLayout` (sidebar) → `ErrorBoundary` → `AppRouting`.
- **i18n is mandatory:** Every user-facing string lives in `src/i18n/locales/en.json`, `es.json`, and `pt.json`. All three files must stay at **identical key structure** (currently 641 leaf keys each). Never hardcode UI text — add a key to all three locales. Access with `const { t } = useTranslation()`.
- **Notifications:** use `sonner` (`import { toast } from 'sonner'`). Delete confirmations use the `alert-dialog` ui component.
- **Errors:** wrap async/catch with `captureError(e, { context: '...' })` from `@/lib/monitoring` (do not use `console.error`).
- **gp formatting:** `formatGp(n)` and `parseGpInput(str)` live in `@/helpers/exaltationForge`. There's also `parseKkString` in `@/helpers` for "40k"/"10kk" inputs.
- **Path alias:** `@/` → `src/`.
- **Adding shadcn components:** `npx shadcn@latest add <name>` (config in `components.json`; outputs to `src/components/ui/`).
- **Commands:**
  - Dev server: `yarn dev`
  - Build (also typechecks): `yarn build` → `tsc -b && vite build`
  - Tests: `npx vitest run` (or `yarn test`)
  - Lint: `npx eslint .` (or `yarn lint`)
- **Definition of done for every task:** `yarn build` passes with zero errors, `npx eslint .` is clean for files you touched, `npx vitest run` is green, and all 3 locale files have matching keys. Update the `## Progress` section in `AGENTS.md` with a one-line summary when done.

---

# P0 — Bugs (fix immediately)

## TASK-1 · Fix Rules-of-Hooks crash in VocationHuntSpotsPage
**Type:** Bug (crash) · **Effort:** S · **Files:** `src/pages/VocationHuntSpotsPage/index.tsx`

**Problem:** The component early-returns before its hooks:
```tsx
const vocation = vocations.find((v) => v.id === vocationId);
if (!vocationId || !vocation) return <Navigate to="/not-found" replace />;  // ⛔ early return
const [userSpots, setUserSpots] = useState(...);   // hooks run conditionally
const [loadingSpots, setLoadingSpots] = useState(true);
// ...useEffect, 2x useMemo, 2x useCallback all below the return
```
This violates the Rules of Hooks. When the user navigates from a **valid** vocation page (hooks ran) to an **invalid** one (early return, hooks skipped), React throws *"Rendered fewer hooks than expected. This may be caused by an accidental early return statement."* and the app crashes. This is the root cause of all 11 `react-hooks/rules-of-hooks` ESLint errors in the repo.

**Fix:**
1. Move the `if (!vocationId || !vocation) return <Navigate ... />` guard to **after** every hook call (just before the main `return (...)`).
2. The hooks reference `vocationId` — keep them safe when it's undefined. `loadSpots` (line ~35) and `mergedSpots` (line ~52) already guard internally; ensure `getAllHuntingSpots(vocationId)` isn't called with `undefined` (early-return inside `loadSpots` if `!vocationId`).
3. While here, fix the `react-hooks/exhaustive-deps` warnings: wrap `translate` in `useCallback` (depends on `t`) and add the missing deps (`minProfit`, `minExp`, `translate`) to the relevant `useMemo`/`useCallback` dependency arrays.

**Verify:**
- `npx eslint src/pages/VocationHuntSpotsPage/index.tsx` → 0 errors/warnings.
- Manually (or in the existing test `src/pages/VocationHuntSpotsPage/__tests__/vocation-hunt-spots-page.test.tsx`): render a valid vocation, then re-render with an invalid `vocationId`, and confirm no React hook-count error is thrown. Add a test case for the valid→invalid transition.
- `npx vitest run` green.

---

## TASK-2 · Fix Exp Share minimum-level off-by-one
**Type:** Bug (incorrect output) · **Effort:** XS · **Files:** `src/components/ExpShareCalculator/exp-share-calculator.tsx`

**Problem:** Tibia's shared-experience rule is *lowest level ≥ ⅔ × highest level*. The calculator computes:
```tsx
min: Math.floor(lvl * 2 / 3),   // ⛔ should be Math.ceil
max: Math.floor(lvl * 3 / 2),   // ✅ correct
```
For level 100, `min` shows **66**, but a level-66 character cannot share (66 < 66.67); the true minimum is **67**. The result is wrong for ~⅔ of all levels (any level not divisible by 3).

**Fix:** Change `min` to `Math.ceil(lvl * 2 / 3)`. Leave `max` as-is.

**Verify:**
- Create `src/components/ExpShareCalculator/__tests__/exp-share-calculator.test.tsx` asserting: level 100 → min 67, max 150; level 99 → min 66, max 148; level 1 → min 1, max 1.
- `npx vitest run` green.

> ⚠️ Confirm the exact rule with the repo owner if unsure, but the math (`lowest ≥ ⌈⅔ × highest⌉`) strongly supports `ceil`.

---

## TASK-3 · Clear lint baseline + add lint to the gate
**Type:** Bug/chore · **Effort:** XS · **Files:** `src/components/ExerciseWeaponsCalculator/exercise-weapons-calculator.tsx`, `package.json`

**Problem:** `npx eslint .` currently fails. One genuine error: `exercise-weapons-calculator.tsx:78` — `let progress` is never reassigned (`prefer-const`). The build script (`tsc -b && vite build`) does **not** run lint, so this slips through CI.

**Fix:**
1. Change `let progress = Math.min(Math.max(percent, 0), 100) / 100;` to `const progress = ...` at line ~78.
2. After TASK-1 lands, `npx eslint .` should be error-free (only `react-refresh/only-export-components` warnings on shadcn ui files remain — those are expected for shadcn and can be left).
3. Add a combined check script to `package.json`, e.g. `"check": "tsc -b && eslint . && vitest run"`, so reviewers/CI have one command.

**Verify:** `npx eslint .` reports 0 errors.

---

# P1 — High-value functional fix

## TASK-4 · Make the Loot Split calculator actually split (per-player transfers)
**Type:** Feature fix (core functionality) · **Effort:** M · **Files:** `src/components/TibiaLootSplit/tibia-loot-split.tsx`, locales, new test

**Problem:** The whole point of a loot-split tool is *"who transfers how much to whom so everyone profits equally."* The current implementation computes `perPlayer = Math.floor(netProfit / numPlayers)` and renders that **identical** number in every player's "Net" column — it never computes individual transfers, so the per-player table is useless. The Tibia party-hunt analyzer parser (`src/helpers/huntSessionParser.ts`) **already extracts per-player `loot`, `supplies`, and `balance`** (see lines ~112–117), so the data is available.

**Required new model:**
For a parsed party session with players `p_1..p_n`:
1. `individualBalance_i = p_i.balance ?? (p_i.loot - p_i.supplies)` (prefer the parsed per-player balance; fall back to loot − supplies).
2. Apply manual per-player adjustment: keep the existing **Extra TC** / **Extra Gold (K)** inputs, but reframe them as *"gold this player fronted for the team"* — i.e. **add** the player's `extraGp_i = extraTc_i × tcValue + extraGoldK_i × 1000` to that player's `individualBalance_i` (they are owed it back). (Today the code subtracts extras from the shared pot, which is incorrect for a per-player split. Document this assumption with a comment so the owner can adjust.)
3. `partyBalance = Σ individualBalance_i`.
4. `fairShare = partyBalance / n`.
5. `transfer_i = individualBalance_i − fairShare`:
   - `transfer_i > 0` → player **pays out** `transfer_i`.
   - `transfer_i < 0` → player **receives** `|transfer_i|`.
   - `≈ 0` → "even".

**UI:**
- Per-player table columns: Player · Balance · Extra TC · Extra Gold(K) · **Transfer** (show `Pay 1,234,567` in red / `Receive 1,234,567` in green / `Even`). Use `formatGp`.
- Summary table: total loot, total supplies, party balance, **fair share per player**.
- **Bonus (nice-to-have):** compute concrete pairwise settlements via greedy matching of payers→receivers and render a "Transfers" list like `Knight ➜ Druid: 500,000 gp`. This is the most-loved UX of real loot-split tools.

**i18n:** add keys under `tibiaLootSplit.*` in all 3 locales: `balance`, `transfer`, `pay`, `receive`, `even`, `fairShare`, `partyBalance`, `settlements` (+ any others). Translate properly for es/pt (do not leave English).

**Verify:**
- New test `src/components/TibiaLootSplit/__tests__/tibia-loot-split.test.tsx`: paste a known 2-player party session string, submit, assert the higher-looter shows "Pay X" and the lower-looter "Receive X", and that `pay total == receive total`.
- Manual check in `yarn dev` with a real party-hunt analyzer paste.

> Reference for parser output shape: `parseHuntSession()` return type in `src/helpers/huntSessionParser.ts` and `HuntSessionPlayer` in `src/types/huntSession.ts`.

---

# P2 — SEO & discoverability (high ROI for a public tool site)

## TASK-5 · Migrate HashRouter → BrowserRouter (clean, crawlable URLs)
**Type:** SEO/infra · **Effort:** S · **Files:** `src/App.tsx` (+ verify `firebase.json`)

**Problem:** URLs are `https://site/#/imbuings`. Search engines don't index hash fragments as distinct pages, and the `#` looks broken when shared. **The hosting rewrite needed for clean URLs already exists** — `firebase.json` has `"rewrites": [{ "source": "**", "destination": "/index.html" }]` — so this is nearly free.

**Fix:**
1. In `src/App.tsx`, replace `import { HashRouter } from 'react-router-dom'` + `<HashRouter>` with `BrowserRouter`.
2. Grep the codebase for any hardcoded `/#/` links or assumptions and fix them.
3. Confirm `yarn build && yarn preview` serves deep links (e.g. visiting `/imbuings` directly returns the app, not 404) — Firebase's rewrite handles prod; for local `vite preview` the SPA fallback is automatic.

**Verify:** Navigate to several routes, hard-refresh on a deep route, use browser back/forward — all work without `#`. `npx vitest run` green (tests use `MemoryRouter`/`createMemoryRouter`, unaffected).

**Depends on:** none. Coordinate with TASK-7 (sitemap should list the clean URLs this enables).

---

## TASK-6 · Add SEO meta, social cards, favicon & dynamic `<html lang>`
**Type:** SEO · **Effort:** S–M · **Files:** `index.html`, `src/routes.tsx`, `public/`, new `src/lib/seo.ts` (optional)

**Problem:** `index.html` has only a `<title>` — no meta description, no Open Graph, no Twitter card (bad link previews on Discord/Reddit/Twitter). `<html lang="en">` is hardcoded despite es/pt support. Favicon still points at the default Vite logo (`/vite.svg`).

**Fix:**
1. In `index.html` `<head>` add static defaults: `<meta name="description">`, Open Graph (`og:title`, `og:description`, `og:type`, `og:image`, `og:url`), and Twitter card (`summary_large_image`). Provide a real social preview image at `public/og-image.png` (1200×630) — if none exists, note it as a design dependency and use a placeholder.
2. Replace the default favicon: drop a branded icon in `public/` and point `<link rel="icon">` at it (a panda matches the existing `PandaIcon` brand). Remove the stale `/vite.svg` reference.
3. **Per-route meta + lang:** the app already sets `document.title` per route in `src/routes.tsx` (the `useEffect` at ~line 53). Extend that same effect to also set the `<meta name="description">` content (add a `pageDescriptions.*` namespace to the 3 locales) and to set `document.documentElement.lang` to the current i18n language (sync on language change too — `i18n.language`).

**i18n:** add `pageDescriptions.*` keys (one per route, matching `TITLE_KEYS`) in en/es/pt.

**Verify:** View source / inspect `<head>` after navigating between routes and switching language — title, description, and `<html lang>` update. Validate OG tags with a card debugger (or manual inspection).

---

## TASK-7 · Add robots.txt and sitemap.xml
**Type:** SEO · **Effort:** XS · **Files:** `public/robots.txt`, `public/sitemap.xml`

**Problem:** Neither file exists, so crawlers have no sitemap and no crawl directives.

**Fix:**
1. `public/robots.txt`: allow all, and reference the sitemap URL.
2. `public/sitemap.xml`: list all public, crawlable routes (the clean URLs from TASK-5): `/`, `/real-money-calculator`, `/coins-to-money`, `/imbuings`, `/imbue-cost-calculator`, `/exercise-weapons`, `/equipment-reference`, `/offline-training`, `/level-calculator`, `/bless-calculator`, `/exp-share`, `/tibia-loot-split`, `/hunting-spots`, `/exaltation`, `/public-projects`. Exclude auth-gated routes (`/account`, `/myTierProjects`, `/auth`).
3. Use the real production origin (confirm with owner; `.firebaserc` has the Firebase project name).

**Verify:** Files are copied to `dist/` on `yarn build` (Vite copies `public/` verbatim). XML is well-formed.

**Depends on:** TASK-5 (sitemap should use clean, non-hash URLs).

---

# P3 — UI/UX enhancements

## TASK-8 · Replace blank Suspense fallback with a loading state
**Type:** UX · **Effort:** XS · **Files:** `src/routes.tsx`

**Problem:** `<Suspense fallback={null}>` (line ~60) shows **nothing** during every lazy-route load → a blank flash on navigation.

**Fix:** Replace `null` with a lightweight centered loading indicator (a spinner, or reuse the existing `@/components/ui/skeleton` `Skeleton`). Keep it minimal and centered within the content area. Consider a small delay so fast loads don't flash the spinner.

**Verify:** Throttle network in devtools and navigate between routes — a loading state shows instead of blank.

---

## TASK-9 · ⌘K command palette for tool navigation
**Type:** UX feature · **Effort:** M · **Files:** new `src/components/CommandPalette/`, `src/components/Layout/AppLayout.tsx`, locales

**Problem:** 17 tools live in collapsible sidebar groups. A fuzzy command palette makes navigation instant and feels modern.

**Fix:**
1. Add shadcn primitives (not yet present): `npx shadcn@latest add command dialog` → creates `src/components/ui/command.tsx` + `dialog.tsx` (pulls in the `cmdk` dependency).
2. Build `CommandPalette` listing every tool. **Reuse the existing `NAV_GROUPS` array** in `src/components/Layout/AppLayout.tsx` as the source of truth (export it so both the sidebar and palette consume it — single source). Each entry: localized label (`t('sidebar.<labelKey>')`), the lucide icon, and `to`. Selecting an item `navigate(to)`s and closes.
3. Global hotkey: `⌘K` / `Ctrl+K` opens it (add a `keydown` listener). Add a subtle "Search… ⌘K" button in the sidebar and/or mobile header that opens it too.

**i18n:** add `commandPalette.placeholder`, `commandPalette.empty`, `commandPalette.title` to all 3 locales.

**Verify:** `⌘K` opens, typing filters, Enter navigates, Esc closes. Works on mobile (button trigger). `yarn build` + lint clean.

---

## TASK-10 · Copy / share results on calculators
**Type:** UX feature · **Effort:** M · **Files:** `src/components/TibiaLootSplit/`, `src/components/ImbueCostCalculator/`, new `src/hooks/useCopyToClipboard.ts`, locales

**Problem:** Players paste calculator results into Discord constantly, but there's no copy/share affordance. Highest value on **Loot Split** (paste the transfer breakdown) and **Imbue Cost** (paste the cost summary).

**Fix:**
1. Add a small reusable `useCopyToClipboard()` hook (uses `navigator.clipboard.writeText`, returns a `copy(text)` fn + `copied` state) and a "Copy result" button that fires a `toast.success(t('common.copied'))` (sonner).
2. Loot Split: produce a clean plaintext block (e.g. `Player — Pay/Receive X gp` lines + settlements). Imbue Cost: a summary block (item, imbue, tier, total market, total via Yana, cost/h).
3. Keep it framework-agnostic so other calculators can adopt the same hook + button later.

**i18n:** add `common.copy`, `common.copied` to all 3 locales.

**Verify:** Click copy → clipboard contains the formatted text → toast shows. Works after TASK-4 lands (loot-split output exists).

**Depends on:** TASK-4 (for the loot-split result shape).

---

## TASK-11 · Persist sidebar group collapse state
**Type:** UX · **Effort:** XS · **Files:** `src/components/Layout/AppLayout.tsx`

**Problem:** Collapsed/expanded nav-group state (`expandedGroups`, initialized all-true at line ~70) resets on every reload. (Theme already persists via `vite-ui-theme`; language persists via i18next.)

**Fix:** Persist `expandedGroups` to `localStorage` (e.g. key `tt-sidebar-groups`). Read it in the `useState` initializer (falling back to all-expanded), and write on every toggle. Guard against malformed JSON.

**Verify:** Collapse a group, reload — it stays collapsed. New users still get all-expanded by default.

---

# P4 — Net-new features (larger; specs are starting points)

## TASK-12 · Hunt session history + charts (highest-ROI feature)
**Type:** Feature · **Effort:** L · **Files:** new page/components, `src/firebase/huntSessions.ts`, routes, sidebar, locales

**Why:** Sessions are **already stored** in Firestore (`huntSessions`, scoped per user via `ownerUid`). Surfacing them as a personal history with trend charts turns existing data into a headline feature.

**Scope:**
- New authed page (e.g. `/my-sessions`) listing the signed-in user's sessions across all spots (reuse `getRecentSessions()` / add a paginated query in `src/firebase/huntSessions.ts`).
- Charts: XP/h over time, profit (balance) per session, loot vs supplies. **Add `recharts`** (`yarn add recharts`; pairs with shadcn — optionally `npx shadcn@latest add chart`).
- Filters by spot and date range. Empty state for users with no sessions. Loading skeletons (`@/components/ui/skeleton`).
- Add nav entry under the "Hunting & Forging" group in `AppLayout.tsx` `NAV_GROUPS`; lazy-load the route in `src/routes.tsx`; add `TITLE_KEYS` + `pageTitles.*` entries.

**i18n + tests** required as usual. Respect existing Firestore-safe parsing helpers in `src/lib/firestore-helpers.ts`. Add the needed composite index to `firestore.indexes.json` if querying by `ownerUid` + ordering by `createdAt`.

---

## TASK-13 · Stamina regeneration calculator
**Type:** Feature · **Effort:** M · **Files:** new `src/components/StaminaCalculator/`, `src/helpers/stamina.ts`, page, route, sidebar, locales

**Spec:** Input current stamina (hh:mm) → output time until full (42:00). Tibia rules: stamina regenerates **1 min per 3 min offline** below 40h; **1 min per 10 min offline** between 40h–42h (the "green" zone); max 42h. Also show "time until you re-enter green (40h)" and "time to full (42h)". Pure helper + tests for the math, then a thin UI matching the other calculators (`Input`, `Separator`, result table). Wire route + nav + titles + i18n.

---

## TASK-14 · Boss / raid cooldown tracker
**Type:** Feature · **Effort:** L · **Files:** new components, `src/firebase/` collection, route, sidebar, locales

**Spec:** Per-character list of bosses with a "killed at" timestamp and known cooldown; shows time remaining / "available now." Persist per user in Firestore following the existing CRUD pattern (use `tierProjects.ts` as the reference implementation, plus `firestore.rules` + `firestore.indexes.json` updates). Requires auth to save (mirror `PrivateRoute` usage). Seed with a static boss/cooldown list in `src/helpers/`.

---

## TASK-15 · Imbuement expiry tracker
**Type:** Feature · **Effort:** M–L · **Files:** new components, Firestore collection, route, sidebar, locales

**Spec:** Let a signed-in user log active imbuements (type + tier + applied time; durations already known: basic 20h / intricate 55h / powerful 100h — see `IMBUE_DURATIONS` in `imbue-cost-calculator.tsx`). Show countdowns and "expiring soon" warnings. Reuse imbuement metadata from `src/components/ImbuingChecker/imbuements.ts`. Firestore-backed per user.

---

## TASK-16 · PWA / installable + offline shell
**Type:** Feature/infra · **Effort:** M · **Files:** `vite.config.ts`, `public/` icons, manifest

**Spec:** Add `vite-plugin-pwa` with `registerType: 'autoUpdate'`, a web app manifest (name, theme color, icons 192/512), and precache the app shell + static helper data so calculators work offline. A "tools" site benefits strongly from home-screen install + offline use. Verify with Lighthouse PWA audit.

---

## Suggested execution order
1. **P0 batch** (TASK-1, 2, 3) — small, unblocks a green lint baseline.
2. **TASK-4** (loot split) — biggest functional win.
3. **SEO batch** (TASK-5 → 6 → 7, in that order).
4. **UX batch** (TASK-8, 11 are trivial; 9, 10 are medium).
5. **Features** (TASK-12 first — best ROI since data exists — then pick from 13–16).
