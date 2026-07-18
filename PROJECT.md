# Project: Personal OS (Productivity Dashboard)

## Architecture
- **Tech Stack**: Vanilla Node.js for backend APIs, HTML5/CSS3/ES6 Javascript for frontend.
- **Data Flow**: Frontend (SPA) ↔ Node.js Local Server (or Vercel Serverless Functions) ↔ Supabase Rest API (or Local JSON File fallback).
- **Core Modules**:
  - `api/db.js`: Database client with dual-mode storage (Supabase REST API / Local JSON file).
  - `api/todo.js`: Handles task CRUD.
  - `api/journal.js`: Handles daily logs and notes CRUD.
  - `api/bookmarks.js`: Handles categorized bookmarks CRUD.
  - `api/secrets.js`: Handles secure masked secrets storage CRUD.
  - `server.js`: Local HTTP server for routing api and serving static files.
  - `app.js`, `index.html`, `styles.css`: Dark-themed interactive single-page app dashboard.
- **Vercel Configuration**: `vercel.json` routing rules for static frontend and serverless api routes.

## Code Layout
- `C:\Users\AAN_TRUEMAN\.gemini\antigravity\scratch\productivity_dashboard/`
  - `api/`
    - `db.js`
    - `todo.js`
    - `journal.js`
    - `bookmarks.js`
    - `secrets.js`
  - `index.html`
  - `styles.css`
  - `app.js`
  - `server.js`
  - `vercel.json`
  - `package.json`
  - `verify.js`

## Dual Track Test Suite
- **E2E Testing Track Orchestrator**: `sub_orch_test` (ID: `68c07fde-a4c5-40c2-88db-b342a739d652`) is active in parallel to design test runner and suite.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| 1 | M1: Project Setup & Local Server | Establish server.js, vercel.json, package.json, base index.html | None | IN_PROGRESS (sub_orch_impl: 2ca817e9-f54e-468a-b6d8-760cd9b1b183) |
| 2 | M2: Database Layer & Verification | Implement api/db.js with local JSON fallback/Supabase support, build verify.js runner | M1 | IN_PROGRESS (sub_orch_impl: 2ca817e9-f54e-468a-b6d8-760cd9b1b183) |
| 3 | M3: Productivity API & Frontend | Build api/todo.js, api/journal.js, api/bookmarks.js, and main frontend SPA UI | M2 | IN_PROGRESS (sub_orch_impl: 2ca817e9-f54e-468a-b6d8-760cd9b1b183) |
| 4 | M4: Portfolio & Toolbox UI | Add Portfolio section and Super Toolbox (timer, text formatter) | M3 | IN_PROGRESS (sub_orch_impl: 2ca817e9-f54e-468a-b6d8-760cd9b1b183) |
| 5 | M5: Secrets Storage & Masking | Implement api/secrets.js and password masking/reveal UI | M4 | IN_PROGRESS (sub_orch_impl: 2ca817e9-f54e-468a-b6d8-760cd9b1b183) |
| 6 | M6: E2E Integration & Verification | Run all tests (Tiers 1-4) using verify.js, achieve 100% pass | M5 | PLANNED |
| 7 | M7: Adversarial Hardening (Tier 5) | Conduct white-box coverage analysis, run Challenger for edge cases, fix gaps | M6 | PLANNED |

## Interface Contracts
### API endpoints ↔ DB
- All inputs are validated.
- Responses return JSON.
- Standard HTTP status codes (200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal Error).
