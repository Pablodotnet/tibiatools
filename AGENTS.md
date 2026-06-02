## Goal
Expand hunting spots with user-submitted spots stored in Firestore, per-spot hunting calculator, and Tibia analyser session uploads with parsing for both solo and party hunts.
Then redesign the layout with a sidebar + dashboard homepage.

## Constraints & Preferences
- New features follow existing Firebase CRUD patterns (tierProjects as reference)
- Use sonner toasts for notifications, alert-dialog for delete confirmations
- Hunting spots types extend existing `HuntingSpotData` with optional `ownerUid`/`ownerDisplayName`/`vocationId`
- User spots merge with built-in spots on vocation pages; only the spot owner can delete
- Sessions stored in Firestore `huntSessions` collection with `spotId` index
- Tibia analyser parser uses regex to handle individual and party hunt formats flexibly
- Sessions load lazily per-spot when expanded
- Requires authentication to add spots or upload sessions
- i18n for all 3 locales (en, es, pt)
- Sidebar groups nav links by category, collapsible groups, mobile hamburger toggle
- Dashboard shows hunting spots, OT server banner, tier projects, and quick tools widgets
- Exp Share Calculator: input level → min/max party member level range

## Progress
### Done
- (all previous features: imbue calculator, exercise weapons, equipment reference, offline training, level calculator, bless calculator, 10 spots/vocation, build warnings fixed, lockfile cleanup, user spots + sessions per-spot, session parser)
- **AppLayout** (`src/components/Layout/AppLayout.tsx`): fixed `w-64` sidebar with grouped navigation (Finance, Combat & Skills, Calculators, Hunting & Forging, Community), collapsible groups, mobile overlay + hamburger, sticky mobile header, bottom controls (lang, theme, repo, auth)
- **Dashboard page** (`src/pages/DashboardPage/index.tsx`): replaces old HomePage
- **HuntingSpotsWidget**: grid of vocation links → per-vocation spot pages
- **GangrenaBanner**: gradient hero card linking to gangrenaot.com server
- **TierProjectsWidget**: fetches and displays 4 recent public projects from Firestore
- **QuickToolsWidget**: 2x2 grid of Imbuings, Level Calc, Exercise Weapons, Bless Calc
- **i18n**: `sidebar.*` and `dashboard.*` keys in en/es/pt with full translations
- `PrivateRoute`/`PublicRoute` — `min-h-screen` → `min-h-[50vh]` to prevent overflow inside AppLayout
- All 98 tests pass, TypeScript clean, production build zero errors (now 124)
- Committed: `feat: add sidebar layout and dashboard homepage with widgets`
- Invalid vocation URL: redirected unknown vocation IDs to /not-found via Navigate
- Collapse/expand transitions: `fade-in` CSS animation on spot/session card expanded content
- Accessibility: `aria-expanded` buttons, `aria-label` on sort `<select>`, `<h4>`→`<h3>` for spot names
- Loading skeletons: `src/components/ui/skeleton.tsx` with animated pulse; replaces plain text in Dashboard widgets and VocationHuntSpotsPage
- Firestore doc validation: runtime-safe helpers (`safeStr`, `safeNum`, `optNum`, `optStr`, `safeBool`, `toMs`) in `huntingSpots.ts`, `huntSessions.ts`, `tierProjects.ts`
- Committed: `feat: add runtime-safe Firestore doc validation helpers`
- Session privacy: `getRecentSessions()` scoped to authenticated user's own sessions via `ownerUid` filter
- Exaltation tab lazy-loading: all 4 calculator components (`ExaltationForgeSimulator`, `TransferCalculator`, `ConvergenceFusionCalculator`, `ConvergenceTransferCalculator`) loaded via `React.lazy()` + `<Suspense>`
- Radix-ui imports: `tabs.tsx`, `switch.tsx`, `avatar.tsx`, `separator.tsx` changed from `"radix-ui"` shorthand to `"@radix-ui/react-*"` scoped imports
- Error monitoring placeholder: `src/lib/monitoring.ts` with `captureError`/`captureEvent` noop stubs
- Filter & pagination: min profit / min XP filters on VocationHuntSpotsPage, session batch load (10) with "View all" toggle
- Widget error boundaries: `WidgetErrorBoundary` wrapping each dashboard widget
- Analytics: `monitoring.ts` enhanced with `initMonitoring`, batching, `flush()`, `sendBeacon` on unload
- 13 new tests: monitoring (5), RecentSessionsWidget (5), ExaltationPage (3) — 121 total passing
- Extracted duplicate Firestore validation helpers into shared `src/lib/firestore-helpers.ts` (was triplicated across huntingSpots, huntSessions, tierProjects)
- Added missing composite index for `huntSessions` (ownerUid + createdAt) to `firestore.indexes.json`
- Replaced 4 `console.error` calls with `captureError()` from monitoring stub
- Added `limit(100)` to `getAllHuntingSpots` to prevent unbounded Firestore reads
- Fixed dynamic `import()` bug in `getSession` (was re-importing getDoc already at top level)
- **P0 batch**: Fixed Rules-of-Hooks crash (moved early-return guard after hooks, wrapped `translate` in `useCallback`, fixed missing deps), fixed Exp Share min-level off-by-one (`Math.floor`→`Math.ceil`), cleared lint baseline (`prefer-const` fix, added `check` script). 124 tests passing, `eslint .` 0 errors.
- Committed: `fix: resolve Rules-of-Hooks crash, Exp Share min-level off-by-one, and lint errors`
- **TASK-4**: Loot split now computes per-player transfers (individual balance + extras → fair share → Pay/Receive per player) with greedy pairwise settlements. 3 new tests. 8 new i18n keys (en/es/pt).
- **TASK-5**: Migrated `HashRouter` → `BrowserRouter` for clean, crawlable URLs.
- **TASK-6**: Added OG tags, Twitter card, meta description, per-route `pageDescriptions` (19 keys/en/es/pt), dynamic `<html lang>`, branded SVG favicon, removed stale `vite.svg`.
- Committed: `feat: implement loot split transfers, BrowserRouter, and SEO meta`
- **TASK-7**: Added `public/robots.txt` and `public/sitemap.xml` with 15 crawlable routes.
- **TASK-8**: Replaced `<Suspense fallback={null}>` with a centered `Loader2` spinner.
- **TASK-9**: ⌘K command palette (`src/components/CommandPalette`) using shadcn `CommandDialog`, reuses exported `NAV_GROUPS` from AppLayout, global hotkey, sidebar search button, 3 i18n keys.
- Committed: `feat: add robots.txt, sitemap, Suspense fallback, and command palette`

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- CSS minifier switched from esbuild to lightningcss to avoid Tailwind v4 `:has(:is())` esbuild warning
- Route pages lazy-loaded with `React.lazy()` + `<Suspense fallback={null}>` — reduces initial bundle size
- User hunting spots use direct Firebase API calls with local state (no Redux slice) — simpler, no offline caching needed
- Sessions loaded per-spot on expand rather than all at once — avoids unnecessary Firestore reads
- Parser designed to be flexible with regex — handles multiple Tibia analyser format variations
- Sidebar uses `w-64` fixed width, collapsible groups via local state, mobile toggle via useState
- Dashboard widgets are self-contained with their own data fetching; TierProjectsWidget reuses the existing Redux thunk

