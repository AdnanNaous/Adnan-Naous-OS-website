# Bookmark import summary

Date reviewed: 2026-07-21

## Source handling

- Export found: yes.
- Source file: `bookmarks_7_19_26.html`, retained outside the repository.
- Parser: `scripts/bookmarks/audit-bookmarks.mjs`.
- Generated audit: `bookmark-audit.generated.json`.
- Raw titles, URLs, URL parameters, domains, and folder paths are omitted from the generated audit. Source reconciliation uses truncated SHA-256 identifiers.
- The raw import is never exposed to the client. Only approved, sanitized canonical landing-page fields may enter `src/data/public.ts`.

## Import totals

| Measure | Count |
| --- | ---: |
| Bookmarks | 171 |
| Folders | 32 |
| Leaf folders containing bookmarks | 25 |
| Empty folders | 7 |
| Exact duplicate URLs | 0 |
| Normalized duplicate URLs | 0 |
| Repeated domains | 3 |
| URLs containing query parameters | 12 |
| URLs containing fragments | 3 |
| Likely login/account-specific entries | 15 |

## Initial classification totals

| Classification | Count |
| --- | ---: |
| Featured Public candidates | 18 |
| Public Library candidates | 15 |
| Personal Only | 1 |
| University Private | 3 |
| Account-Specific | 5 |
| Duplicate | 0 |
| Broken or Unreachable from structural parsing | 0 |
| Archive Candidate | 6 |
| Requires Confirmation | 123 |

These are the parser's conservative first-pass classifications, not the final editorial lock. The 31 records in `src/data/bookmarks.ts` are a manually normalized shortlist drawn from the export.

## Approved shortlist lock

| Decision | Count |
| --- | ---: |
| Featured Public | 12 |
| Public Library | 19 |
| Public visibility with acceptable stored validation | 19 |
| Hidden pending manual validation | 12 |
| Private records in the shortlist | 0 |

Editorial approval and validation remain separate. All 31 resources were assigned an approved content group, but only valid, redirected, or safe public landing pages that require login are included in `src/data/public.ts`. The remaining 12 retain their approval group while staying hidden.

## Privacy boundary

The external export remains the authoritative private source. It must not be copied under `public/` or imported by client-side code. Original URLs, folder paths, source hashes, and validation notes remain outside the client-safe projection.
