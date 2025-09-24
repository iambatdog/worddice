PR: grade-presets + standards mapping UI

Summary

This PR introduces teacher-facing grade-level presets and a standards mapping UI for Word Dice. It includes:

- Grade presets (K–2, 3–5, 6–8, 9–12)
  - Apply / Preview actions
  - "Apply (with placeholders)" to insert label-only placeholders for unmatched items when artwork is missing
  - Persistence via `localStorage` key `wd_grade_band`

- Standards mapping
  - A data-driven standards table rendered from `STANDARDS_DATA` in `script.js`
  - Dedicated Standards-only modal (`#standards-modal`) reachable via a floating "Content Standards" button
  - Row-click reveals a full detail view in `#standards-detail`
  - Keyboard accessible and focus trapped

- UX cleanup
  - Removed duplicate Content Standards button inside Settings
  - Improved modal stacking and backdrop handling
  - Transient note text for preset application

Files touched

- `index.html` — added standards modal and floating button; removed duplicate modal button
- `script.js` — added STANDARDS_DATA, renderStandardsTable(), standards modal wiring, floating button wiring, and cleaned debug logs
- `styles.css` — added floating button styling and modal z-index tweaks
- `CHANGELOG.md` — appended Unreleased notes

Testing notes

1. Open `index.html` in a browser.
2. Click the "Content Standards" floating button at bottom-right — a Standards modal should open (not Settings).
3. The standards table should render; click a row to view full details in the detail area.
4. Close via the X, backdrop, or Esc.
5. Settings should still open via the cog and manage allowed images, PIN, and grade presets.

Follow-ups / optional

- Hide the floating standards button behind the teacher PIN or a feature flag.
- Export/print standards mapping as PDF or CSV.
- Add unit tests for label normalization and preset matching logic.
