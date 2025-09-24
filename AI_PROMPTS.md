# AI Prompts for Word Dice

This file contains polished, reusable prompts to generate a consistent set of kid-friendly icons for the Word Dice project. Use the base templates and the per-icon examples with Stable Diffusion, Midjourney, or DALL·E. Also included: negative prompts, style guidance, export and post-processing steps, and filename conventions.

---

## Style summary (recommended)

Use a single consistent style for the whole icon set to keep the dice visually cohesive.

Recommended style: "Flat playful cartoon"
- Bold dark outlines (not too thick), rounded corners, simple shapes.
- Bright but soft pastel palette (peach, mint, soft yellow, baby blue, lavender).
- Minimal detail for readability at small sizes.
- Centered composition on a white rounded-square or transparent background with soft drop shadow.
- 1:1 aspect ratio (square). Ideally center the subject and leave consistent padding.

---

## Base prompt template (Stable Diffusion / general)

Use this core prompt and substitute the subject ({OBJECT}). Create several samples per prompt and pick the most consistent output.

"Icon of a {OBJECT}, flat playful cartoon style, bold dark outline, simple shapes, rounded corners, bright pastel colors, child-friendly, minimal detail, centered composition on white rounded-square background, soft drop shadow, clean edges, high resolution, 1:1 aspect ratio, isolated on transparent background"

Example: "Icon of a tree, flat playful cartoon style, bold dark outline, simple trunk and rounded canopy, bright pastel greens and brown, child-friendly, centered composition on white rounded-square background, soft drop shadow, high resolution, 1:1 aspect ratio, isolated on transparent background"

---

## Midjourney variants

Use a compact Midjourney prompt and append parameters. E.g.:

`/imagine Icon of a tree, flat playful cartoon, bold outline, pastel palette, child-friendly, centered, white rounded-square background, transparent --ar 1:1 --v 5 --q 2 --stylize 50`

Notes: prefer lower stylize values for simpler results (e.g., `--stylize 50`), use `--ar 1:1` for square outputs.

---

## DALL·E prompt notes

DALL·E prompts follow the same wording as the base template; ask for 1024×1024 transparent PNG if the service supports it.

---

## Negative prompts (Stable Diffusion)

Use negative prompts to avoid undesirable artifacts:

`low quality, deformed, disfigured, text, watermark, signature, extra limbs, hands, photorealistic, blurred, noisy, distorted, busy background, overly detailed, grain, jpeg artifacts`

Example combined negative prompt: `bad anatomy, watermark, blurred, photorealistic, too detailed, noisy, text, signature, low quality`

---

## Resolution & export recommendations

- Generate at 1024×1024 (or 1536×1536) for safe downscaling. Export PNG (transparent). Optionally create WebP for web use.
- Create multiple sizes for responsive use: 1024, 512, 256 (or 1024 and 512 if you prefer fewer sizes).
- Filenames: `assets/raster/<size>/<id>.webp` (or .png). Example: `assets/raster/1024/tree.webp` and `assets/raster/512/tree.webp`.
- Keep original outputs in a separate folder (e.g., `assets/original_ai/`) for provenance.

---

## Post-processing / consistency

- Batch-crop and center images so the subject occupies a consistent fraction of the image area (padding consistent across icons).
- Optionally run a palette harmonization (map main hues to your selected project palette) to unify color across icons.
- Add a subtle rounded-square background and soft drop shadow if the model didn't include it.
- Remove stray pixels and check for artifacts near the edges.

Tools: Photoshop, Photopea (web), ImageMagick, pngquant, cwebp.

---

## Example prompts for each icon

Replace `{OBJECT}` with the text in each prompt. Use the base template and vary only small composition notes when needed.

- tree
"Icon of a tree, flat playful cartoon style, bold dark outline, simple trunk and rounded canopy, bright pastel greens and brown, child-friendly, centered composition on white rounded-square background, soft drop shadow, high resolution, 1:1 aspect ratio, isolated on transparent background"

