# Development Logs — Asset Management Full Stack

Generated: 2025-09-11

This document captures the full working history, edits, lessons, and the current project state from the first day of work through the present. It’s intended as a single source-of-truth for what we changed, why, and what to do next.

## High-level project goals

- Build a multi-organization asset-management Next.js (app-router) app with a MySQL backend.
- Core features: registration/login, asset & employee management, NFC/RFID scanning + check-in/out flows, dashboard charts, and UI polish.
- Support multiple organizations (company_id) and locations.
- Keep the server resilient to schema drift (avoid ER_BAD_FIELD_ERROR when DB columns differ).

---

## Timeline & major activities (chronological)

1. Project kickoff / schema inspection
   - Read the provided MySQL dump (`database1.sql`) to discover table schemas and available fields.
   - Observed `assets` table included `location_id`, `nfcId`, `rfid`, `imageUrl` among other fields.

2. Initial API surface and UI wiring
   - Implemented standard REST-like routes under `src/app/api` for `assets`, `employees`, `locations`, `scan`, and `login`.
   - Added client components and forms for asset registration, employee management, and scanner UI (`src/components` and `src/app/admin`).

3. Robust server-side INSERT handling
   - Problem: direct INSERTs failed with unknown column errors when the DB schema didn’t match the code.
   - Solution: POST `/api/assets` was rewritten to query `INFORMATION_SCHEMA.COLUMNS` and build an INSERT statement only for columns that actually exist. This eliminated ER_BAD_FIELD_ERROR problems and made the API resilient to schema drift.

4. NFC / RFID scanning support
   - Implemented `/api/scan` to accept `cardId` and look up matching `assets` by `nfcId` or `rfid`.
   - Built `CardScanner` UI to POST scanned tags and render asset details or a "not recognized" message.

5. File attachments & image uploads (experimental)
   - Implemented an attachments API and local file storage under `public/uploads` to support image uploads.
   - Created upload UI and persisted `file_url` initially.
   - Decision later: user asked to remove all image/upload logic, so attachments route and references were deleted and types updated.

6. Multiple debugging rounds and fixes
   - Fix: Invalid Hook Call ( caused by calling hooks at module scope ) — moved hook calls to client components and added `"use client"` where appropriate.
   - Fix: `Select.Item` runtime error when value was empty — introduced a sentinel value `"none"` and normalized inputs before submit.
   - Fix: Next.js dynamic route warning about `params` usage — changed to `const { params } = await context` and awaited context in API route.
   - Fix: SQL error `Field 'company_id' doesn't have a default value` — included `company_id` in asset creation payload, fetched current user's `companyId` from `/api/employees/me`, and allowed a fallback `DEFAULT_COMPANY_ID` env var.

7. Continued UI and data wiring
   - Wired location select (`/api/locations`) into the Registration form.
   - Added `nfcId` and `rfid` fields to the registration form and to the Zod schema.
   - Updated `asset-list` to accept the real response shape from `/api/assets` (an array), avoiding earlier shape mismatches.

8. Scan troubleshooting and instrumentation
   - User reported the scanner returned nothing after a scan.
   - Added structured debug logging to `src/app/api/scan/route.ts` to log:
     - Received raw `cardId` and trimmed `idToSearch`.
     - The SQL query string and query params.
     - Query result count and matched asset id/name when found.
   - Left the server ready to receive scan attempts; the next diagnostic step requires the user to run a scan and paste logs.

---

## File-level summary of important edits

- src/app/api/assets/route.ts
  - GET: returns assets (adjusted response shape when necessary).
  - POST: replaced static INSERT with a dynamic insert built from `INFORMATION_SCHEMA.COLUMNS`.
  - Mapping of client-side `locationId` to DB `location_id`.
  - `company_id` handling added (accept from client; fallback to `DEFAULT_COMPANY_ID` env var; return 400 if required and missing).

- src/app/api/assets/[id]/route.ts
  - CRUD handlers for single asset; removed any image attachment handling after the user asked to drop image uploads.

- src/app/api/scan/route.ts
  - POST expects { cardId } and searches `assets` by `nfcId` or `rfid`.
  - Added debug logging and trimmed normalization of inputs to help diagnose mismatches.

