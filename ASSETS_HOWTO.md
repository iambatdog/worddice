How to add and manage image assets for Word Dice

Overview

This document explains where image files live, how the app picks images, how to add new SVGs and raster (WebP/PNG) variants, how to write the raster manifest, and quick commands to convert SVGs into raster sizes on macOS (zsh).

File locations and purpose

- assets/icons/
  - Place vector SVG icons here. The app expects files named <id>.svg where <id> matches the `id` in `script.js`'s `ICONS` array (for example `tree.svg` for id `tree`).
  - Active icons are referenced by `ICONS` in `script.js` and by the safe-list UI.

- assets/icons/archive/
  - This folder contains archived/removed SVGs. Keep backups here if you remove icons from the active set.
  - To restore an archived icon, copy the file back to `assets/icons/` and add its `id` back to `ICONS` and (optionally) `DEFAULT_SAFE_OBJECTS` in `script.js`.

- assets/raster/
  - Optional high-quality raster images (WebP and/or PNG) that the app can prefer when available.
  - Organize by size subfolders (optional but recommended): e.g. `assets/raster/256/`, `assets/raster/512/`, `assets/raster/1024/`.
  - Filenames should match the icon id (e.g. `assets/raster/512/tree.webp`).

Raster manifest: how the app finds raster files

- The app reads `assets/raster/manifest.json` (fetched at startup). If an icon id exists in the manifest, the app will build a <picture> element with `source` elements and an `<img>` fallback.
- Manifest structure (JSON):
  {
    "tree": {
      "webp": [ {"path": "assets/raster/256/tree.webp", "width": 256}, {"path":"assets/raster/512/tree.webp","width":512} ],
      "png": [ {"path": "assets/raster/512/tree.png", "width": 512 } ]
    },
    "car": { ... }
  }

- Notes:
  - `width` is the logical pixel width used for building srcset strings. Keep the width value accurate for correct browser choice.
  - You can include only `webp`, only `png`, or both.
  - The manifest may contain a subset of icons; missing icons fall back to `assets/icons/<id>.svg`.

Naming conventions and `ICONS` ids

- The small `ICONS` array in `script.js` lists the available icons by `id` and `label` and the code automatically sets `src` to `assets/icons/<id>.svg` when not provided.
- Keep file names lowercase and use hyphens for spaces (e.g., `treasure-chest.svg` for `treasure-chest`). The `label` can contain spaces and is shown to users.

Archiving and restoring icons

- To archive (remove from the live set but keep a backup):
  1. Copy `assets/icons/<id>.svg` to `assets/icons/archive/<id>.svg`.
  2. Remove the entry with that `id` from the `ICONS` array in `script.js` and from `DEFAULT_SAFE_OBJECTS` if present.
  3. The site code sanitizes saved safe lists, but you may also want to clear `wd_safe_objects` in your browser's localStorage for testing.

- To restore:
  1. Copy the file from `assets/icons/archive/<id>.svg` back into `assets/icons/<id>.svg`.
  2. Add the icon object back into the `ICONS` array in `script.js` (id + label) and optionally into `DEFAULT_SAFE_OBJECTS`.
  3. Reload the page.

Quick conversion examples (macOS zsh)

Note: These commands rely on external tools. Pick one of the following toolchains and install it first.

A. Using ImageMagick (rsvg-convert recommended or ImageMagick + librsvg):

# Convert an SVG to PNG at 512px width
rsvg-convert -w 512 -o assets/raster/512/tree.png assets/icons/tree.svg

# Convert to WebP (ImageMagick `convert` -> `magick` on newer versions)
magick assets/raster/512/tree.png -quality 88 assets/raster/512/tree.webp

B. Using Inkscape (good fidelity for complex vectors):

# Export 1024px wide PNG
inkscape assets/icons/tree.svg --export-type=png --export-width=1024 --export-filename=assets/raster/1024/tree.png

# Create WebP from the PNG
magick assets/raster/1024/tree.png -quality 88 assets/raster/1024/tree.webp

C. Using headless Chrome (via `puppeteer` script) — more involved, recommended for consistent rendering of complex SVG effects. If you want this I can add a node script.

Suggested workflow

1. Prepare SVG files in `assets/icons/` named `<id>.svg`.
2. Create raster exports at sizes you want (256, 512, 1024) into `assets/raster/<size>/`.
3. Update `assets/raster/manifest.json` with the entries and paths you created (or let me create the manifest for you).
4. Serve the project over HTTP and open the page. The UI will fetch the manifest at startup and prefer raster images when available.

Testing locally

- Start a simple server in the project root (so fetch() can load the manifest):

python3 -m http.server 8000

- Open http://localhost:8000 in your browser.

Want me to generate rasters?

- I can add a conversion script that uses ImageMagick or Inkscape to generate the PNG/WebP files for any subset of icons. Tell me which tools are available on your mac (ImageMagick, Inkscape, or Node with puppeteer), and I'll add a script and run it.

Notes on licensing and quality

- Keep original SVGs under `assets/icons/` as your canonical source — raster exports are just convenience files and can be re-generated.
- For AI-generated images, follow the licensing rules of your generator and include attribution if required.

Contact me with the conversion tool you prefer and the list of icons you want converted, and I'll add a script and generate the files.
