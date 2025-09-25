# Scanner Landing Page — Frontend-only Prompt

Goal

Implement the scanner landing page UI (frontend only). The page accepts an NFC/RFID tag (scanned or typed), sends it to `/api/scan`, and displays either the matched asset summary or a clear “Tag not recognized” message. No server code is required — assume `POST /api/scan` exists and follows the contract: request { cardId } → response { asset: Asset | null, message?: string }.

Files to add

- `src/app/page.tsx` (or `src/app/landing/page.tsx`) — landing page that hosts the scanner component.
- `src/components/scanner/ScannerCard.tsx` — main scanner UI component (client).

Behavior & UI requirements

- Input:
  - Single-line text input that accepts pasted/scanned tags.
  - Auto-focus on load; pressing Enter submits.
  - Esc clears input and results.
  - Debounce submissions (300–500ms) to avoid duplicate POSTs.
  - Max length 256 characters; show validation error for longer input.
  - Provide an optional manual “Scan / Submit” button for accessibility.
- Submit flow:
  - POST JSON to `/api/scan` with { cardId: string }.
  - Show a spinner while waiting.
  - On success:
    - If response.asset is non-null: show an asset card with fields: Name, ID, Status, Assigned employee name (if present), Location (if present), and a link to the asset detail page (`/admin/assets/[id]`).
    - If response.asset is null: show a distinct “Tag not recognized” card including the normalized value attempted and a small hint (e.g., “Try trimming leading zeros or full tag”).
  - On network error or 500: show an inline error banner and keep the input for retry.
- Normalization (client-side only, small): trim whitespace and collapse multiple spaces before sending; show the normalized value in the UI (but the server does final matching).
- Accessibility:
  - Input must have aria-label="Scan or paste tag".
  - Announce result changes via an ARIA live region.
  - Buttons and links keyboard-focusable; color contrast compliant.
- Visual/UX:
  - Clean card layout, small header, clear statuses (success green, error red, neutral gray).
  - Minimal animations for state transitions (fade in/out).
  - Mobile-friendly: full-width input and responsive cards.

Data shapes (frontend expectations)

- POST body: { cardId: string }
- Success (found): { asset: { id:number, name:string, status?:string, assignedToName?:string|null, location?:string|null }, message?:string }
- Success (not found): { asset: null, message?:string }

Edge cases to handle (frontend)

- Empty input → show inline validation and do not POST.
- Rapid repeated scans → debounce and disable submit until response completes.
- Long input (>256) → reject with message.
- Partial matches returned by server (rare) → show list if server returns multiple (design for single result by default).

Small implementation contract / pseudo-API call

- Use fetch:
  - const res = await fetch('/api/scan', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ cardId }) });
  - const json = await res.json();

Acceptance criteria (frontend)

- The landing page shows an input and a results card.
- Entering a known tag displays the asset card with Name and ID and a visible link to asset detail.
- Entering an unknown tag shows a “Tag not recognized” message and the attempted normalized tag.
- Keyboard shortcuts work: Enter submits, Esc clears.
- The ARIA live region announces results.

Minimal tests to add (suggestions)

- Unit test for normalization function (trim/collapse spaces).
- Component test:
  - Mock fetch to return an asset; assert asset fields render.
  - Mock fetch to return { asset: null }; assert “Tag not recognized” is shown.
  - Test Enter key triggers submit and Esc clears.

Integration notes

- Keep component self-contained and mark as client component (`"use client"` at top).
- Reuse project UI primitives if available (`Card`, `Button`, `Input`) and follow existing styling conventions.
- Don’t implement server logic — assume `/api/scan` exists; show friendly messages while waiting for it.

Try-it commands (dev)

```powershell
npm run dev
# then open http://localhost:3000
```

If you want, I can generate the actual React/Next.js code for `ScannerCard.tsx` and the landing `page.tsx` now to match your repo style. Which do you prefer?