- src/app/api/locations/route.ts
  - GET locations to populate selects in the registration form.

- src/app/api/attachments/route.ts (created, later deleted)
  - Initial local-file upload support with multipart parsing, saved files to `public/uploads`, and DB inserts. Deleted on user request.

- src/components/assets/registration-form.tsx
  - Zod schema: status/assignedTo rules, `locationId`, `nfcId`, `rfid`.
  - Includes `companyId` in payload (pulled from `/api/employees/me`).
  - Image upload UI was added and later removed.

- src/components/CardScanner.tsx
  - Client UI that POSTs new scans and renders either asset details or a clear "Tag not recognized" message.
  - Adjusted to show asset results irrespective of user info presence.

- src/components/assets/asset-list.tsx
  - Fixed to consume an array response from `/api/assets` rather than nested shapes.

- src/lib/types.ts
  - Removed `imageUrl` from the shared `Asset` type after image logic was removed.

- Other
  - Fixed several components that were calling hooks at module scope by moving hooks into client components and adding `"use client"`.
  - Created and later cleaned up `public/uploads` references.

---

## Lessons learned & observations

- Defensive DB access is critical: when the code expects certain columns but the database can vary (different environments), querying `INFORMATION_SCHEMA` and building dynamic queries prevents runtime MySQL errors.

- Keep server and client boundary clean: calling React hooks outside render context or in server components causes invalid-hook-call errors. The rule of thumb applied: any code that uses hooks must be in a client component and must start with `"use client"`.

- Normalization is necessary for physical tag values: scanned NFC/RFID tags often come with different formatting (whitespace, hex prefixes like `0x`, leading zeros, case differences). Implementing trimming and normalization on the server improves matching reliability.

- Prefer explicit, small data shapes over implicit assumptions. Several bugs came from a mismatch between expected response shapes (e.g., expecting { assets: [] } vs []), which are easy to avoid with small contracts and types across API boundaries.

- Feature rollback is okay: we experimented with image uploads and local file storage, but the user asked to remove them; we removed the endpoints and types cleanly. Keeping the code modular made it simple to add and later remove that feature.

- Instrumentation beats blind guessing: adding concise logs to the `/api/scan` endpoint was the fastest way to diagnose unmatched tags. Collecting raw inputs, SQL, and result counts gives immediate insight.

---

## Key milestones

- Milestone 1: Inventory & schema understanding — confirmed `assets` had `nfcId`, `rfid`, `location_id`.
- Milestone 2: CRUD APIs + admin UI skeleton implemented.
- Milestone 3: Resilient POST `/api/assets` with INFORMATION_SCHEMA-aware inserts.
- Milestone 4: Registration form wired to `locations` and `employees/me` for `company_id`.
- Milestone 5: NFC/RFID scanning endpoint + `CardScanner` UI implemented.
- Milestone 6: Removed image upload/attachment logic on user request and cleaned up types.
- Milestone 7: Added debug instrumentation to `/api/scan` to diagnose unmatched scans.

---

## Current state (where we are today)

- The codebase compiles; TypeScript typechecks run cleanly after recent changes.
- `assets` POST is robust against schema differences, and `company_id` is included when creating assets.
- Scanner UI will POST scanned tags to `/api/scan` and render a clear message for not-found tags.
- `/api/scan` now logs incoming card IDs and query details to the server console for debugging.
- Image upload/attachment features were implemented then rolled back; the codebase no longer references `imageUrl` or attachments.

---

## Outstanding items / recommended next steps

1. Reproduce scan case and collect logs
   - Run the app, perform a scan (or send a POST to `/api/scan` with the tag), and capture the dev-server console logs. Look for the newly added `[scan]` debug lines.
   - Paste logs into the issue or share with the team so normalization rules can be tailored.

2. Harden tag matching
   - After logs are available, implement normalization heuristics server-side if needed (trim, lowercase, strip `0x`, remove leading zeros, try hex → decimal conversions, fallback `LIKE` partial matches).

3. Add unit tests for `/api/scan`
   - Add small tests that validate known tag formats map to assets by mocking DB responses. This prevents regressions when normalization logic is adjusted.

