# TibiaTools — Project Conventions

## Tech Stack
- **Framework**: React 19, TypeScript 5.7
- **Build**: Vite 6 (`tsc -b && vite build`)
- **Styling**: Tailwind CSS 4 + `tailwindcss-animate`
- **UI Components**: shadcn/ui (Radix primitives) from `@/components/ui/`
- **State**: Redux Toolkit (`@/store/`)
- **Routing**: React Router 7 (HashRouter in App.tsx)
- **i18n**: react-i18next + i18next (`@/i18n/`)
- **Forms**: react-hook-form + zod
- **Backend**: Firebase (Auth + Firestore)
- **Testing**: Vitest + @testing-library/react + jsdom
- **Linting**: ESLint flat config (`eslint .`)

## Project Structure
```
src/
├── main.tsx              # Entry point
├── App.tsx               # Root: Provider, HashRouter, NavBar, AppRouting
├── routes.tsx            # Route definitions + page titles
├── index.css             # Tailwind + CSS variables
├── components/
│   ├── NavBar/           # Navigation (named exports, no default)
│   ├── Layout/           # PrivateRoute, PublicRoute
│   ├── ui/               # shadcn/ui primitives
│   ├── LanguageSwitcher/
│   └── <Feature>/        # Feature-specific components
├── pages/
│   └── <FeaturePage>/    # Page components, default export
├── store/
│   ├── store.ts          # configureStore, RootState, AppDispatch
│   ├── <slice>/          # Redux slice + thunks + tests
├── firebase/
│   ├── config.ts         # Firebase init
│   ├── tierProjects.ts   # Firestore CRUD
│   └── __tests__/
├── types/
│   ├── index.ts          # Re-exports
│   ├── tierProject.ts    # TierProject, TierProjectEntry, etc.
│   └── auth.ts
├── helpers/
│   ├── index.ts          # Re-exports
│   ├── exaltationForge.ts
│   └── ...
├── hooks/
│   ├── index.ts          # useAppDispatch, useAppSelector, useAuth
│   └── useAuth.ts
├── i18n/
│   ├── index.ts          # i18next config
│   └── locales/          # en.json, es.json, pt.json
├── workers/
└── lib/
    └── utils.ts          # cn() helper
```

## Conventions

### Path Aliases
Use `@/` alias for all imports from `src/`. Base URL set in `tsconfig.json`:
```
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import type { TierProject } from '@/types/tierProject';
```

### Naming & Exports
- **Pages**: `src/pages/<Name>Page/index.tsx`, **default export**
- **Components**: `src/components/<Name>/`, named exports, **no default export**
- **Types**: PascalCase interfaces, exported from `@/types/` barrel
- **Helpers**: camelCase functions, exported from `@/helpers/` barrel
- **Hooks**: `use` prefix, exported from `@/hooks/` barrel
- **Firebase functions**: camelCase

### Styling
- **Tailwind CSS 4** with `@apply` in `index.css` for base layer
- Use `cn()` from `@/lib/utils` for conditional class merging
- `size-*` utility for icon sizing (e.g., `size-4`)
- `tabular-nums` on numeric displays
- Use `text-muted-foreground` for secondary text
- Use `text-destructive` for destructive actions
- Dark mode via `.dark` class

### Component Patterns
- Functional components with explicit return type (JSX)
- Props typed with `interface` or inline
- Use `useTranslation()` hook from `react-i18next`
- Helper function: `const translate = (key: string) => t(`namespace.${key}`)`
- Use `useAppDispatch` and `useAppSelector` from `@/hooks`, not raw Redux hooks
- State with `useState`, derived values with `useMemo`
- Async thunks return `{ ok: true } | { ok: false; error: string }`
- Toast notifications via `sonner` (`toast.success` / `toast.error`)
- Forms: simple forms use controlled inputs + state; complex forms use react-hook-form + zod

### Redux
- **Slice**: `createSlice` with typed state interface and `PayloadAction`
- **Thunks**: in separate `thunks.ts`, use `AppDispatch` from `@/store`
- **State access**: `useAppSelector((s) => s.<sliceName>.<field>)`
- **Dispatch**: `useAppDispatch()`
- Thunks access state via `getState: () => RootState`

### Firebase
- Firestore rules in `firestore.rules`
- Indexes in `firestore.indexes.json`
- Entries stored in subcollection: `tierProjects/{projectId}/entries/{entryId}`
- CRUD functions in `src/firebase/<feature>.ts`
- Use `Timestamp.now()` for created/updated dates
- Document fields match TypeScript interfaces closely

### i18n
- Translation files: `en.json`, `es.json`, `pt.json`
- Keys organized by feature namespace (e.g., `myTierProjects`, `publicTierProjects`)
- Use camelCase for keys
- `t(`namespace.${key}`)` to access translations

### Testing
- Tests co-located in `__tests__/` directories
- Test runner: `vitest run`
- Stack: vitest + @testing-library/react + jsdom
- Firebase functions: mock `firebase/firestore` exports directly

### Git
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`)
- Commit after every logical task
- No force push, no amend unless directed
