# Word Dice

A small, kid-friendly static site that shows picture dice to generate writing prompts. Each die shows a cartoon image (tree, car, book, house, cat, screwdriver). Choose how many dice to roll (2–8), click "Roll Dice", and a prompt will be generated.

How to open

- Open `index.html` in your browser (double-click or use "Open File").
- Or serve the folder using a simple HTTP server (recommended for some browsers):

```bash
# Python 3
python3 -m http.server 8000

# then open http://localhost:8000
```

Files

- `index.html` - main page
- `styles.css` - styling
- `script.js` - dice logic and icons

Notes

- Icons are stored as external SVG files under `assets/icons/` and referenced from `script.js`.
	- The project previously embedded inline SVGs in `script.js`; those were moved to individual files to make maintenance easier.
	- To add or replace an icon: place an SVG file named `your-id.svg` in `assets/icons/` and add a corresponding entry to the `ICONS` array in `script.js` like `{ id: 'your-id', label: 'Your label' }`.
	- `script.js` will auto-detect `assets/icons/<id>.svg` and use it as the image source. If a file is missing the code will fall back to the icon label.

- Responsive layout
	- The dice area adapts rows based on viewport width: small screens show 1 row, normal screens show 2 rows, and very wide screens show 3 rows.
	- The JS computes the number of columns from the chosen dice count and the preferred rows so the dice arrange evenly (for example, 8 dice become 4 columns × 2 rows on typical screens).

- Testing / smoke test
	- Some browsers restrict loading local files (SVG) when opening `index.html` via file://. It's recommended to serve the folder with a simple HTTP server while testing.
	- Example (Python 3):

```bash
# from the project folder
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

- Accessibility: aria labels and live regions are used so screen readers announce changes.
# worddice

How to run locally

The site is a static bundle. For best results serve the project folder over HTTP (some browsers block local file access for SVGs).

From the project root (macOS / Linux):

```bash
# Python 3 simple server
python3 -m http.server 8000

# Then open http://localhost:8000 in your browser
```

You can also use any static server (http-server, serve, etc.) if you prefer.

