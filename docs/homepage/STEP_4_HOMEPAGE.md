# Step 4 Production Homepage

## Scope

Step 4 applies the Step 3 design-system foundation to the production homepage at `/`. It introduces the reusable production navigation, a responsive cinematic composition, the approved portrait and its presentation derivative, factual profile metadata, calls to action, social links, and a capability Dock. Existing production routes remain outside this visual migration.

## Content Boundary

All factual homepage content is selected from `src/data/public.ts` by `src/components/home/homeContent.ts`. The selector exposes only:

- public display name and brand;
- localized primary title and supporting identity labels;
- localized short biography, current status, location, and availability statement;
- approved GitHub, LinkedIn, and X profiles;
- the user-approved public portrait record;
- three approved public GitHub repository records in their locked display order;
- the user-confirmed Kanz AI Hackathon credential and its local public PDF path.

Private review modules, GPA, nationality, Oxford claims, private bookmarks, raw exports, unsupported projects, and resume-only fields are not imported by the homepage.

## Dependency Flow

```text
src/data/public.ts
        ↓
homeContent.ts
        ↓
HomeComposition and production navigation
        ↓
Step 3 typed primitives
        ↓
Step 3 scoped utilities
        ↓
--ds-* semantic tokens
```

`src/app/(home)/page.tsx` is a Server Component and is the production import boundary for `src/styles/design-system.css`. The internal preview keeps its independent route-local import. Preview specimen CSS is not loaded by the homepage.

The root layout owns only the shared document shell, providers, and skip link. The `(home)` and `(legacy)` server layouts provide route-local `main-content` focus targets so the shared skip link remains correct without crossing navigation ownership. The `(home)` layout owns `ProductionNavigation`; the `(legacy)` route group owns the legacy `Navbar` and its reserved top spacing for `/about`, `/blog`, `/contact`, `/portfolio`, `/services`, `/testimonials`, and `/tools`. This separate server layout path keeps the legacy navigation module and its client dependencies unreachable from the homepage client graph. Route-group folder names do not alter public URLs.

## Components

- `ProductionNavigation`: the only navigation interaction boundary; manages language, theme, mobile menu state, Escape handling, focus return, and temporary body-scroll locking.
- `LocalizedHomepage`: a narrow language selection boundary that renders one localized server-built composition at a time.
- `HomeComposition`: the semantic page structure and responsive three-zone composition.
- `MotionReveal`: a narrow homepage-only Framer Motion boundary around server-rendered content; it respects reduced motion and does not own factual content.
- `CinematicAtmosphere`: a decorative native Canvas 2D enhancement with capped pixel ratio, reduced mobile particle count, visibility pausing, reduced-motion handling, and deterministic cleanup.
- `HeroContent`: heading, approved summary, primary and secondary actions, and approved social profiles.
- `PortraitStage`: optimized framework image using the approved transparent presentation derivative, stable sizing, and CSS-only lighting and atmospheric blending.
- `ProfileMetadata`: compact desktop identity card sourced from approved public data.
- `HomeDock`: Step 3 `Dock` and `DockItem` primitives presenting three approved repository links and one approved credential link from the public-data boundary.

## Optical Glass Materials

The reusable Step 3 stylesheet defines a shared optical material base and purpose-specific variants for navigation, panels, docks, menus, buttons, subtle controls, and icon wells. Each variant selects from semantic `--ds-glass-*` tokens for surface tint, directional refraction, asymmetric reflection, edge thickness, contact shadow, saturation, and controlled blur. Pseudo-elements are decorative and never intercept pointer input.

The material remains dimensional without `backdrop-filter`: opaque-enough layered tint, edge reflections, lower thickness, and contact shadow form the static fallback. Reduced-transparency and forced-colors preferences further simplify decoration while preserving readable controls.

## Responsive Behavior

- Desktop uses a cinematic three-zone grid with a compact left editorial column, an isolated central portrait integrated into the environment, and a small smoked-glass identity panel on the right. The narrower optical Dock overlaps the lower scene without containing invented metrics.
- Tablet simplifies to editorial content, portrait, and Dock while omitting the desktop identity card.
- Mobile uses the same semantic content tree in a separately art-directed portrait-first composition. It shows one dominant CTA and a compact four-column Dock while omitting the desktop metadata, secondary CTA, and social row.
- The production navigation switches to a compact optical header below the desktop breakpoint. Language, theme, and GitHub controls remain keyboard-accessible inside the deep smoked mobile panel.

Logical properties preserve RTL layout. Arabic removes unsuitable Latin tracking and uses the existing Arabic font fallback. Dark mode uses a warm-black and bronze atmosphere; light mode is independently tuned with ivory, champagne, sand, taupe, and deep-brown contrast. Reduced-motion, reduced-transparency, and forced-colors behavior is inherited from the Step 3 foundation and supplemented by homepage-specific fallbacks.

The approved reference is used only for composition, material depth, proportion, and atmosphere. The production implementation recreates its planets, vertical texture, grain, vignette, and bronze glow with local CSS; it does not import the reference artwork, phone frame, annotations, or unsupported reference copy.

## Portrait Record

The approved identity portrait remains stored at `/images/profile/adnan-naous-portrait.webp` as a 1600 × 1600 WebP. A transparent production presentation derivative is stored at `/images/profile/adnan-naous-portrait-cutout.webp`, also at 1600 × 1600. Its typed public-data record is nested under the approved portrait and declares `derivedFrom: "approved-portrait"`; it is not an independent identity record.

The derivative preserves the original subject pixels and uses only background removal, metadata removal, edge refinement, and edge decontamination. No face, identity, age, skin tone, hairstyle, beard, body proportion, clothing, or anatomy was generated or changed. The approved original remains unchanged.

## Enhancement and Performance Boundary

The homepage adds no dependency, external font, remote image, video, WebGL, analytics, or tracking. Content, portrait, metadata, social actions, and Dock remain server rendered. Client JavaScript is isolated to language/theme/navigation interaction, narrow route-local reveal wrappers, and the decorative Canvas atmosphere.

The Canvas layer contains no semantic content and cannot block pointer input. It caps device pixel ratio, reduces particle count on mobile, reuses typed arrays instead of allocating per frame, pauses while the document is hidden, cleans up animation frames and listeners, and renders a static frame for reduced motion. CSS planets, stars, ribbons, light, orbits, grain, and vignette provide the complete static composition when Canvas or motion is unavailable.
