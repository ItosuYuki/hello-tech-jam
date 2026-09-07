# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

Package manager is pnpm (pinned via `packageManager` in [package.json](package.json)).

```bash
pnpm dev      # next dev, http://localhost:3000
pnpm build    # next build
pnpm start    # next start (serve production build)
pnpm lint     # eslint
```

There is no test runner configured in this repo.

Docker alternative for dev (hot reload via bind mount): `docker compose up dev` (see [docker-compose.yml](docker-compose.yml); it runs the `deps` stage of [Dockerfile](Dockerfile) with `pnpm dev`). The `builder`/`runner` stages in the Dockerfile produce the production `standalone` build.

### Required environment variables (`.env`, gitignored)

- `HOTPEPPER_API_KEY` — server-side key for the Hot Pepper Gourmet API, read only in [app/api/shops/route.ts](app/api/shops/route.ts).
- `NEXT_PUBLIC_API_HOST` — base URL the client/server components use to call this app's own `/api/shops` route (see below).

## Architecture

Next.js App Router project (React 19) using the `app/` directory. `@/*` resolves to the repo root (tsconfig path alias).

### Restaurant search: API route + two parallel UI implementations

The core feature is a restaurant search backed by Recruit's Hot Pepper Gourmet API:

- [app/api/shops/route.ts](app/api/shops/route.ts) is the only place that talks to the external Hot Pepper API. It reads `HOTPEPPER_API_KEY` server-side (never exposed to the client), defaults `large_area` to `Z098`, and normalizes upstream failures into JSON error responses via a local `APIError` class. It returns `Shop[]` (shape defined in [types/index.ts](types/index.ts), mirroring the Hot Pepper response).
- [app/gourmets-sc/page.tsx](app/gourmets-sc/page.tsx) is the **Server Component** version: an async page component reads `searchParams`, fetches `/api/shops` on the server, and renders results; the search form is a plain `<form>` that navigates via GET query params.
- [app/gourmets-cc/page.tsx](app/gourmets-cc/page.tsx) + [app/gourmets-cc/search-form.tsx](app/gourmets-cc/search-form.tsx) is the **Client Component** version: `"use client"` page holds `shops` in `useState`, and the form uses a `useActionState`-driven Server Action (`searchAction`) that fetches `/api/shops` and reports results/errors back up via a callback prop.

Both call the app's own `/api/shops` endpoint (via `NEXT_PUBLIC_API_HOST`) rather than the Hot Pepper API directly — when changing the search behavior, check whether the change belongs in the shared API route or needs to be duplicated across both page implementations.

`app/page.tsx`, `app/about/`, `app/hello-nextjs/`, and `app/shadcn/` are unrelated scratch/demo pages (largely untouched `create-next-app` boilerplate or component experiments), not part of the search feature.

### UI components and theming

- `components/ui/*` are [shadcn/ui](https://ui.shadcn.com) components generated per [components.json](components.json) (style `base-nova`, base color `neutral`, icons from `lucide-react`). Add new ones with the `shadcn` CLI rather than hand-rolling.
- Dark/light theming goes through `next-themes`: [components/theme-provider.tsx](components/theme-provider.tsx) wraps the app in [app/layout.tsx](app/layout.tsx) (`defaultTheme="dark"`), and [components/theme-toggle.tsx](components/theme-toggle.tsx) is the toggle control.
- [lib/utils.ts](lib/utils.ts) re-exports `cn` from the `cn` npm package (not a hand-written `clsx`+`tailwind-merge` helper).

### Build output

[next.config.ts](next.config.ts) sets `output: "standalone"` unless the `VERCEL` env var is set — the Dockerfile's `runner` stage depends on this standalone output.

### Lint rules

ESLint extends `eslint-config-next` (core-web-vitals + typescript) with one project-specific override in [eslint.config.mjs](eslint.config.mjs): double quotes are enforced (`quotes: ["error", "double"]`).
