# Bookmark link validation

Date reviewed: 2026-07-21

## Candidate-shortlist result

| Status | Count |
| --- | ---: |
| Valid | 18 |
| Redirected | 0 |
| Broken | 0 |
| Unreachable | 0 |
| Requires login | 1 |
| Private | 0 in the candidate shortlist |
| Duplicate | 0 |
| Requires manual review | 12 |

These counts describe the 31 normalized approved-group records, not all 171 imported entries. Network reachability does not constitute endorsement. The 19 acceptable stored statuses enter the client-safe projection; the 12 manual-review statuses remain hidden.

## Automated reachability sweep

A fresh parallel GET check of all 31 canonical candidate URLs produced:

- 24 direct successful responses.
- 3 redirect responses.
- 4 HTTP responses consistent with authentication, rate limiting, or automated-client blocking.
- 0 other HTTP failures.
- 0 network-unreachable results.

Automated-client blocking is not classified as a broken public link. Those resources retain their conservative manual or previously browser-verified status until reviewed interactively.

## Normalization decisions

- Account-dashboard, team-specific, and tracking-bearing source URLs were retained only in the external export. Their public candidates use clean canonical destinations and retain a source hash for reconciliation.
- Product-action paths such as new-chat pages were normalized to the public product root where appropriate.
- Required functional paths, including documentation version paths, were preserved.
- Repeated domains were consolidated only when the curated record represented the same public resource; no source entry was deleted.
- The Papers with Code candidate remains under manual review because a responding domain is not sufficient evidence that it is the intended canonical service.

## Whole-export limitations

The parser validates structure, URL parseability, duplicate normalization, query/fragment presence, and likely authentication risk without exposing private values. It does not issue network requests for all 171 links. The 123 `Requires Confirmation` records therefore remain excluded rather than being treated as valid public links.

Broken or unreachable records must remain in review if future network checks identify them; they must not be deleted automatically.
