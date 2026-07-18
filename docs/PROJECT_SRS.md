# Software Requirements Specification (SRS) & AI Development Contract
## Adnan Naous - Personal OS & Portfolio

### 1. Project Overview
This document records the verified architecture, current implementation status, and development requirements for the Adnan Naous Personal OS & Portfolio. Current-status statements describe the codebase audited on July 18, 2026; requirements describe the direction future changes should preserve unless a redesign is explicitly approved.

The application combines a public portfolio with a Personal OS dashboard. The portfolio landing experience is served at `/`, while the productivity dashboard is served at `/tools`.

### 2. Framework & Versions
- **Core Framework:** Next.js 16.2.10 (App Router)
- **UI Library:** React and React DOM 19.2.4
- **Language:** TypeScript (^5.x)
- **Styling:** Tailwind CSS (^4.x) via `@tailwindcss/postcss`

### 3. Dependencies
Key production dependencies currently include:
- `framer-motion` (^12.42.2) for animations and UI interactions.
- `next-themes` (^0.4.6) for dark/light theme management.
- `lucide-react` (^1.24.0) and `react-icons` (^5.7.0) for iconography.
- `react-github-calendar` (^5.0.6) for the GitHub activity tracker.
- `clsx` (^2.1.1) and `tailwind-merge` (^3.6.0) for class-name composition.

### 4. Folder Structure & Architecture
The application source uses the Next.js `src` directory structure:

```text
/
├── docs/                 # Project documentation, including this SRS
├── public/               # Static assets
└── src/
    ├── app/              # App Router pages, root layout, and global styles
    ├── components/       # Reusable UI components and dashboard widgets
    └── context/          # React Context providers for global client state
```

The root layout provides `ThemeProvider`, `LanguageProvider`, and `DashboardProvider`, and renders the shared navigation. Dashboard state is currently client-side and in memory.

### 5. Application Routes
The following routes are implemented within `src/app/`:
- `/`: Public portfolio landing page and hero experience.
- `/about`: Background, education, and certifications.
- `/blog`: Static microblog-style updates.
- `/contact`: Contact email and terminal-style presentation.
- `/portfolio`: Project showcase.
- `/services`: Services overview.
- `/testimonials`: Testimonials grid.
- `/tools`: Personal OS dashboard containing the active productivity widgets.

### 6. Components

#### Active shared components
- `Navbar.tsx`: Global navigation, language control, theme control, and mobile menu.

#### Active Personal OS components
The following components are rendered by `/tools`:
- `CommandCenter.tsx`: Search and prefix-command interface scoped to `/tools`. It is not currently a global command palette.
- `Pomodoro.tsx`: Focus/break timer, task field, session count, and lo-fi control.
- `GitHubTracker.tsx`: GitHub contribution calendar.
- `BookmarksWidget.tsx`: Categorized bookmark directory with focus-mode filtering.
- `SpotlightCard.tsx`: Reusable interactive card wrapper used by the dashboard.

#### Present but currently unused components
These files exist in `src/components/` but are not imported into a rendered route:
- `SearchWidget.tsx`
- `LearningWidget.tsx`
- `MetricsWidget.tsx`
- `AboutWidget.tsx`

Unused components should not be described as active features until they are connected to a route.

### 7. Localization and RTL

#### Current implementation
- Localization uses React Context via `src/context/LanguageContext.tsx`.
- English (`en`, LTR) and Arabic (`ar`, RTL) are supported.
- The context provides `t(key)` and updates the document `lang` and `dir` attributes on the client.
- Route content and layout direction are substantially localized, but coverage is not complete. Some component labels, content blocks, bookmark categories, and terminal text remain hardcoded in English.
- RTL support is substantial but has not been verified as complete across every component and direction-sensitive style.
- Language preference is held in React state, defaults to English, and is not currently persisted across reloads.

#### Requirement
New user-facing content should provide English and Arabic translations, and affected layouts should be reviewed in both LTR and RTL. Documentation must not claim complete localization or seamless RTL until coverage and behavior have been verified across the entire application.

### 8. Theme and Visual System

#### Intended direction
The visual identity is grayscale-led and uses restrained glassmorphism, neutral surfaces, subtle borders, and backdrop blur. Future work should preserve this identity unless an explicit redesign is approved.

#### Current implementation
- `next-themes` applies class-based light/dark themes. Dark is the default, and system-theme detection is disabled.
- CSS variables define the principal foreground, background, border, and navigation colors.
- Most active surfaces use neutral colors and glass effects.
- The implementation is not exclusively grayscale. Confirmed accent-color deviations include:
  - Red, yellow, green, blue, and purple terminal styling on `/contact`.
  - Green active-state styling on the Pomodoro lo-fi control.
  - Colored GitHub contribution palettes in `GitHubTracker.tsx`.
  - Additional blue, green, orange, and purple styles in currently unused widgets.
- The home profile image applies grayscale/contrast/brightness filters only in dark mode. The blog avatar applies grayscale and contrast filters in both themes.

These deviations are documented current behavior, not a new requirement to expand the accent-color palette.

### 9. Scripts and Quality Baseline
The package scripts currently available are:
- `npm run dev`: Start the Next.js development server.
- `npm run build`: Create a production build.
- `npm run start`: Serve a production build.
- `npm run lint`: Run ESLint.

No automated test script is currently defined in `package.json`.

At the start of the July 18, 2026 alignment work:
- TypeScript validation passed with `npx tsc --noEmit --incremental false`.
- ESLint produced 6 errors and 7 warnings with `npm run lint`.
- The confirmed ESLint errors included unescaped JSX quotation marks and state updates reported inside React effects. Warnings included unused imports/variables and unoptimized `<img>` elements.
- This is the pre-fix baseline; Phase 1 is intended to resolve these findings without suppressing rules.

### 10. Deployment & Source Control
- **GitHub origin:** `https://github.com/AdnanNaous/Adnan-Naous-OS-website.git`
- **Production branch:** `main`
- **Vercel configuration:** No custom `vercel.json` is present; the repository is compatible with Vercel's standard Next.js behavior.

The project documentation identifies GitHub-to-Vercel deployment as the intended production flow. The external Vercel integration itself cannot be verified from the local repository alone.

---
*Documentation aligned with audited commit `1344761ad81509ad0934fb5aed6d4768c7389156` on July 18, 2026.*
