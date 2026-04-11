# Frontend Structure

This frontend follows a route-first + feature-first split:

- `app/`: Next.js routing only (layouts, pages, loading/error boundaries).
- `features/`: domain code grouped by product area (`auth`, `dashboard`, `marketing`).
- `components/`: shared UI and layout blocks used by multiple features.
- `services/`: API clients.
- `hooks/`, `types/`, `lib/`: cross-feature utilities.

## Rules

1. Keep route files thin: import from `features/*`, avoid business logic in `app/*`.
2. Import feature modules from their public entrypoint (`@/features/<name>`) when possible.
3. Inside a feature, prefer relative imports (`./...`) for local components/hooks.
4. Put reusable UI in `components/ui`; keep feature-specific UI in `features/<name>/components`.
5. Add exports in `features/<name>/index.ts` for anything needed outside that feature.

## Example

- Good in page files: `import { FeedClient } from "@/features/dashboard";`
- Good inside dashboard feature: `import { useDashboard } from "./dashboard-context";`
