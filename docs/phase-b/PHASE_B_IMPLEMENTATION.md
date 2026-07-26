# Phase B — Unified Public Experience

## Scope

Phase B rebuilds every public route inside the shared `(site)` layout while preserving all public URLs. The production shell owns the optical background, navigation, footer, theme control, language control, focus treatment, and shared width system.

The internal design-system preview remains outside this shell.

## Content boundary

`src/data/public.ts` is the client-safe factual boundary. Public route components may import this module and its public types. Review datasets, raw bookmarks, private profile fields, GPA, and unsupported claims must not enter runtime route graphs.

`src/data/search.ts` derives its static records from the same public boundary.

## Route roles

- `/` — AI Core-led public identity and verified-work narrative.
- `/about` — approved biography, study transition, education, languages, and current learning.
- `/portfolio` — three verified main project case studies.
- `/services` — evidence-backed Capabilities & Collaboration.
- `/blog` — truthful Writing state with no invented articles.
- `/testimonials` — Recognition with verified credentials and no invented endorsements.
- `/contact` — opportunity context, mail-based action, and public profiles.
- `/tools` — Personal OS with the focus timer, command center, public GitHub activity, and approved resource library.

## Client boundaries

- Production navigation: route state, theme, language, and mobile menus.
- Localized content selector: switches between server-created English and Arabic trees.
- AI Core: route-local WebGL enhancement with a static fallback.
- Personal OS widgets: timer, command launcher, GitHub calendar, and resource filtering.

All other route composition remains server-rendered.

## Future backend extension points

No backend behavior is implemented in Phase B.

Potential later extensions require separate approval:

- A contact endpoint with spam protection, privacy disclosure, validation, and explicit success/failure states.
- A writing source with an editorial workflow and real publication dates.
- A GitHub data endpoint with server-side credential handling, caching, and graceful rate-limit behavior.
- Personal OS persistence with a documented local-only or authenticated storage boundary.

Until those extensions exist, the contact page opens the visitor's email application, Writing remains an honest empty state, GitHub activity uses the existing public integration, and Personal OS state remains session-local.