- car
"Icon of a small car, flat playful cartoon style, bold outline, rounded shape, bright red body, simple windows and wheels, child-friendly, centered on white rounded-square background, soft shadow, 1:1"

- book
"Icon of an open book, flat playful cartoon style, bold outline, simple pages with a small heart or star on the cover, pastel blue cover, centered, white rounded-square background, 1:1"

- house
"Icon of a small house, flat playful cartoon style, bold outline, triangular roof, warm yellow walls, single window, centered, white rounded-square background, 1:1"

- cat
"Icon of a friendly cat face, flat playful cartoon style, bold outline, rounded ears, simple whiskers, warm orange palette, centered, white rounded-square background, 1:1"

- balloon
"Icon of a balloon with string, flat playful cartoon style, bold outline, pastel pink balloon, single string, soft highlight, centered, white rounded-square background, 1:1"

- rocket
"Icon of a small rocket, flat playful cartoon style, bold outline, rounded nose, small fins, pastel red and blue, centered, white rounded-square background, 1:1"

- treasure-chest
"Icon of a treasure chest, flat playful cartoon style, bold outline, wooden chest slightly open with gold coins glinting, centered, white rounded-square background, 1:1"

- pirate-ship
"Icon of a small pirate ship, flat playful cartoon style, bold outline, single mast with small flag, simple hull, centered, white rounded-square background, 1:1"

- rainbow
"Icon of a rainbow, flat playful cartoon style, bold outline, curved bands with pastel colors, small cloud at one end, centered, white rounded-square background, 1:1"

- dragon
"Icon of a friendly cartoon dragon head, flat playful cartoon style, bold outline, tiny horns, pastel green, smiling expression, centered, white rounded-square background, 1:1"

- robot
"Icon of a robot face, flat playful cartoon style, bold outline, simple eyes and antenna, pastel blue/grey, centered, white rounded-square background, 1:1"

- moon
"Icon of a crescent moon, flat playful cartoon style, bold outline, soft yellow, centered, white rounded-square background, 1:1"

- castle
"Icon of a small castle, flat playful cartoon style, bold outline, turrets and a flag, pastel purple, centered, white rounded-square background, 1:1"

- bicycle
"Icon of a bicycle side view, flat playful cartoon style, bold outline, simple wheels and frame, pastel colors, centered, white rounded-square background, 1:1"

- dinosaur
"Icon of a friendly dinosaur, flat playful cartoon style, bold outline, small spikes on back, pastel green, centered, white rounded-square background, 1:1"

- lighthouse
"Icon of a lighthouse, flat playful cartoon style, bold outline, red and white stripes, light beam, centered, white rounded-square background, 1:1"

- fox
 

- old-key
"Icon of an old-fashioned key, flat playful cartoon style, bold outline, simple bow and teeth, gold color, centered, white rounded-square background, 1:1"

- magic-wand
"Icon of a magic wand with sparkles, flat playful cartoon style, bold outline, dark handle and bright star, centered, white rounded-square background, 1:1"

- umbrella
"Icon of an umbrella, flat playful cartoon style, bold outline, pastel canopy, simple handle, centered, white rounded-square background, 1:1"

- cookie
"Icon of a cookie with chocolate chips, flat playful cartoon style, bold outline, warm brown, centered, white rounded-square background, 1:1"

- paintbrush
"Icon of a paintbrush, flat playful cartoon style, bold outline, wooden handle and colorful bristles, centered, white rounded-square background, 1:1"

- camera
"Icon of a camera, flat playful cartoon style, bold outline, lens and flash, pastel grey body, centered, white rounded-square background, 1:1"

- map
"Icon of a folded map, flat playful cartoon style, bold outline, small path and X, centered, white rounded-square background, 1:1"

- kite
"Icon of a kite with tail, flat playful cartoon style, bold outline, diamond shape, colorful, centered, white rounded-square background, 1:1"

