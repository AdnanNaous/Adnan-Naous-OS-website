# Content conflicts and unsupported claims

Date reviewed: 2026-07-21

## Resolved conflicts

### GPA

The official GPA is user-confirmed as 3.43 / 4.00. The earlier discrepancy is resolved, and the superseded value has been removed from the structured record. The confirmed value remains hidden from public UI, `publicData`, and search, while remaining eligible for later use in a sanitized resume.

The approved content-only migration removed GPA and Oxford wording from `/about` and the dormant `AboutWidget`. The confirmed GPA exists only in internal structured data; unverified Oxford details remain internal and hidden.

### Profile image identity

The current `/profile.jpg` is an abstract orb rather than a portrait. Ownership and public-use permission for the separately supplied portrait are approved, but the source remains outside the repository and is not part of the public-data projection. Future visual processing must preserve facial geometry and real appearance.

### Current navigation versus proposed navigation

The implemented routes are Home, Portfolio, Services, About, Testimonials, Blog, Contact, and Tools. Proposed Profile, Projects, GitHub, and Utility routes do not currently exist. Services, Testimonials, and Blog are approved for future archival or primary-navigation removal, but no route was added, removed, or renamed in this phase.

## Unsupported or placeholder claims in the current interface

- Medical Data Processor and AI Integration Tools have no repository, build, or supplied evidence. They remain archived in internal review data and were removed from rendered public output on 2026-07-22.
- Numerical skill percentages are not evidence-based and are excluded from the normalized skill model.
- Service claims for production backend systems, databases, APIs, or completed AI solutions are broader than the supplied evidence.
- Testimonials use unverified people, organizations, and quotations.
- Homepage/client/project metrics, including traffic, completed-project, experience, and client figures, are unsupported.
- Blog read counts, publication dates, trending labels, and realtime-style activity claims are not supported by a content source.
- Terminal-style online status, visitor counts, or deployment activity must not be treated as live facts.

## Normalization decisions

- The primary title is `Computer Science Student`; `Software Engineer` is not used as established employment.
- Previous medical study is recorded as incomplete undergraduate study, never as a degree or professional medical work.
- Project statuses use controlled factual labels and contain no invented metrics.
- Repository stars, forks, language, and update time are absent from local GitHub metadata and reserved for a future server-side integration.
- Remaining unsupported public marketing language outside `/about` and `/portfolio` is documented for separately approved future content migrations and is not carried into the new structured source.
