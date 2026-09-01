# Routing & prerendering

## Why this exists

This site is a static Vite+React SPA with no backend, deployed to GitHub Pages via one GitHub
Actions workflow (`.github/workflows/deploy.yml`) that builds and uploads `dist/` as-is. GitHub
Pages is a plain static file server: given a request path, it either finds a matching file or
serves `404.html`. There are no server-side rewrites.

A client-side router (`react-router`) makes navigating *within* a loaded session work perfectly —
clicking a link just swaps rendered content, no HTTP request involved. But it does **not** help
when someone lands **directly** on a non-root route: a fresh tab on `/cv`, a page refresh, a
shared link. That's a real `GET /cv` hitting GitHub Pages, which only has `dist/index.html` and
404s.

The fix is a build-time **prerender** step: after `vite build`, a headless-browser pass visits
every real route in the already-built app and writes the fully-rendered HTML to
`dist/<route>/index.html`. GitHub Pages then serves genuine static content per route — including
working `<title>`/OG tags for link-preview unfurling (Slack, LinkedIn, iMessage, ...) and search
indexing, none of which read JavaScript-injected `<head>` content — while the shipped JS still
re-renders over the snapshot client-side exactly like a normal SPA. This is prerendering, not
SSR-with-hydration: there's no server, and the client does a plain re-render (`createRoot(...)`,
not `hydrateRoot`) on top of whatever HTML was captured.

## Current routes

Defined in `AppRoutes` (`src/App.tsx`):

| Route | Component | Status |
| --- | --- | --- |
| `/` | `src/pages/HomePage` | Today's homepage (Hero/Experience/Skills/Education), unchanged |
| `/cv` | `src/pages/CvPage` | **Placeholder text only.** A real dense/print-oriented CV layout is future work |
| `/projects/:slug` | `src/pages/ProjectPage` | Scaffolded. `src/data/projects.ts` is empty, so every slug currently renders "Project not found." |
| `*` | `src/pages/NotFoundPage` | Catch-all for unknown paths. Not prerendered — reached via `dist/404.html`, see below |

There is deliberately no `/projects` index/listing page yet (nothing to list) and no locale-in-URL
(locale stays as client-side `react-i18next` state, not a route segment or query param — this was
an explicit decision, not an oversight).

`Layout` (`src/components/layout/Layout/Layout.tsx`) is the shared layout route: it renders
`<Outlet/>` instead of taking a `children` prop, so every page renders inside the same
Navbar/Footer chrome. Its only call site is `AppRoutes`.

## How prerendering actually works

1. **`scripts/deriveRoutes.ts`** — a small pure function: `['/', '/cv', ...projects.map(p =>
   '/projects/' + p.slug)]`. Unit-tested (`deriveRoutes.test.ts`). This is what makes route
   discovery automatic — add a project to `src/data/projects.ts` and its route appears here with
   no other code changes.
2. **`scripts/prerender.mjs`** — the orchestration:
   - Starts Vite's own `preview()` JS API (from the `vite` package, already a dependency — no
     separate static-file-server package needed) to serve the already-built `dist/` locally.
   - Launches headless Chromium via Playwright (a **dev-only** dependency — never shipped to
     visitors).
   - Visits each route from `deriveRoutes`, waits for real content to render (`#root > *`), and
     captures `page.content()` — the fully-rendered HTML, including whatever `useDocumentHead`
     mutated into `<head>`.
   - Writes that HTML to `dist/<route>/index.html` (and overwrites `dist/index.html` for `/` too,
     intentionally, for the same per-route metadata treatment everywhere).
3. **`src/hooks/useDocumentHead.ts`** — every routed page calls this to set `document.title` and
   upsert `<meta name="description">` / `<meta property="og:title">` / `<meta
   property="og:description">`. It *updates* the tags that are already hardcoded in `index.html`
   (found via `document.querySelector`) rather than duplicating them, so the static fallback
   values in `index.html` are sane defaults even before any page-specific override runs.

## Unknown paths: `dist/404.html`

Prerendering only covers paths that *are* routes. For anything else (`/nonsense`, a stale link, a
typo) GitHub Pages falls back to `404.html`, serving it at the requested URL without a redirect —
so if that file is the app shell, the SPA boots, the router sees the original path, and the `*`
route renders `NotFoundPage` inside the normal Navbar/Footer chrome. The visitor gets the site,
and the response still carries a real HTTP 404.

`dist/404.html` is produced by the `emit-not-found-shell` plugin in `vite.config.ts`, which copies
`dist/index.html` in `closeBundle` — during `vite build`, before any prerendering. Two traps this
avoids, both verified rather than assumed:

- **A hand-written `public/404.html` does not work.** Files in `public/` are copied verbatim, never
  transformed, so the copy would keep `<script type="module" src="/src/main.tsx">` — a path that
  doesn't exist in a production build. The page would load and do nothing.