- spaceship
"Icon of a spaceship, flat playful cartoon style, bold outline, rounded cockpit, pastel colors, centered, white rounded-square background, 1:1"

- waterfall
"Icon of a waterfall, flat playful cartoon style, bold outline, stylized water flow, rocks, centered, white rounded-square background, 1:1"

- cloud-city
"Icon of a small cloud city, flat playful cartoon style, bold outline, tiny buildings sitting on a cloud, pastel colors, centered, white rounded-square background, 1:1"

- clock
"Icon of a clock, flat playful cartoon style, bold outline, simple hands showing 3 o'clock, centered, white rounded-square background, 1:1"

- skateboard
"Icon of a skateboard, flat playful cartoon style, bold outline, small wheels, colorful deck, centered, white rounded-square background, 1:1"

- bakery
- puppet
- magician-hat


- bridge
"Icon of a simple bridge, flat playful cartoon style, bold outline, centered, white rounded-square background, 1:1"

- owl
"Icon of an owl face, flat playful cartoon style, bold outline, big round eyes, centered, white rounded-square background, 1:1"

- lantern
"Icon of a lantern, flat playful cartoon style, bold outline, warm glow, centered, white rounded-square background, 1:1"

- seashell
"Icon of a seashell, flat playful cartoon style, bold outline, pastel colors, centered, white rounded-square background, 1:1"

- snowman
"Icon of a snowman, flat playful cartoon style, bold outline, small hat and scarf, centered, white rounded-square background, 1:1"

- violin
"Icon of a violin, flat playful cartoon style, bold outline, warm wood tones, centered, white rounded-square background, 1:1"



---

## Batch generation tips

- Generate 4–6 variations per prompt, then pick the best and optionally run a second pass with a slightly modified prompt to fine-tune composition.
- Use a consistent seed (if available) for slight variations.
- For Stable Diffusion, consider using Img2Img with a rough thumbnail to nudge composition.

---

## Post-generation workflow

1. Collect outputs in `assets/original_ai/<id>/` with the filename including the model and seed.
2. Pick the best image per id and run automatic trimming/cropping to consistent canvas size (1024×1024) and padding.
3. Export final files to `assets/raster/1024/<id>.png` and `assets/raster/512/<id>.webp`.
4. Update the repo manifest or add `raster` fields to `ICONS` if you want the app to prefer rasters.

---

## Quick examples for Midjourney (copy/paste)

`/imagine Icon of a tree, flat playful cartoon, bold outline, pastel palette, child-friendly, centered, white rounded-square background, transparent --ar 1:1 --v 5 --q 2 --stylize 50`

`/imagine Icon of a treasure chest, flat playful cartoon, wooden chest slightly open with gold coins glinting, bold outline, pastel palette, --ar 1:1 --v 5 --q 2 --stylize 50`

---

## Licensing note

If using AI-generated images, check the model/service rules for commercial redistribution. Keep original images and note which model/service and settings were used.

---

## If you want, I can:
- Add a `assets/prompts/` folder with a JSON manifest mapping icon ids to prompts.
- Add `AI_PROMPTS.md` (this file) to the repo (done).
- Implement a `script.js` change to prefer raster assets if you produce them.

If you'd like the next step automated, tell me whether to (A) implement raster fallback code in `script.js`, or (B) add a conversion script to generate raster files from current SVGs. I'll proceed with your preference.

---

## Archived items

The following icon files were archived and moved to `assets/icons/archive/` in the repository. They have been removed from the active `ICONS` list but are kept for backup in case you want to restore them:

- bakery.svg
- cloud-city.svg
- fox.svg
- garden-gate.svg
- lantern.svg
- magician-hat.svg
- magician.svg
- postage-stamp.svg
- puppet.svg
- robot-dog.svg
- screwdriver.svg
- waterfall.svg

To restore any archived asset, move the corresponding file from `assets/icons/archive/` back into `assets/icons/` and add the id/label back to the `ICONS` array in `script.js`.