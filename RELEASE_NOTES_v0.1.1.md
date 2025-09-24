Word Dice v0.1.1 — Standards & Grade Presets

Highlights

- New: Grade level presets for K–2, 3–5, 6–8, and 9–12. Teachers can Apply or Preview a preset of classroom-appropriate prompts. When artwork is missing, "Apply (with placeholders)" creates label-only placeholders so presets remain useful.

- New: Standards mapping UI. A dedicated Standards modal exposes a table mapping grade bands to prompt focuses and related CCSS writing standards. Open it quickly via the floating "Content Standards" button in the bottom-right.

- UX: Removed duplicate in-modal standards control. The Standards modal is keyboard-accessible and focus-trapped. Preset application shows a transient confirmation note.

Files changed

- index.html — added `#standards-modal` and `#floating-standards-btn`.
- script.js — added STANDARDS_DATA, renderStandardsTable(), standards modal wiring, and preset improvements.
- styles.css — added floating button styles and z-index fixes.
- CHANGELOG.md — updated Unreleased section.

Notes for reviewers

- The standards table is data-driven via `STANDARDS_DATA` in `script.js`. Expand or edit that data to update the modal content.
- The floating standards button intentionally opens a standalone modal so teachers can view mappings without navigating Settings.

Upgrade notes

- No external dependencies.
- Existing localStorage keys remain unchanged.
