# Software Requirements Specification (SRS) & AI Development Contract
## Adnan Naous - Personal OS & Portfolio

### 1. Project Overview
This document serves as the permanent Software Requirements Specification and AI Development Contract for the Adnan Naous Personal OS & Portfolio. It outlines the verified technical stack, architecture, and core systems present in the codebase.

### 2. Framework & Versions
- **Core Framework:** Next.js version 16.2.10 (App Router)
- **UI Library:** React & React DOM version 19.2.4
- **Language:** TypeScript (^5.x)
- **Styling:** Tailwind CSS (^4.x) via `@tailwindcss/postcss`

### 3. Dependencies
Key production dependencies driving the application features include:
- `framer-motion` (^12.42.2) for animations and UI interactions.
- `next-themes` (^0.4.6) for theme management (Dark/Light mode).
- `lucide-react` (^1.24.0) and `react-icons` (^5.7.0) for iconography.
- `react-github-calendar` (^5.0.6) for the GitHub activity tracker.
- `clsx` and `tailwind-merge` for dynamic class name construction.

### 4. Folder Structure & Architecture
The project strictly adheres to the Next.js `src` directory structure:
```
/
├── docs/                 # Documentation (including this SRS)
├── public/               # Static assets (images, SVGs)
└── src/
    ├── app/              # Next.js App Router pages and global layouts
    ├── components/       # Reusable UI components and widgets
    └── context/          # React Context providers for global state
```

### 5. Application Routes
The following routes are implemented within the `src/app/` directory:
- `/` (Home page / Dashboard)
- `/about`
- `/blog`
- `/contact`
- `/portfolio`
- `/services`
- `/testimonials`
- `/tools`

### 6. Components
The user interface is constructed using the following primary components located in `src/components/`:
- `Navbar.tsx`: Navigation and global controls.
- `CommandCenter.tsx` & `SearchWidget.tsx`: Global search and command palette functionality.
- `Pomodoro.tsx`: Integrated productivity timer.
- `GitHubTracker.tsx`: Visualizes GitHub contribution history.
- `BookmarksWidget.tsx` & `LearningWidget.tsx`: Specialized dashboard widgets for links and educational paths.
- `MetricsWidget.tsx` & `AboutWidget.tsx`: Informational dashboard cards.
- `SpotlightCard.tsx`: Reusable animated card wrapper.

### 7. Localization System
- **Implementation:** React Context API via `src/context/LanguageContext.tsx`.
- **Supported Languages:** English (`en`, LTR) and Arabic (`ar`, RTL).
- **Mechanism:** The context provides a translation function `t(key)` and dynamically updates the HTML `dir` attribute to handle layout mirroring (RTL/LTR) seamlessly.

### 8. Theme System
- **Implementation:** `next-themes` wrapped around the application.
- **Aesthetic:** A strict Grayscale and Glassmorphism design system utilizing `backdrop-blur` and neutral Tailwind colors.
- **Light Mode Adjustments:** Filters (e.g., `grayscale`, `contrast`) applied to images strictly use the `dark:` prefix to maintain visual clarity in Light mode.

### 9. Deployment & Source Control
- **GitHub Repository:** Hosted at `https://github.com/AdnanNaous/Adnan-Naous-OS-website.git` (Origin).
- **Vercel Configuration:** Connected via GitHub integration for continuous deployment on pushes to the `main` branch. The project relies on Vercel's zero-config Next.js preset (no custom `vercel.json` required).

---
*Document verified against the live repository state as of initial deployment.*
