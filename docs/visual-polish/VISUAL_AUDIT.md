# Visual Polish Audit

Date: July 26, 2026

This inventory records the pre-change evidence for the constrained Visual
Polish Pass. It is based on a production build, a 256-state automated matrix
across the eight public routes, and a corrected 128-state Arabic/RTL matrix.
The visual baseline is stored in an external, untracked QA folder.

## Baseline

- Public routes tested: `/`, `/about`, `/portfolio`, `/services`, `/blog`,
  `/testimonials`, `/contact`, and `/tools`.
- Viewports tested: 390x844, 430x932, 768x1024, 1024x768, 1280x800,
  1440x900, 1920x1080, and 2560x1440.
- Themes tested: dark and light.
- Languages tested: English/LTR and Arabic/RTL.
- HTTP failures: 0.
- Console-error cases: 0.
- Page-level horizontal overflow cases: 0.
- Invalid public-route heading or main-landmark cases: 0.
- The GitHub calendar intentionally renders wider than its mobile viewport
  inside a clipped/contained widget; it does not expand the document.

## Issue Inventory

| ID | Category | Route / state | Observed problem | Severity | Proposed correction | Affected files |
| --- | --- | --- | --- | --- | --- | --- |
| VP-01 | Typography / hierarchy | All editorial routes; desktop and mobile; both themes and languages | Route display headings occupy too much of the opening viewport and repeat the same visual rhythm. Supporting copy is comparatively weak. | High | Refine the editorial display scale and opening rhythm without changing heading semantics. | `src/components/site/EditorialPages.module.css`, `src/styles/design-system.css` |
| VP-02 | Accessibility / typography | Site-wide metadata, footer, and Personal OS details | Several meaningful secondary labels render below approximately 11px. | High | Raise repeated metadata and footer sizes while preserving a quiet hierarchy. | `src/styles/design-system.css`, `src/components/site/SiteFooter.module.css`, `src/components/site/PersonalOSExperience.module.css`, `src/components/home/home.module.css` |
| VP-03 | Portfolio / hierarchy | `/portfolio`; all tested states | The three projects are presented as near-identical large cards, so the route reads like a README inside panels rather than authored case studies. | Critical | Replace the repeated card shell with varied editorial chapters, clearer openers, evidence bands, and distinct narrative groupings. | `src/components/site/EditorialPages.tsx`, `src/components/site/EditorialPages.module.css` |
| VP-04 | Visual evidence | `/portfolio`; desktop and mobile | Only explanatory diagrams are present. The OS project lacks real current-page evidence, while the other diagrams have weak separation from the surrounding panel. | High | Add current, public-safe captures of the real website and preserve factual SVG evidence for Journey and Windows Maintenance. | `public/images/projects/**`, `src/data/public.ts`, `src/types/public.ts`, `src/components/site/EditorialPages.tsx` |
| VP-05 | Responsive / content density | `/portfolio`; 390x844 and 430x932 | Each project becomes one uninterrupted dense column with weak chapter transitions. | High | Reflow evidence and narrative into mobile chapters, strengthen section markers, and avoid a single monolithic glass shell. | `src/components/site/EditorialPages.module.css` |
| VP-06 | Contact / hierarchy | `/contact`; all states | The opportunity statement is clear, but the opening uses excessive empty space and the later boundaries compete visually with contribution and collaboration information. | High | Tighten the opener, create an opportunity-led primary panel, strengthen the email action, and move limitations to secondary treatment. | `src/components/site/EditorialPages.tsx`, `src/components/site/EditorialPages.module.css` |
| VP-07 | Footer / layout | All public routes; desktop and mobile | Page links are inline inside the nested footer navigation, appearing concatenated. Footer headings and the legal line are too small. | Critical | Make the nested navigation an explicit vertical list, improve spacing and focus states, and raise secondary type sizes. | `src/components/site/SiteFooter.module.css` |
| VP-08 | Glass / consistency | Site-wide; especially light mode | Several surfaces share maximum glass treatment, and dark lower-edge/shadow values make light-mode panels look muddy. | High | Establish clearer Level 1-4 material contrast, soften light-theme absorption and shadow, and reserve strong glass for signature surfaces. | `src/styles/design-system.css`, route CSS modules |
| VP-09 | Motion / glass | Site-wide pointer devices | Every `.ds-glass` surface moves its reflection on hover, including non-interactive reading panels. | Medium | Remove hover motion from the base material and enable it only on genuinely interactive surfaces. | `src/styles/design-system.css`, selected component CSS modules |
| VP-10 | Recognition / evidence | `/testimonials`; all states | Credential details are factual, but there is no real certificate preview, so the evidence remains text-led. | High | Render a public-safe preview from the existing approved PDF and pair it with the restrained credential details. | `public/images/projects/**`, `src/data/public.ts`, `src/types/public.ts`, `src/components/site/EditorialPages.tsx`, `src/components/site/EditorialPages.module.css` |
| VP-11 | Writing state | `/blog`; all states | The empty state is truthful, but the three equal glass cards make the page look like an unfilled product grid. | Medium | Use a quieter editorial topic treatment and give the zero-article state deliberate prominence. | `src/components/site/EditorialPages.module.css` |
| VP-12 | Capabilities / hierarchy | `/services`; all states | Demonstrated, developing, and future capabilities use equal visual weight despite different evidence levels. | High | Add status-aware hierarchy and make evidence more prominent than disclaimers. | `src/components/site/EditorialPages.tsx`, `src/components/site/EditorialPages.module.css` |
| VP-13 | Personal OS / density | `/tools`; mobile and tablet | Widget shells and three-column detail bands create excessive card weight; calendar content extends beyond the widget’s visual bounds although the document itself does not overflow. | Medium | Lighten explanatory shells, increase detail text, and provide a controlled scroll/containment treatment for the calendar. | `src/components/site/PersonalOSExperience.module.css`, active widget wrappers where necessary |
| VP-14 | AI Core / signature | `/`; dark/light, desktop/mobile | The core is functional and restrained but still resembles a generic scientific wireframe. | Medium | Improve shell/core distinction, reduce generic wireframe emphasis, and strengthen the asymmetric optical signature without increasing size or adding loops. | `src/components/ai-core/AICore.module.css`, `src/components/ai-core/AICoreCanvas.tsx`, `src/components/ai-core/AICoreFallback.tsx` |
| VP-15 | Light theme | All routes | Pearl canvas is strong, but project panels and education cards use shadows and lower-edge absorption that are too heavy for the light environment. | Medium | Add deliberate light-theme surface and shadow overrides with clearer image boundaries. | `src/styles/design-system.css`, route CSS modules |
| VP-16 | RTL | Arabic matrix, especially `/portfolio` | Direction, heading count, landmarks, and overflow are correct, but dense mixed-language project chapters need stronger logical spacing and line separation. | Medium | Use logical properties and RTL-specific rhythm only; keep repository and product names in their approved form. | `src/components/site/EditorialPages.module.css`, `src/components/site/SiteFooter.module.css` |
| VP-17 | Navigation / accessibility | Desktop More menu and mobile menu | Existing behavior passed baseline checks, but final polish must preserve focus return, Escape handling, and visible focus while material styling changes. | Guardrail | Retest after visual changes; make no architectural rewrite. | `src/components/navigation/ProductionNavigation.module.css` only if a measured visual issue remains |
| VP-18 | Performance | `/` and evidence-heavy routes | New evidence can increase image weight; current Three.js isolation must remain intact. | Guardrail | Use optimized local WebP for real captures, SVG for diagrams, lazy loading below the fold, and no new client boundary. | `public/images/projects/**`, image-consuming server components |

## Deliberately Preserved

- The homepage AI Core footprint.
- Exactly three main projects.
- The truthful empty Writing state.
- Recognition without testimonials or endorsement placeholders.
- The existing public-data and localization boundaries.
- The route-local Three.js boundary.
- Existing route URLs and static generation.
- The current black, graphite, silver, and pearl identity.
