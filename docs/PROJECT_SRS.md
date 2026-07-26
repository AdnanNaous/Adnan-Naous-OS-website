# Software Requirements Specification & AI Development Contract
## Adnan Naous Portfolio & Personal OS

### 1. Purpose

This document records the verified v1.0 architecture and the constraints future work must preserve unless a later user-approved specification replaces them.

The product is a bilingual public portfolio centered on evidence-based project work. Its distinguishing feature is the Personal OS at `/tools`. The homepage uses an original optical AI Core as an atmospheric visual; no semantic content depends on WebGL.

### 2. Verified Stack

- Next.js 16.2.10 with the App Router
- React and React DOM 19.2.4
- TypeScript 5
- Tailwind CSS 4 through `@tailwindcss/postcss`
- Framer Motion 12.42.x
- Three.js 0.185.1
- React Three Fiber 9.6.1
- `next-themes` 0.4.6
- `react-github-calendar` 5.0.6
- Lucide React and React Icons

Three.js and React Three Fiber are approved only for the route-local homepage AI Core. They must not enter non-home route bundles without a separately approved requirement.

### 3. Route Architecture

```text
src/app/layout.tsx
├── ThemeProvider
├── LanguageProvider
├── shared document shell and skip link
├── (site)/layout.tsx
│   ├── production design system
│   ├── ProductionNavigation
│   ├── SiteFooter
│   ├── page.tsx                  → /
│   ├── about/page.tsx            → /about
│   ├── portfolio/page.tsx        → /portfolio
│   ├── services/page.tsx         → /services
│   ├── blog/page.tsx             → /blog
│   ├── testimonials/page.tsx     → /testimonials
│   ├── contact/page.tsx          → /contact
│   └── tools/
│       ├── layout.tsx            → DashboardProvider boundary
│       └── page.tsx              → /tools
└── internal/design-system/       → noindex internal specimen
```

Route groups do not change public URLs. The root layout remains a Server Component. Theme and language providers are instantiated once. Dashboard state is scoped to `/tools`.

### 4. Public Routes and Truthful Semantics

- `/`: portfolio homepage with verified identity, approved biography, exactly three primary project references, AI Core, verified credential context, and opportunity actions.
- `/about`: approved personal story, current Computer Science and Artificial Intelligence study, previous incomplete medical study, current learning, and working principles. GPA, nationality, and unverified education claims are not public.
- `/portfolio`: exactly three primary evidence-based case studies:
  - Adnan Naous OS Website
  - Adnan Naous Journey
  - Ultimate Windows Maintenance
- `/services`: Capabilities & Collaboration, not an unsupported commercial service menu.
- `/blog`: Writing architecture with an intentional empty state until genuine articles exist.
- `/testimonials`: Recognition with verified credential context and no fabricated endorsements.
- `/contact`: public email and social links; no form backend, storage, or guaranteed response time.
- `/tools`: functioning Personal OS with focus timer, command center, public GitHub activity, and approved resource library.

No fake metrics, testimonials, services, posts, client outcomes, backend behavior, or project completion claims are permitted.

### 5. Public Data Boundary

`src/data/public.ts` is the only approved client-safe factual projection. `src/data/search.ts` derives future static search records from it.

The public boundary must exclude:

- full legal name
- GPA
- nationality
- precise address
- unverified Oxford claims
- private university records
- private bookmarks and raw bookmark exports
- account, workspace, dashboard, session, or portal URLs
- credentials, tokens, API keys, and local filesystem paths
- unsupported project placeholders and metrics

Runtime Client Components must not import review or private data modules. `scripts/content/validate-public-data.mjs` enforces the boundary and the three-project portfolio requirement.

### 6. Localization and RTL

- Public pages provide English and Arabic content.
- `LanguageProvider` controls the active language and updates document `lang` and `dir`.
- English uses LTR; Arabic uses RTL.
- Product, repository, and platform names remain accurate rather than being improperly translated.
- Arabic content must not inherit forced Latin letter spacing.
- Exactly one localized page tree is rendered at a time.
- Language preference defaults to English on reload and is not currently persisted.

Any new user-facing factual content must be added to the approved data boundary in both languages where appropriate and tested in LTR and RTL.

### 7. Theme and Design System

- The public site uses one optical black-and-white design system in `src/styles/design-system.css`.
- Dark is the default; light mode is supported through `next-themes`.
- Bronze and spectral colors are restrained edge or reflection accents rather than dominant surfaces.
- Shared optical glass materials must remain readable without `backdrop-filter`.
- Reduced transparency and forced-colors fallbacks are required.
- The internal design-system specimen uses the same tokens but remains isolated from public navigation and indexing.

### 8. AI Core

The homepage AI Core:

- is dynamically loaded only on `/`
- keeps semantic content outside Canvas
- has CSS/SVG loading, WebGL-unavailable, and error fallbacks
- handles WebGL context loss
- caps device pixel ratio
- reduces mobile geometry and rendering work
- pauses when the document is hidden
- pauses or simplifies outside the viewport
- respects reduced motion
- does not block navigation, text, or keyboard interaction

At v1.0 its measured visual stage is approximately 312 px at 390 px viewport width, 624 px at 1440 px, and 720 px at 1920 px and above.

### 9. Accessibility

Public routes must preserve:

- one page-level `h1`
- one `main` landmark
- semantic navigation and footer
- skip-to-content link
- keyboard-operable navigation, More menu, and mobile menu
- Escape handling and focus restoration
- visible focus indicators
- meaningful link labels
- safe external-link semantics
- meaningful image alt text or decorative empty-alt treatment
- reduced-motion, reduced-transparency, forced-colors, and WebGL fallbacks
- no horizontal document overflow at supported responsive widths

### 10. SEO and Discovery

- The verified production origin is `https://adnannaous.vercel.app`.
- Every public route has a unique factual title, description, and canonical URL.
- Open Graph and Twitter metadata use the generated `/opengraph-image`.
- `/robots.txt` allows public crawling and excludes `/internal/`.
- `/sitemap.xml` contains the eight public routes and excludes the internal specimen.
- The internal design-system route is `noindex, nofollow`.
- Site-level WebSite/Person JSON-LD contains only the approved display name, production URL, and public social profiles.
- Language alternates are not emitted while English and Arabic share the same client-selected URLs; fabricated locale URLs are prohibited.

### 11. Personal OS

`CommandCenter`, `Pomodoro`, `GitHubTracker`, and `BookmarksWidget` are active only through `/tools`.

- Command Center is a local launcher, not a system shell or global command palette.
- Focus timer state is browser-session state.
- GitHub activity depends on the disclosed public third-party activity source and stores no token in public data.
- Resource Library exposes only 19 approved public links, including 12 featured resources.
- Private bookmarks and university portals are excluded.

### 12. Scripts and Quality Gates

Package scripts:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

There is no automated unit or integration test script in `package.json`.

Release validation includes:

```text
npm run lint
npx tsc --noEmit --incremental false
npm run build
node scripts/content/validate-public-data.mjs
git diff --check
```

Browser QA must cover all public routes, the internal specimen, responsive widths, both themes, both languages, RTL, navigation menus, WebGL failure and context loss, reduced motion, reduced transparency, the focus timer, and Command Center Escape behavior.

### 13. Deployment and Release

- GitHub origin: `https://github.com/AdnanNaous/Adnan-Naous-OS-website.git`
- Production branch: `main`
- Deployment: existing GitHub-to-Vercel integration
- No custom `vercel.json`
- Production release tags use annotated semantic versions after the production deployment is verified.

Never force-push, rewrite published history, expose secrets, or modify Vercel project/domain/environment settings without explicit approval.
