---
name: Fazaa Next.js migration
description: Notes from migrating the fazaa artifact from Vite+React+wouter to Next.js 15 App Router with static export.
---

# Fazaa Next.js Migration

## Key decisions

- `output: 'export'` in next.config.ts → generates static files in `out/` directory; artifact.toml `publicDir` changed to `artifacts/fazaa/out`.
- All pages use `"use client"` + `<Suspense>` wrapper because they use `useSearchParams()` (required by Next.js static export).
- Navigation: `wouter` removed entirely; use `next/link` for `<Link>` and `next/navigation` for `useRouter()` / `useSearchParams()`.
- Assets moved to `public/`: `home-poster.jpeg`, `mastercard.svg` — imported as plain string paths (`/home-poster.jpeg`) instead of bundled imports.
- `@assets` alias removed; card images at `/cards/<brand>/<type>.png` from public/.
- `data/brands.ts` updated: removed `import.meta.env.BASE_URL`; card paths now hardcoded as `/cards/...`.
- `Header.tsx` and `Footer.tsx`: replaced `import { Link } from 'wouter'` with `import Link from 'next/link'`.
- Created `src/components/Providers.tsx` (client component) wrapping `QueryClientProvider + TooltipProvider + Toaster`; imported in `app/layout.tsx` (server component).
- `app/layout.tsx` sets `<html lang="ar" dir="rtl">` — RTL is in the HTML tag, not via JS.
- `postcss.config.mjs` uses `@tailwindcss/postcss` (Tailwind v4 PostCSS plugin, NOT `tailwindcss` directly).
- `tsconfig.json`: removed `vite/client` types, added `plugins: [{ "name": "next" }]`, added `esModuleInterop: true` (Next.js auto-added).

**Why:**
Next.js App Router requires static exports for Replit's static-serving artifact system. All pages are client components because they need browser APIs (sessionStorage, fetch polling, form state).

**How to apply:**
Any new page added to `app/` that uses `useSearchParams` must be wrapped in `<Suspense>`. Keep `"use client"` at top of all interactive pages.