- **The copy must happen before `pnpm prerender`.** That step overwrites `dist/index.html` with the
  rendered homepage, so a copy taken afterwards would show the homepage under every unknown path.

`NotFoundPage` is deliberately absent from `deriveRoutes` — there's no such route to visit, and its
snapshot would be the same shell plus one heading.

## A load-bearing implementation detail: `scripts/` and TypeScript

`scripts/deriveRoutes.ts` is a genuine `.ts` file, imported directly by the plain `.mjs`
`prerender.mjs` script — with **no** `tsx`/`ts-node`/build step in between. This works because
Node 24 (this repo's pinned engine, see `.nvmrc`) executes `.ts` files natively (type-stripping),
including via `import` from another script. This was verified directly in this repo, not assumed —
see the git history around when this feature was added if you want the exact smoke test.

**Consequence:** everything under `scripts/` must use plain relative imports (`../src/data/
projects.ts`, `./deriveRoutes.ts`) — **never** the `@data`/`@lib`/`@pages`-style aliases used
everywhere else in `src/`. Node has no knowledge of Vite's or tsconfig's path remapping outside the
Vite-driven app build; those aliases simply don't resolve for a script run directly by `node`.

`tsconfig.node.json` includes `scripts` so `pnpm typecheck` (`tsc -b`) still type-checks
`deriveRoutes.ts`. `prerender.mjs` itself is a plain `.mjs` file (not `.ts`) and isn't type-checked
— it's I/O- and browser-heavy orchestration, not logic worth typing strictly; the actual
route-deriving logic worth typing lives in `deriveRoutes.ts`.

ESLint has a scoped override (`eslint.config.js`) giving `scripts/**/*.{ts,mjs}` Node globals and
allowing `console` — the rest of the config assumes browser-only app code.

## Running it locally

```sh
pnpm build                                  # produces dist/
pnpm exec playwright install chromium       # one-time per machine
pnpm prerender                              # node scripts/prerender.mjs
```

Then check `dist/cv/index.html` (or any other route) actually contains rendered content — a
`<title>` matching the page, the real DOM tree inside `#root`, not an empty shell.

**This needs a real browser and a bindable local port.** In network-restricted or sandboxed
environments it fails loudly and immediately:

```
Error: listen EPERM: operation not permitted ::1:4173
```

or a Playwright browser-launch error. That's expected, not a bug in the script — it's exactly what
happened when this was first built in a locked-down agent sandbox. Run it somewhere unrestricted,
or trust CI (see below).

## CI

`.github/workflows/deploy.yml`'s `build` job runs, in order: `pnpm build`, `pnpm exec playwright
install --with-deps chromium`, `pnpm prerender`, then `actions/upload-pages-artifact@v3` with
`path: dist`. If the prerender step is ever skipped or moved after the upload step, direct
navigation to `/cv` or any `/projects/:slug` will 404 in production even though everything works
fine in `pnpm dev`.

## Known limitations (not bugs — deliberately out of scope so far)

- `useDocumentHead` only sets title/description/`og:title`/`og:description`. It does **not** set
  `og:url` or `og:image` per route — those stay as the global values hardcoded in `index.html`
  (pointing at the homepage). Worth revisiting once there's a real reason (e.g. per-project
  screenshots to reference).
- No `/projects` index/listing page — add one once there's at least one real project.
- `/cv` has no real layout yet — it's literal placeholder text, waiting on a dense/print-oriented
  design.
- No PDF export, no locale-in-URL, no market/jurisdiction conventions (photo inclusion, RODO
  clause, etc.) — all considered and explicitly deferred, not forgotten.

## How to add a project

1. Add an entry to `src/data/projects.ts`'s `projects` array: `{ slug, name }` (language-invariant
   facts only, matching the `experience`/`education` facts-vs-copy split).
2. Add `projects.<slug>.shortDescription` to `src/locales/en.ts` (and `pl.ts`) — the translatable
   summary. `ProjectPage` looks this up dynamically via `i18n.t()` since the slug isn't known at
   compile time, so the typed `t()` wrapper can't be used for this one lookup.
3. That's it for data — `deriveRoutes` picks it up automatically, so the next `pnpm build && pnpm
   prerender` produces a real `dist/projects/<slug>/index.html`.
4. `ProjectPage` currently renders just the name and short description. Extend it (screenshots,
   tech stack, links) as real project content gets written — this was intentionally left minimal,
   not unfinished by accident.

## How to add another top-level route

1. Add a page component under `src/pages/<Name>Page/` (mirror `CvPage`'s structure: a component
   calling `useDocumentHead`, plus a colocated test).
2. Add a `<Route element={<YourPage/>} path="..." />` inside `AppRoutes` in `src/App.tsx`.
3. Add a nav link in `Navbar.tsx` if it should be reachable from the header (use react-router's
   `Link`, not a plain `<a>`, for real route transitions).
4. Add the route to `deriveRoutes.ts` if it's a static route (a project-style dynamic route only
   needs its data source wired in, per above).
