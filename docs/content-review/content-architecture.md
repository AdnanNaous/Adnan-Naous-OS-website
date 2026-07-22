# Structured content architecture

Date reviewed: 2026-07-21

## Purpose

The Phase 1 modules provide a typed, auditable source of truth. The approved legacy content migration connects `/about`, `/portfolio`, and the dormant `AboutWidget` to the client-safe public projection without changing their visual design.

## Review data

The normal modules under `src/data/` retain evidence, verification, visibility, conflicts, private review fields, source hashes, and migration decisions. They are internal authoring/review sources and are not approved as direct client imports. The full legal name is intentionally not stored in these modules or elsewhere in the repository.

Every factual record uses independent controls where applicable:

- `verification`: verified, user-provided, requires confirmation, conflicting, unsupported, or placeholder.
- `visibility`: public, private, hidden, hidden pending review, or archived.

`user-provided` records an approved or supplied personal statement; it is not presented as independent verification.
`user-confirmed` records an exact factual value explicitly confirmed by the user. A confirmed value may still remain hidden from public output.

## Client-safe public boundary

- `src/data/public.ts` is the only approved client-side content import.
- It has no runtime imports and contains only explicitly approved public fields.
- It omits nationality, GPA, Oxford details, external portrait source, private contact fields, evidence metadata, original bookmark URLs, source hashes, folder paths, validation notes, unsupported projects, and pending main-project descriptions. The repository stores only the approved public display name and does not store the full legal name. The public projection includes the exact approved English and Arabic biography.
- `src/types/public.ts` defines the deliberately narrower public shapes.
- `src/data/search.ts` imports only `src/data/public.ts` and therefore cannot reach internal review records.
- `src/data/index.ts` remains an internal review barrel and must not be imported by Client Components.

The separate checked-in projection is an intentional privacy boundary. Approved public values must be updated in both the review record and this projection during a future factual lock change.

## Bookmark boundary

The raw Chrome export remains outside the repository. `scripts/bookmarks/audit-bookmarks.mjs` generates a sanitized artifact containing only counts and hashed reconciliation IDs. The internal bookmark shortlist retains review provenance; `public.ts` contains only approved canonical landing-page fields whose validation status is acceptable.

## Migration rule

Client code must import `@/data/public` or `@/data/search`, never the internal barrel or review modules. The legacy content migration changed rendered text and data sources only; no route, asset, stylesheet, layout, or visual system was changed.