## Next Steps
- Push commits to remote

## Critical Context
- AppLayout wraps entire app content; sidebar is `lg:fixed`, mobile uses `translate-x` slide
- Dashboard widgets in `src/components/Dashboard/` — each is a named export
- NavBar subcomponents (`ModeToggle`, `PandaIcon`, etc.) still imported from `@/components/NavBar/` by AppLayout
- All 127 tests pass, TypeScript clean, production build has zero warnings

## Relevant Files
- `src/components/Layout/AppLayout.tsx`: sidebar + content layout
- `src/components/Layout/index.ts`: barrel export (AppLayout, PrivateRoute, PublicRoute)
- `src/components/Dashboard/*`: 4 widget components + barrel
- `src/pages/DashboardPage/index.tsx`: dashboard page with 2-column grid layout
- `src/App.tsx`: uses `<AppLayout>` wrapper
- `src/routes.tsx`: lazy loads DashboardPage at `/`
- `src/i18n/locales/en.json`, `es.json`, `pt.json`: `sidebar` and `dashboard` namespaces
- `src/firebase/huntingSpots.ts`: Firebase CRUD for user-submitted hunting spots
- `src/firebase/huntSessions.ts`: Firebase CRUD for hunt sessions
- `src/helpers/huntingSpots/index.ts`: hunting spot types, static data, formatting helpers
- `src/helpers/huntSessionParser.ts`: Tibia analyser text parser (solo + party)
- `src/types/huntSession.ts`: HuntSession, HuntSessionPlayer, KilledMonster, LootItem types
- `src/components/HuntingSpotsAddDialog/hunting-spots-add-dialog.tsx`: add spot form
- `src/components/HuntSessionUploadDialog/hunt-session-upload-dialog.tsx`: paste/parse/save session dialog
- `src/components/HuntSessionDisplay/hunt-session-card.tsx`: session display card
- `src/pages/VocationHuntSpotsPage/index.tsx`: page merging built-in + user spots + sessions
- `src/pages/HuntingSpotsPage/index.tsx`: main hunting spots page with Add Spot button
- `src/lib/firestore-helpers.ts`: shared Firestore doc validation helpers (safeStr, safeNum, optNum, optStr, safeBool, safeArr, safeLevelRange, toMs, stripUndefined)
- `firestore.indexes.json`: composite indexes for Firebase queries