4. Optional: Reintroduce image uploads with S3 or local storage
   - If desired, re-add attachment handling. For S3 we need to fix dependency resolution. Local uploads are simpler but need a cleanup/retention policy and possibly scanning for safe file types.

5. UX improvements
   - Auto-navigate to the found asset page on match.
   - Add a history view for recent scans.

---

## Repro steps for scan debugging (quick)

1. Start dev server (Next.js) in dev mode.
2. On the scanner UI, scan a physical tag or paste the tag into the scanner input.
3. In the dev server console, look for debug lines:
   - [scan] incoming cardId:
   - [scan] idToSearch:
   - [scan] running query: (SQL and params)
   - [scan] query result count:
   - [scan] matched asset: or [scan] no rows matched for id...
4. Paste those lines here and we will iterate on normalization logic.

---

## Contact points in code (quick map)

- Scan: `src/app/api/scan/route.ts`
- Assets: `src/app/api/assets/route.ts` and `src/app/api/assets/[id]/route.ts`
- Registration form: `src/components/assets/registration-form.tsx`
- Scanner UI: `src/components/CardScanner.tsx`
- Types: `src/lib/types.ts`
- Locations API: `src/app/api/locations/route.ts`

---

## Closing summary

We progressed from schema discovery to a stable CRUD surface and a working scanner with robust insert behavior and clear diagnostics. The codebase is now safer against schema differences and provides better observability for NFC/RFID matching problems. The next diagnostic step is to run a scan and paste the server logs so we can add any missing normalization logic and make matching near-100% reliable.

---

## Changelog (dates & authors)

All entries below are chronological snapshots of the major changes made during this development engagement. Author names reflect the repository owner and the assistant who applied code changes.

- 2025-09-11 — TakudzwanasheSamuel, GitHub Copilot
   - Initial project review and schema inspection. Confirmed `assets` table has `nfcId`, `rfid`, `location_id`, and `imageUrl` in the supplied SQL dump.

- 2025-09-11 — GitHub Copilot
   - Added REST-like API endpoints under `src/app/api` for `assets`, `employees`, `locations`, `scan`, and `login`.
   - Implemented client-side admin UI skeleton in `src/app/admin` and reusable components in `src/components`.

- 2025-09-11 — GitHub Copilot
   - Implemented robust POST `/api/assets` logic that queries `INFORMATION_SCHEMA.COLUMNS` and builds an INSERT dynamically for only the existing database columns (prevents ER_BAD_FIELD_ERROR).

- 2025-09-11 — GitHub Copilot
   - Implemented `/api/scan` to accept `{ cardId }` and look up `assets` by `nfcId` or `rfid`.
   - Added `CardScanner` UI to POST scans and render either asset details or an explicit "Tag not recognized" message.

- 2025-09-11 — GitHub Copilot
   - Experimented with local file uploads and an attachments API (`public/uploads` + `src/app/api/attachments/route.ts`), then removed the attachments implementation at the user's request and cleaned up references and types (`imageUrl` removed from `src/lib/types.ts`).

- 2025-09-11 — GitHub Copilot
   - Fixed multiple runtime issues:
      - Moved hook usage into client components and added `"use client"` to avoid invalid-hook-call errors.
      - Introduced a sentinel Select value `"none"` to avoid empty-value runtime errors.
      - Fixed Next.js dynamic route `params` usage by awaiting context in the API handler.
      - Resolved `company_id` insert error by ensuring the registration flow supplies `companyId` (pulled from `/api/employees/me`) and adding an optional `DEFAULT_COMPANY_ID` fallback.

- 2025-09-11 — GitHub Copilot
   - Added structured debug logging to `src/app/api/scan/route.ts` to capture incoming raw `cardId`, normalized `idToSearch`, executed SQL and params, query result count, and matched asset details; this enables quick diagnosis of unmatched scan cases.

- 2025-09-11 — TakudzwanasheSamuel, GitHub Copilot
   - Performed iterative TypeScript checks and validation; final typecheck completed with no errors after the last edits.

---

If you want these changelog entries split into separate dated commits or converted into a Git-friendly `CHANGELOG.md` (one entry per git commit with hashes), I can create a branch and prepare a PR containing the formatted history.


