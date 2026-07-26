# Phase C — Marketing and Portfolio Experience

## Product Intent

Phase C turns the unified Phase A and Phase B architecture into a persuasive evidence-led portfolio. The site communicates through public repositories, documented decisions, current limitations, and verified credentials rather than unsupported adjectives.

## Narrative Order

The homepage follows this order:

1. Hero and AI Core.
2. Current mission.
3. Three verified projects.
4. Featured website case study.
5. Five-step building process.
6. Evidence-backed capabilities.
7. Verified recognition.
8. Personal OS preview.
9. Opportunity and contact action.
10. Shared site footer.

## Route Roles

- `/about`: personal transition, education, current focus, and working principles.
- `/portfolio`: exactly three detailed case studies with public evidence.
- `/services`: Capabilities & Collaboration, including explicit boundaries.
- `/blog`: future-ready Writing structure with no fabricated articles.
- `/testimonials`: Recognition based on verified credentials, with no endorsements.
- `/contact`: opportunity fit, contribution areas, collaboration preferences, and mail-only contact disclosure.
- `/tools`: Personal OS product story, module behavior, limitations, privacy, and live tools.

## Data Boundary

All factual runtime content comes from `src/data/public.ts`. Search records derive only from that projection. Review-only and private data are not imported into public components.

## Visual Evidence

Three locally authored SVG diagrams explain actual architecture and workflows. They do not reproduce private screens, simulate fake interfaces, or claim results beyond repository evidence.

## Writing Boundary

The typed `PublicArticle` model supports future published work. The approved public article collection is empty until real content is ready.
