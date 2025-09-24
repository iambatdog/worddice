# Missing icons — Grade 9–12 checklist

This checklist lists the Grade 9–12 preset entries that don't currently match any icon in `script.js` (or existing `assets/icons/`). For each item I suggest a kebab-case filename you can add under `assets/icons/` (SVG). After adding the files, update the `ICONS` array in `script.js` to include an entry like `{ id: '<id>', label: '<Label>' }`.

Instructions

- Add SVG files to `assets/icons/` using the suggested filenames (e.g. `assets/icons/clock-tower-at-midnight.svg`).
- For best results use the style guidance in `AI_PROMPTS.md` (flat playful cartoon, 1:1, pastel palette).
- After adding files, refresh the site, open Settings → Grade presets → Preview/Apply.

Checklist (Grade 9–12)

- [ ] Crashed spaceship with tracks leading away — assets/icons/crashed-spaceship-with-tracks-leading-away.svg
- [ ] Train disappearing into fog — assets/icons/train-disappearing-into-fog.svg
- [ ] Abandoned carnival ride — assets/icons/abandoned-carnival-ride.svg
- [ ] Cathedral ruins with vines — assets/icons/cathedral-ruins-with-vines.svg
- [ ] Ancient book glowing faintly — assets/icons/ancient-book-glowing-faintly.svg
- [ ] Lighthouse beam cutting through storm — assets/icons/lighthouse-beam-cutting-through-storm.svg
- [ ] Empty theater stage — assets/icons/empty-theater-stage.svg
- [ ] Clock tower at midnight — assets/icons/clock-tower-at-midnight.svg
- [ ] Shadow of a person but no one there — assets/icons/shadow-of-a-person.svg
- [ ] Deserted city street at night — assets/icons/deserted-city-street-at-night.svg
- [ ] Statue missing its head — assets/icons/statue-missing-its-head.svg
- [ ] Blood-red moon — assets/icons/blood-red-moon.svg
- [ ] Frozen lake with cracks forming — assets/icons/frozen-lake-with-cracks.svg
- [ ] Bridge leading to nowhere — assets/icons/bridge-leading-to-nowhere.svg
- [ ] Old photograph half burned — assets/icons/old-photograph-half-burned.svg
- [ ] Chessboard mid-game — assets/icons/chessboard-mid-game.svg
- [ ] Mask cracked in half — assets/icons/mask-cracked-in-half.svg
- [ ] Broken stained-glass window — assets/icons/broken-stained-glass-window.svg
- [ ] Crows circling a barren tree — assets/icons/crows-circling-barren-tree.svg
- [ ] Abandoned school hallway — assets/icons/abandoned-school-hallway.svg
- [ ] Spiral staircase vanishing into darkness — assets/icons/spiral-staircase-vanishing.svg
- [ ] Suitcase left in the middle of a road — assets/icons/suitcase-left-in-road.svg
- [ ] Overgrown garden with forgotten fountain — assets/icons/overgrown-garden-forgotten-fountain.svg
- [ ] Torn flag waving — assets/icons/torn-flag-waving.svg
- [ ] Key glowing faintly in the dark — assets/icons/key-glowing-faintly.svg
- [ ] Candle flickering in a cavern — assets/icons/candle-flickering-in-cavern.svg
- [ ] Giant shadow cast on a wall — assets/icons/giant-shadow-cast-on-wall.svg
- [ ] Portal opening in the sky — assets/icons/portal-opening-in-sky.svg
- [ ] Ship stranded on dry land — assets/icons/ship-stranded-on-dry-land.svg
- [ ] Writing on a wall that no one understands — assets/icons/writing-on-a-wall.svg

Notes

- Some of these entries contain elements that partially overlap existing icons (e.g. `spaceship`, `bridge`, `lighthouse`, `book`, `clock`, `key`, `tree`). If you'd prefer to cover these prompts with compositions using existing icons (for example overlaying a `spaceship` icon with a "crash" vignette), you can reuse current artwork. The checklist above assumes you want distinct, dedicated icons for each labeled prompt.
- After placing SVGs in `assets/icons/` be sure to add corresponding `{ id: '<id>', label: '<Label>' }` objects to the top of `script.js` (and optionally to `DEFAULT_SAFE_OBJECTS`) so they appear in the safe-list.
- If you'd like, I can:
  - Generate optimized SVG samples (simple placeholders) for these filenames so you can refine them later.
  - Produce a single `assets/raster/manifest.json` template if you want raster variants.

---
Generated: 2025-09-24
