# Phase 1 content data sources

Date reviewed: 2026-07-21

This file records provenance identifiers used by the typed content modules. It intentionally does not copy private contact details, secret values, or private URLs from the source material.

## Repository sources

| Source ID | Source | Use |
| --- | --- | --- |
| `repository-current-checkout` | Current `main` checkout at the audited commit | Routes, components, assets, dependencies, and implemented behavior |
| `repository-current-site` | Existing website content | Current public identity and wording |
| `repository-about-page` | `src/app/about/page.tsx` | Education and profile claims |
| `repository-current-portfolio-page` | `src/app/portfolio/page.tsx` | Existing project cards and unsupported placeholders |
| `repository-contact-page` | `src/app/contact/page.tsx` | Public email and contact presentation |
| `repository-home-page` | `src/app/page.tsx` | Display name and public social links |
| `repository-navbar` | `src/components/Navbar.tsx` | Existing brand abbreviation and routes |
| `repository-package-json` | `package.json` | Installed framework and library evidence |
| `repository-source-and-package-json` | Source imports plus `package.json` | Technologies demonstrably used in this project |
| `repository-git-history` | Local Git metadata | Git use and repository continuity |
| `repository-readme` | `README.md` | Public site and deployment description |
| `repository-public-projects` | Public repository metadata inspected during the audit | Supporting identity and project existence |
| `repository-arabic-localization` | `src/context/LanguageContext.tsx` and localized page content | Existing Arabic support, not language proficiency |

## Supplied sources

| Source ID | Source | Use and limits |
| --- | --- | --- |
| `supplied-cv-2026-07-12` | `Adnan.Naous.CV.pdf` supplied outside the repository | Education, prior study, introductory skills, and training claims; private fields are not copied |
| `external-bookmark-export-2026-07-19` | `bookmarks_7_19_26.html` supplied outside the repository | Authoritative bookmark titles and URLs; raw content stays outside the repository |
| `phase-1-user-specification` | Approved Phase 1 requirements | Data model and privacy rules; not evidence for biographical claims |
| `phase-1-confirmation-lock-2026-07-21` | User-approved answers to the 17 content decisions | Public identity, availability, language wording, skills, placement, removal, resource, portrait-use, and resume decisions |
| `supplied-portrait-reference` | Supplied portrait image outside the repository | Candidate image only; ownership and public-use approval remain pending |
| `supplied-visual-references` | Supplied concept images outside the repository | Visual context only; not factual evidence |

## Audited external references

| Source ID | Source | Use |
| --- | --- | --- |
| `github-profile-audit-2026-07-21` | Public GitHub profile and repository metadata | Public username and repository existence; no API statistics are stored |
| `production-http-check-2026-07-21` | Public production website response | Deployment URL availability |

The source identifiers are audit labels, not an automated evidence database. Claims with `requires-confirmation`, `conflicting`, `unsupported`, or `placeholder` status must not be promoted to verified public content without review.
