const fs = require('fs');
const path = require('path');

// Load preset labels by reading script.js and extracting the GRADE_PRESETS_RAW block.
const repoRoot = process.cwd();
const scriptPath = path.join(repoRoot, 'script.js');
const iconsDir = path.join(repoRoot, 'assets', 'icons');
const rasterDir = path.join(repoRoot, 'assets', 'raster');
const templatePath = path.join(repoRoot, 'assets', 'placeholders', 'template.svg');

if(!fs.existsSync(templatePath)){
  console.error('Template SVG not found at', templatePath);
  process.exit(1);
}
if(!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
if(!fs.existsSync(rasterDir)) fs.mkdirSync(rasterDir, { recursive: true });

const src = fs.readFileSync(scriptPath, 'utf8');
const match = src.match(/const GRADE_PRESETS_RAW = \{([\s\S]*?)\};/m);
if(!match){
  console.error('Could not find GRADE_PRESETS_RAW in script.js');
  process.exit(1);
}

// A quick-and-dirty JS eval scope to recover the arrays safely: convert to JSON-like
let rawBlock = '{' + match[1] + '}';
// Replace single quotes with double quotes for JSON compatibility (simple but effective for our content)
rawBlock = rawBlock.replace(/([\w]+)\s*:/g, '"$1":');
rawBlock = rawBlock.replace(/'/g, '"');
// Remove trailing commas that would break JSON
rawBlock = rawBlock.replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']');
let presets = {};
try{
  presets = JSON.parse(rawBlock);
}catch(e){
  console.error('Failed to parse presets block (falling back to simpler extraction).', e.message);
  // Fallback: parse lines for arrays
  const lines = match[1].split('\n');
  let current = null;
  lines.forEach(l=>{
    const k = l.match(/\s*([a-z0-9]+):\s*\[/i);
    if(k){ current = k[1]; presets[current]=[]; return; }
    const m = l.match(/\s*'(.+?)'\s*,?/);
    if(m && current){ presets[current].push(m[1]); }
  });
}

function normalizeLabel(s){
  return String(s||'').toLowerCase().replace(/[’'".,:()]/g,'').replace(/\s+/g,' ').trim();
}

// Read template
const tpl = fs.readFileSync(templatePath, 'utf8');

const created = [];
// color palettes by band
const BAND_PALETTES = {
  k2: { bg:'#fffaf0', stripe:'#ffd8b3', chip:'#ffe7d6', stroke:'#ffd8b3', text:'#333' },
  g35: { bg:'#f0fbff', stripe:'#bfefff', chip:'#dff6ff', stroke:'#bfefff', text:'#113344' },
  g68: { bg:'#fff7fb', stripe:'#ffd1f0', chip:'#ffe7f5', stroke:'#ffd1f0', text:'#3c1033' },
  g912: { bg:'#f3f7ff', stripe:'#cfe0ff', chip:'#e8f0ff', stroke:'#cfe0ff', text:'#102240' }
};

for(const band of Object.keys(presets)){
  const arr = presets[band] || [];
  const palette = BAND_PALETTES[band] || BAND_PALETTES['k2'];
  for(let i=0;i<arr.length;i++){
    const label = arr[i];
    const slug = normalizeLabel(label).replace(/\s+/g,'-');
    const id = 'placeholder-' + band + '-' + i + '-' + slug;
    const svgPath = path.join(iconsDir, id + '.svg');
    // generate svg text by filling tokens and escaping label
    const svgText = tpl.replace(/__BGCOLOR__/g, palette.bg)
                       .replace(/__STROKE__/g, palette.stroke)
                       .replace(/__CHIPCOLOR__/g, palette.chip)
                       .replace(/__TEXTCOLOR__/g, palette.text)
                       .replace(/__STRIPE__/g, palette.stripe)
                       .replace(/__BANDLABEL__/g, band.replace('g','').replace('k2','K–2'))
                       .replace('PLACEHOLDER LABEL', escapeXml(label));
    fs.writeFileSync(svgPath, svgText, 'utf8');
    created.push(id);
  }
}

// If Sharp is available, produce webp/png rasters for a set of sizes and update manifest accordingly.
let sharpAvailable = false;
let sharp = null;
try{
  sharp = require('sharp');
  sharpAvailable = true;
}catch(e){ sharpAvailable = false; }

const sizes = [64,128,256,512,1024];
const manifest = {};

async function ensureRastersFor(id){
  const svgPath = path.join(iconsDir, id + '.svg');
  const entry = { webp: [], png: [] };
  if(!fs.existsSync(svgPath)) return entry;
  const buffer = fs.readFileSync(svgPath);
  for(const w of sizes){
    const outWebp = path.join(rasterDir, `${id}-${w}.webp`);
    const outPng = path.join(rasterDir, `${id}-${w}.png`);
    // skip if already exists
    if(!fs.existsSync(outWebp) && sharpAvailable){
      try{ await sharp(buffer).resize({ width: w }).webp({ quality: 80 }).toFile(outWebp); }catch(e){ /* ignore */ }
    }
    if(!fs.existsSync(outPng) && sharpAvailable){
      try{ await sharp(buffer).resize({ width: w }).png({ compressionLevel: 6 }).toFile(outPng); }catch(e){ /* ignore */ }
    }
    // prefer to reference raster files if they exist, otherwise omit
    if(fs.existsSync(outWebp)) entry.webp.push({ path: path.posix.join('assets','raster', `${id}-${w}.webp`), width: w });
    if(fs.existsSync(outPng)) entry.png.push({ path: path.posix.join('assets','raster', `${id}-${w}.png`), width: w });
  }
  // If no rasters were created and Sharp not available, keep svg fallback
  if(entry.webp.length === 0 && entry.png.length === 0){ entry.svg = `assets/icons/${id}.svg`; }
  return entry;
}

// backup previous manifest if present
const manifestPath = path.join(rasterDir, 'manifest.json');
if(fs.existsSync(manifestPath)){
  try{ fs.copyFileSync(manifestPath, manifestPath + '.bak'); }catch(e){}
}

(async()=>{
  for(const id of created){
    const e = await ensureRastersFor(id);
    manifest[id] = e;
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest,null,2), 'utf8');
  console.log('Created', created.length, 'placeholder SVGs (overwritten with new visuals).');
  if(sharpAvailable) console.log('Generated rasters for sizes:', sizes.join(','));
  else console.log('Sharp not available - manifest references SVGs only.');
})();

function escapeXml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}
