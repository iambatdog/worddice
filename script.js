// Embedded cartoon SVG icons and labels (refined artwork)
// The list has been trimmed to remove items that are not needed.
const ICONS = [
  { id: 'tree', label: 'tree' },
  { id: 'car', label: 'car' },
  { id: 'book', label: 'book' },
  { id: 'house', label: 'house' },
  { id: 'cat', label: 'cat' },

  // Refined icons
  { id: 'balloon', label: 'balloon' },
  { id: 'rocket', label: 'rocket' },
  { id: 'treasure-chest', label: 'treasure chest' },
  { id: 'pirate-ship', label: 'pirate ship' },
  { id: 'rainbow', label: 'rainbow' },
  { id: 'dragon', label: 'dragon' },
  { id: 'robot', label: 'robot' },
  { id: 'moon', label: 'moon' },
  { id: 'castle', label: 'castle' },
  { id: 'bicycle', label: 'bicycle' },
  { id: 'dinosaur', label: 'dinosaur' },
  { id: 'lighthouse', label: 'lighthouse' },
  { id: 'old-key', label: 'old key' },
  { id: 'magic-wand', label: 'magic wand' },
  { id: 'umbrella', label: 'umbrella' },
  { id: 'cookie', label: 'cookie' },
  { id: 'paintbrush', label: 'paintbrush' },
  { id: 'camera', label: 'camera' },
  { id: 'map', label: 'map' },
  { id: 'kite', label: 'kite' },
  { id: 'spaceship', label: 'spaceship' },
  { id: 'clock', label: 'clock' },
  { id: 'skateboard', label: 'skateboard' },
  { id: 'treasure-map', label: 'treasure map' },
  { id: 'bridge', label: 'bridge' },
  { id: 'owl', label: 'owl' },
  { id: 'seashell', label: 'seashell' },
  { id: 'snowman', label: 'snowman' },
  { id: 'violin', label: 'violin' }
];

// Prefer external SVG files in assets/icons/ when available: attach a src path to any icon missing one
ICONS.forEach(ic => {
  if(!ic.src && ic.id){
    ic.src = `assets/icons/${ic.id}.svg`;
  }
});

// floating standards button element reference (may be gated by lock state)
const floatingStandardsBtn = document.getElementById('floating-standards-btn');

// Ensure teacher/content standards buttons respond even if DOMContentLoaded fired earlier.
// This wiring is done immediately so the floating button reliably opens the standards panel.
// Floating standards button (bottom-right) opens a dedicated standards-only modal
const standardsModal = document.getElementById('standards-modal');
const standardsClose = document.getElementById('standards-close');
const standardsBackdrop = document.getElementById('standards-backdrop');
if(floatingStandardsBtn && standardsModal){
  floatingStandardsBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    standardsModal.hidden = false;
    // trap focus inside the standards modal
    setTimeout(()=>{ startFocusTrap(standardsModal); }, 60);
    // render the standards table and reset details
    renderStandardsTable();
    const det = document.getElementById('standards-detail'); if(det){ det.style.display='none'; det.textContent='Click a row to see details.'; det.setAttribute('tabindex','-1'); }
    // scroll the table into view
    const sec = standardsModal.querySelector('.modal-body'); if(sec) sec.scrollIntoView({behavior:'smooth', block:'center'});
  });
}
// close handlers for standards modal
if(standardsClose) standardsClose.addEventListener('click', (e)=>{ e.preventDefault(); if(standardsModal){ standardsModal.hidden = true; stopFocusTrap(); } });
if(standardsBackdrop) standardsBackdrop.addEventListener('click', ()=>{ if(standardsModal){ standardsModal.hidden = true; stopFocusTrap(); } });
// allow Esc to close standards modal
window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape'){ if(standardsModal && !standardsModal.hidden){ standardsModal.hidden = true; stopFocusTrap(); } } });

// Raster manifest (optional): load available raster outputs (webp/png) so the UI
// can prefer high-quality raster images when present. Expected structure:
// {
//   "tree": { "webp": [{"path":"assets/raster/1024/tree.webp","width":1024}, ...], "png": [...] },
//   ...
// }
let RASTER_MANIFEST = {};

// Band palettes used for runtime-composed placeholder wrappers. Keep in JS for logic but
// styling is applied via CSS classes (.band-*) so designers can override colors in styles.css
const BAND_PALETTES = {
  k2: { bg:'#fffaf0', stripe:'#ffd8b3', chip:'#ffe7d6', stroke:'#ffd8b3', text:'#333' },
  g35: { bg:'#f0fbff', stripe:'#bfefff', chip:'#dff6ff', stroke:'#bfefff', text:'#113344' },
  g68: { bg:'#fff7fb', stripe:'#ffd1f0', chip:'#ffe7f5', stroke:'#ffd1f0', text:'#3c1033' },
  g912: { bg:'#f3f7ff', stripe:'#cfe0ff', chip:'#e8f0ff', stroke:'#cfe0ff', text:'#102240' }
};
async function loadRasterManifest(){
  try{
    const res = await fetch('assets/raster/manifest.json', {cache: 'no-cache'});
    if(res.ok){
      RASTER_MANIFEST = await res.json();
    } else {
      RASTER_MANIFEST = {};
    }
  }catch(e){ RASTER_MANIFEST = {}; }
}

// Create a DOM node for an icon preference: use raster (picture) if manifest lists files,
// otherwise prefer icon.src (svg file) as an <img>, otherwise fallback to text label.
function createIconNode(icon, opts={}){
  // opts.size is a hint (not required) like 128/256; manifest should provide widths
  const id = icon && icon.id;
  const label = icon && icon.label ? icon.label : '';
  try{
    // If this is a synthetic placeholder, try to find a matching real icon and render it on a colored band background
    if(id && id.startsWith('placeholder-')){
      // determine band from id (placeholder-<band>-...)
      const bandMatch = id.match(/^placeholder-([a-z0-9]+)-/);
      const band = bandMatch ? bandMatch[1] : 'k2';
      const BAND_PALETTES = {
        k2: { bg:'#fffaf0', stripe:'#ffd8b3', chip:'#ffe7d6', stroke:'#ffd8b3', text:'#333' },
        g35: { bg:'#f0fbff', stripe:'#bfefff', chip:'#dff6ff', stroke:'#bfefff', text:'#113344' },
        g68: { bg:'#fff7fb', stripe:'#ffd1f0', chip:'#ffe7f5', stroke:'#ffd1f0', text:'#3c1033' },
        g912: { bg:'#f3f7ff', stripe:'#cfe0ff', chip:'#e8f0ff', stroke:'#cfe0ff', text:'#102240' }
      };
      const palette = BAND_PALETTES[band] || BAND_PALETTES.k2;
      // try exact label match first, then try token-level matching
      const key = normalizeLabel(label);
      let matchedId = ICON_LABEL_MAP[key];
      if(!matchedId){
        const parts = key.split(/\s+/).filter(Boolean);
        // try longer phrases first
        for(let len = parts.length; len>0 && !matchedId; len--){
          for(let i=0;i+len<=parts.length;i++){
            const phrase = parts.slice(i,i+len).join(' ');
            if(ICON_LABEL_MAP[phrase]){ matchedId = ICON_LABEL_MAP[phrase]; break; }
          }
        }
      }
      if(matchedId){
        const matchedEntry = RASTER_MANIFEST && RASTER_MANIFEST[matchedId];
          // build wrapper and assign band class for centralized styling
          const wrapper = document.createElement('div');
          wrapper.className = `placeholder-wrapper band-${band}`;
          // allow size hint to adjust CSS variables for width/height if provided
          if(opts.size){ wrapper.style.width = opts.size + 'px'; wrapper.style.height = opts.size + 'px'; }

        if(matchedEntry && (matchedEntry.webp || matchedEntry.png)){
          const pic = document.createElement('picture');
          if(matchedEntry.webp){
            const srcsetWebp = matchedEntry.webp.map(it=>`${it.path} ${it.width}w`).join(', ');
            const sWebp = document.createElement('source');
            sWebp.type = 'image/webp'; sWebp.srcset = srcsetWebp; pic.appendChild(sWebp);
          }
          if(matchedEntry.png){
            const srcsetPng = matchedEntry.png.map(it=>`${it.path} ${it.width}w`).join(', ');
            const sPng = document.createElement('source');
            sPng.type = 'image/png'; sPng.srcset = srcsetPng; pic.appendChild(sPng);
          }
          const img = document.createElement('img');
          // prefer png entry if present else webp first
          if(matchedEntry.png && matchedEntry.png.length) img.src = matchedEntry.png[matchedEntry.png.length-1].path;
          else if(matchedEntry.webp && matchedEntry.webp.length) img.src = matchedEntry.webp[matchedEntry.webp.length-1].path;
          img.alt = label; img.loading='lazy'; img.decoding='async'; img.style.width='80%'; img.style.height='80%'; img.style.objectFit='contain';
          pic.appendChild(img);
          wrapper.appendChild(pic);
          return wrapper;
        } else {
          // fallback to existing svg file for matched id
          const matchedIcon = ICONS.find(ic=>ic.id === matchedId);
          if(matchedIcon && matchedIcon.src){
            const img = document.createElement('img');
            img.src = matchedIcon.src; img.alt = matchedIcon.label; img.loading='lazy'; img.decoding='async';
            img.style.width='80%'; img.style.height='80%'; img.style.objectFit='contain';
            wrapper.appendChild(img);
            return wrapper;
          }
        }
      }
      // if no match found, fall back to using any raster entry directly for this placeholder id
      const entry = id && RASTER_MANIFEST && RASTER_MANIFEST[id];
      if(entry && (entry.webp || entry.png)){
        const picture = document.createElement('picture');
        if(entry.webp){ const srcsetWebp = entry.webp.map(it=>`${it.path} ${it.width}w`).join(', '); const sWebp = document.createElement('source'); sWebp.type='image/webp'; sWebp.srcset = srcsetWebp; picture.appendChild(sWebp); }
        if(entry.png){ const srcsetPng = entry.png.map(it=>`${it.path} ${it.width}w`).join(', '); const sPng = document.createElement('source'); sPng.type='image/png'; sPng.srcset = srcsetPng; picture.appendChild(sPng); }
        const img = document.createElement('img'); if(entry.png && entry.png.length) img.src = entry.png[0].path; else if(entry.webp && entry.webp.length) img.src = entry.webp[0].path; img.alt = label; img.loading='lazy'; img.decoding='async'; return picture;
      }
      // otherwise fall through to render label-only placeholder below
    }
    const entry = id && RASTER_MANIFEST && RASTER_MANIFEST[id];
    if(entry && (entry.webp || entry.png)){
      const picture = document.createElement('picture');
      if(entry.webp){
        const srcsetWebp = entry.webp.map(it=>`${it.path} ${it.width}w`).join(', ');
        const sWebp = document.createElement('source');
        sWebp.type = 'image/webp';
        sWebp.srcset = srcsetWebp;
        picture.appendChild(sWebp);
      }
      if(entry.png){
        const srcsetPng = entry.png.map(it=>`${it.path} ${it.width}w`).join(', ');
        const sPng = document.createElement('source');
        sPng.type = 'image/png';
        sPng.srcset = srcsetPng;
        picture.appendChild(sPng);
      }
      const img = document.createElement('img');
      // prefer a png fallback if present, else webp first entry
      if(entry.png && entry.png.length) img.src = entry.png[0].path;
      else if(entry.webp && entry.webp.length) img.src = entry.webp[0].path;
      img.alt = label;
      img.loading = 'lazy';
      img.decoding = 'async';
      picture.appendChild(img);
      return picture;
    }
  }catch(e){ /* ignore and fall back */ }

  // Fallback to SVG/IMG if available
  if(icon && icon.src){
    const img = document.createElement('img');
    img.src = icon.src;
    img.alt = label;
    img.loading = 'lazy';
    img.decoding = 'async';
    return img;
  }

  const span = document.createElement('span');
  span.textContent = label || '';
  return span;
}

const diceArea = document.getElementById('dice-area');
let layoutToggle = document.getElementById('layout-toggle');
const diceCountEl = document.getElementById('dice-count');
const rollBtn = document.getElementById('roll-btn');
// newPrompt button removed; reuse rollBtn for both initial roll and rerolls
let hasRolled = false;
const promptText = document.getElementById('prompt-text');
let prevDiceCount = Number(diceCountEl.value);

// helper: pick random element
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

// Default safe objects (ids) — editable by the teacher/parent in the UI
// add 20 more items: kite, spaceship, waterfall, magician, cloud-city, clock, skateboard,
// bakery, puppet, treasure-map, magician-hat, bridge, owl, lantern, robot-dog,
// seashell, snowman, violin, garden-gate, postage-stamp
const DEFAULT_SAFE_OBJECTS = ['tree','car','book','house','cat','balloon','rocket','treasure-chest','pirate-ship','rainbow','dragon','robot','moon','castle','bicycle','dinosaur','lighthouse','old-key','magic-wand','umbrella','cookie','paintbrush','camera','map',
  'kite','spaceship','clock','skateboard','treasure-map','bridge','owl','seashell','snowman','violin'];

// Load saved safe objects from localStorage or fall back to default
function loadSafeObjects(){
  try{
    const raw = localStorage.getItem('wd_safe_objects');
    if(!raw) return DEFAULT_SAFE_OBJECTS.slice();
    const parsed = JSON.parse(raw);
    if(Array.isArray(parsed) && parsed.length>0) return parsed;
  }catch(e){ /* ignore and fallback */ }
  return DEFAULT_SAFE_OBJECTS.slice();
}

function saveSafeObjects(list){
  try{ localStorage.setItem('wd_safe_objects', JSON.stringify(list)); }catch(e){/* ignore */}
}

let SAFE_OBJECTS = loadSafeObjects();
// sanitize saved safe objects to remove ids that no longer exist in ICONS
SAFE_OBJECTS = SAFE_OBJECTS.filter(id => ICONS.some(ic => ic.id === id));
let SAFE_ICONS = ICONS.filter(ic => SAFE_OBJECTS.includes(ic.id));

// Grade band persistence key
const LS_GRADE_BAND = 'wd_grade_band';

// Standards mapping data
const STANDARDS_DATA = [
  { band: 'K–2', id: 'k2', focus: 'Simple, concrete nouns', standard: 'W.K.3 – W.2.3', skills: 'Sequencing, describing, beginning–middle–end', details: `Grades K–2 (Simple & Familiar)\n\nPrompt Set: cat, dog, tree, rainbow, bike, cake, etc.\n\nRelevant Standards:\nCCSS.ELA-LITERACY.W.K.3 / W.1.3 / W.2.3: Use a combination of drawing, dictating, and writing to narrate a single event or several events, tell about the events in order, and provide a reaction.\n\nHow prompts help:\nSimple, concrete nouns help students focus on describing familiar objects. Prompts allow for short sequential stories and support story structure: beginning–middle–end.`},
  { band: '3–5', id: 'g35', focus: 'Fantasy & adventure objects/settings', standard: 'W.3.3 – W.5.3', skills: 'Dialogue, transitions, problem/solution', details: `Grades 3–5 (Imaginative Adventure)\n\nPrompt Set: dragon, castle, map, spaceship, magic potion, key, volcano, etc.\n\nRelevant Standards:\nCCSS.ELA-LITERACY.W.3.3 – W.5.3: Write narratives to develop real or imagined experiences using descriptive details, clear event sequences, and dialogue.\n\nHow prompts help:\nFantasy/sci-fi objects encourage creative invention and push students toward problem + solution; great for practicing transitions.`},
  { band: '6–8', id: 'g68', focus: 'Mystery & conflict imagery', standard: 'W.6.3 – W.8.3', skills: 'Pacing, sensory detail, suspense, “show don’t tell”', details: `Grades 6–8 (Mystery & Conflict)\n\nPrompt Set: torn photograph, locked door, footprints, candle, broken bridge, hidden passageway, storm at sea, etc.\n\nRelevant Standards:\nCCSS.ELA-LITERACY.W.6.3 – W.8.3: Write narratives with effective technique, relevant descriptive details, and well-structured event sequences.\n\nHow prompts help:\n“Mystery” imagery encourages conflict and suspense; students practice pacing and use sensory language to capture action.`},
  { band: '9–12', id: 'g912', focus: 'Symbolic & atmospheric prompts', standard: 'W.9-10.3 – W.11-12.3', skills: 'Thematic depth, point of view, reflection, symbolism', details: `Grades 9–12 (Symbolic & Atmospheric)\n\nPrompt Set: crashed spaceship with tracks, abandoned carnival, cathedral ruins, portal in the sky, torn flag, glowing artifact, etc.\n\nRelevant Standards:\nCCSS.ELA-LITERACY.W.9-10.3 / W.11-12.3: Write narratives to develop real or imagined experiences with well-chosen details, structured event sequences, and reflection.\n\nHow prompts help:\nSymbolic/atmospheric images encourage interpretation and theme; prompts foster genre exploration and reflective or symbolic endings.`}
];

function renderStandardsTable(){
  const container = document.getElementById('standards-table-container');
  if(!container) return;
  container.innerHTML = '';
  const table = document.createElement('table');
  table.className = 'standards-table';
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Grade Band</th><th>Prompt Focus</th><th>Writing Standard Focus</th><th>Skills Developed</th></tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  STANDARDS_DATA.forEach(row => {
    const tr = document.createElement('tr');
    tr.dataset.id = row.id;
    tr.innerHTML = `<td><strong>${row.band}</strong></td><td>${row.focus}</td><td>${row.standard}</td><td>${row.skills}</td>`;
    tr.addEventListener('click', ()=>{
      const detail = document.getElementById('standards-detail');
      if(detail){ detail.textContent = row.details; detail.style.display = 'block'; detail.focus && detail.focus(); }
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
}


// Grade presets mapping: provided example labels mapped to icon ids when available in ICONS.
// The presets below are the user's example lists; we'll match by label (case-insensitive, ignoring punctuation)
const GRADE_PRESETS_RAW = {
  k2: [
    'Cat','Dog','Bird','Fish','Tree','Flower','Sun','Moon','Rainbow','Ball','Kite','Bike','House','School bus','Book','Birthday cake','Ice cream cone','Teddy bear','Swing set','Slide','Train','Boat','Airplane','Firetruck','Farm','Cow','Horse','Duck','Shoe','Star'
  ],
  g35: [
    'Dragon','Castle','Treasure chest','Pirate ship','Volcano','Cave','Wizard hat','Magic wand','Map with X','Robot','Spaceship','Alien','Knight','Princess','Crown','Giant','Witch’s broom','Potion bottle','Lighthouse','Bridge','Storm cloud','Tent','Compass','Locked treasure box','Sword','Ice mountain','Desert with cactus','Timepiece','Key','Talking animal'
  ],
  g68: [
    'Torn photograph','Trail of footprints','Broken sword','Flickering candle','Locked door','Mask','Dark forest','Shadowy figure','Cracked mirror','Storm at sea','Empty chair','Secret letter','Rope ladder','Strange symbol on wall','Abandoned house','Old key','Robot arm','Spacesuit helmet','Hidden passageway','Mysterious box','Hourglass with sand running out','Shipwreck','Rusted gate','Lantern','Spiderweb','Faded map','Broken bridge','Strange footprints in snow','Black cat watching','Discarded glove'
  ],
  g912: [
    'Crashed spaceship with tracks leading away','Train disappearing into fog','Abandoned carnival ride','Cathedral ruins with vines','Ancient book glowing faintly','Lighthouse beam cutting through storm','Empty theater stage','Clock tower at midnight','Shadow of a person but no one there','Deserted city street at night','Statue missing its head','Blood-red moon','Frozen lake with cracks forming','Bridge leading to nowhere','Old photograph half burned','Chessboard mid-game','Mask cracked in half','Broken stained-glass window','Crows circling a barren tree','Abandoned school hallway','Spiral staircase vanishing into darkness','Suitcase left in the middle of a road','Overgrown garden with forgotten fountain','Torn flag waving','Key glowing faintly in the dark','Candle flickering in a cavern','Giant shadow cast on a wall','Portal opening in the sky','Ship stranded on dry land','Writing on a wall that no one understands'
  ]
};

// Utility: normalize a label to match against ICONS labels/ids
function normalizeLabel(s){
  return String(s || '').toLowerCase().replace(/[’'".,:()]/g,'').replace(/\s+/g,' ').trim();
}

// Build a map from normalized label -> icon id for quick matching
const ICON_LABEL_MAP = {};
ICONS.forEach(ic=>{ ICON_LABEL_MAP[normalizeLabel(ic.label)] = ic.id; ICON_LABEL_MAP[normalizeLabel(ic.id)] = ic.id; });

// Build a preset (array of icon ids) for a given band by matching available ICONS
function buildPresetForBand(band){
  const raw = GRADE_PRESETS_RAW[band] || [];
  const ids = [];
  raw.forEach(item => {
    const key = normalizeLabel(item.replace(/with x/ig,'with x').replace(/’/g, "'"));
    const matched = ICON_LABEL_MAP[key];
    if(matched && !ids.includes(matched)) ids.push(matched);
  });
  // If preset is empty, fallback to DEFAULT_SAFE_OBJECTS subset
  if(ids.length === 0) return DEFAULT_SAFE_OBJECTS.slice(0, Math.min(20, ICONS.length));
  return ids;
}

// Build preset but also return unmatched labels so UI can offer placeholders
function buildPresetWithUnmatched(band){
  const raw = GRADE_PRESETS_RAW[band] || [];
  const ids = [];
  const unmatched = [];
  raw.forEach(item => {
    const key = normalizeLabel(item.replace(/with x/ig,'with x').replace(/’/g, "'"));
    const matched = ICON_LABEL_MAP[key];
    if(matched && !ids.includes(matched)) ids.push(matched);
    else unmatched.push(item);
  });
  return { ids, unmatched };
}

// Apply preset into SAFE_OBJECTS (respecting lock if set)
function applyGradePreset(band){
  if(isLocked()){
    if(pinMsgModal) pinMsgModal.textContent = 'Unlock to change grade presets.';
    return false;
  }
  let { ids, unmatched } = buildPresetWithUnmatched(band);
  // if nothing matched, fall back to a reasonable default to avoid clearing the safe list
  if(!ids || ids.length === 0){
    ids = buildPresetForBand(band);
    // recalc unmatched as everything not matched
    const matchedSet = new Set(ids);
    unmatched = (GRADE_PRESETS_RAW[band] || []).filter(it=>{
      const key = normalizeLabel(it.replace(/’/g, "'"));
      const m = ICON_LABEL_MAP[key];
      return !m || !matchedSet.has(m);
    });
  }
  SAFE_OBJECTS = ids.slice();
  SAFE_ICONS = ICONS.filter(ic => SAFE_OBJECTS.includes(ic.id));
  saveSafeObjects(SAFE_OBJECTS);
  try{ localStorage.setItem(LS_GRADE_BAND, band); }catch(e){}
  renderSafeListUI();
  checkRepeatWarning();
  // Provide clearer feedback in the modal note area as well as the pin message
  const note = document.getElementById('grade-preset-note');
  if(note){
    if(ids.length === 0) note.textContent = 'No icons matched; default selection applied.';
    else note.textContent = `Grade preset applied. ${unmatched.length?unmatched.length+' unmatched items omitted.' : 'All matched.'}`;
    note.style.display = 'block';
    setTimeout(()=>{ note.style.display = 'none'; }, 6000);
  }
  if(pinMsgModal) pinMsgModal.textContent = `Grade preset applied. ${unmatched.length?unmatched.length+' unmatched items omitted.' : ''}`;
  return true;
}

// Preview preset without applying (shows a short note with matched labels)
function previewGradePreset(band){
  const { ids, unmatched } = buildPresetWithUnmatched(band);
  const labels = ids.map(id => (ICONS.find(ic=>ic.id===id)||{label:id}).label);
  const note = document.getElementById('grade-preset-note');
  if(note){
    if(labels.length === 0) { note.textContent = 'No matching icons found for this grade band.'; }
    else note.textContent = 'Preset includes: ' + labels.slice(0,12).join(', ') + (labels.length > 12 ? '...' : '');
    if(unmatched && unmatched.length) note.textContent += ` (${unmatched.length} items will need icons)`;
    note.style.display = 'block';
    setTimeout(()=>{ note.style.display = 'none'; }, 6000);
  }
}

// Apply preset but create placeholder ICON entries for unmatched labels so they render as text
function applyGradePresetWithPlaceholders(band){
  if(isLocked()){
    if(pinMsgModal) pinMsgModal.textContent = 'Unlock to change grade presets.';
    return false;
  }
  const { ids, unmatched } = buildPresetWithUnmatched(band);
  const placeholderIds = [];
  unmatched.forEach((label, idx)=>{
    // create a synthetic id that's unlikely to collide
    const pid = `placeholder-${band}-${idx}-${normalizeLabel(label).replace(/\s+/g,'-')}`;
    // add to ICONS and maps so rendering can use label-only entries
    const obj = { id: pid, label: label };
    ICONS.push(obj);
    ICON_LABEL_MAP[normalizeLabel(label)] = pid;
    ICON_LABEL_MAP[normalizeLabel(pid)] = pid;
    placeholderIds.push(pid);
  });
  // final safe objects = matched ids + placeholders
  SAFE_OBJECTS = ids.concat(placeholderIds);
  SAFE_ICONS = ICONS.filter(ic => SAFE_OBJECTS.includes(ic.id));
  saveSafeObjects(SAFE_OBJECTS);
  try{ localStorage.setItem(LS_GRADE_BAND, band); }catch(e){}
  renderSafeListUI();
  checkRepeatWarning();
  if(pinMsgModal) pinMsgModal.textContent = `Grade preset applied with ${placeholderIds.length} placeholders.`;
  return true;
}

// persisted state keys
const LS_KEPT = 'wd_kept_indices';
const LS_LAST_PICKS = 'wd_last_picks';
const LS_HAS_ROLLED = 'wd_has_rolled';

// UI: render safe-list checkboxes
let safeListContainer = document.getElementById('safe-list');
let safePanel = document.getElementById('safe-list-panel');
// modal-based safe list and controls (will reuse same logic)
const safeListModalContainer = document.getElementById('safe-list-modal');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const settingsClose = document.getElementById('settings-close');
const settingsBackdrop = document.getElementById('settings-backdrop');
const layoutToggleModal = document.getElementById('layout-toggle-modal');
// modal PIN elements
const pinInputModal = document.getElementById('pin-input-modal');
const setPinBtnModal = document.getElementById('set-pin-btn-modal');
const lockBtnModal = document.getElementById('lock-btn-modal');
const unlockBtnModal = document.getElementById('unlock-btn-modal');
const pinMsgModal = document.getElementById('pin-msg-modal');
// PIN UI elements
let pinInput = document.getElementById('pin-input');
let setPinBtn = document.getElementById('set-pin-btn');
let lockBtn = document.getElementById('lock-btn');
let unlockBtn = document.getElementById('unlock-btn');
let pinMsg = document.getElementById('pin-msg');

// Focus trap state
let _focusTrapPrev = null;
let _focusTrapHandler = null;
let _inertModified = [];

function startFocusTrap(modal){
  try{
    _focusTrapPrev = document.activeElement;
    const focusable = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const nodes = Array.from(modal.querySelectorAll(focusable)).filter(n=>n.offsetParent !== null);
    if(nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length-1];
    _focusTrapHandler = function(e){
      if(e.key !== 'Tab') return;
      // manage forward/backward tabbing
      if(e.shiftKey){
        if(document.activeElement === first){ e.preventDefault(); last.focus(); }
      } else {
        if(document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', _focusTrapHandler, true);
    // also ensure focus stays inside on focusin
    document.addEventListener('focusin', _focusInEnforcer, true);
    // hide background from assistive tech and make inert if supported
    try{
      // apply to top-level siblings except any that are (or contain) the modal so we don't inert the modal itself
      const bodyChildren = Array.from(document.body.children);
      _inertModified = [];
      bodyChildren.forEach(el => {
        if(el === modal || el.contains(modal)) return;
        const prev = { el, prevAria: el.hasAttribute('aria-hidden') ? el.getAttribute('aria-hidden') : null };
        // store previous inert if supported
        if('inert' in HTMLElement.prototype) prev.prevInert = el.inert;
        _inertModified.push(prev);
        el.setAttribute('aria-hidden', 'true');
        if('inert' in HTMLElement.prototype) el.inert = true;
      });
    }catch(e){}
  }catch(e){ /* ignore */ }
}

function _focusInEnforcer(e){
  // find any visible modal (settings or standards)
  const modal = document.querySelector('.modal:not([hidden])');
  if(!modal) return;
  if(!modal.contains(e.target)){
    // move focus to the first focusable inside
    const focusable = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const nodes = Array.from(modal.querySelectorAll(focusable)).filter(n=>n.offsetParent !== null);
    if(nodes.length) nodes[0].focus();
  }
}

function stopFocusTrap(){
  try{
    if(_focusTrapHandler) document.removeEventListener('keydown', _focusTrapHandler, true);
    document.removeEventListener('focusin', _focusInEnforcer, true);
    if(_focusTrapPrev && _focusTrapPrev.focus) _focusTrapPrev.focus();
    _focusTrapPrev = null;
    _focusTrapHandler = null;
    // restore background accessibility
    try{
      _inertModified.forEach(item => {
        try{
          if(item.prevAria === null) item.el.removeAttribute('aria-hidden'); else item.el.setAttribute('aria-hidden', item.prevAria);
          if('prevInert' in item && 'inert' in HTMLElement.prototype) item.el.inert = !!item.prevInert;
        }catch(e){}
      });
      _inertModified = [];
    }catch(e){}
  }catch(e){}
}

// localStorage keys
const LS_PIN_HASH = 'wd_pin_hash';
const LS_LOCKED = 'wd_locked';

// crypto helper: SHA-256 hex
async function sha256Hex(str){
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join('');
}

function isLocked(){
  return localStorage.getItem(LS_LOCKED) === '1';
}

function setLocked(val){
  localStorage.setItem(LS_LOCKED, val ? '1' : '0');
}

// Accept an optional `inputValue` so callers can pass a value directly (modal or inline)
async function checkPinAndUnlock(inputValue){
  const input = (typeof inputValue === 'string' ? inputValue : (pinInput && pinInput.value) || '').trim();
  if(!input){ if(pinMsg) pinMsg.textContent = 'Enter a PIN to unlock.'; return false; }
  const stored = localStorage.getItem(LS_PIN_HASH);
  if(!stored){ if(pinMsg) pinMsg.textContent = 'No PIN set. Use Set PIN to create one.'; return false; }
  const h = await sha256Hex(input);
  if(h === stored){ setLocked(false); updatePinUI(); if(pinMsg) pinMsg.textContent = 'Unlocked.'; return true; }
  if(pinMsg) pinMsg.textContent = 'Incorrect PIN.'; return false;
}

// Accept optional `inputValue` so modal handlers can pass the modal input directly
async function setPin(inputValue){
  const input = (typeof inputValue === 'string' ? inputValue : (pinInput && pinInput.value) || '').trim();
  if(!input){ if(pinMsg) pinMsg.textContent = 'Enter a PIN to set.'; return; }
  const h = await sha256Hex(input);
  localStorage.setItem(LS_PIN_HASH, h);
  setLocked(true);
  updatePinUI();
  if(pinMsg) pinMsg.textContent = 'PIN set and panel locked.';
}

function updatePinUI(){
  const locked = isLocked();
  // disable checkboxes when locked (apply to both primary and modal lists)
  Array.from(document.querySelectorAll('#safe-list input, #safe-list-modal input')).forEach(i=>i.disabled = locked);
  // primary buttons
  if(lockBtn) lockBtn.style.display = locked ? 'none' : '';
  if(unlockBtn) unlockBtn.style.display = locked ? '' : 'none';
  // modal buttons (if present)
  if(lockBtnModal) lockBtnModal.style.display = locked ? 'none' : '';
  if(unlockBtnModal) unlockBtnModal.style.display = locked ? '' : 'none';

  // also update floating standards button visibility depending on lock state
  try{ updateFloatingStandardsVisibility(); }catch(e){}
}

// Show the floating standards button only when the session is unlocked (teacher present).
function updateFloatingStandardsVisibility(){
  try{
    if(!floatingStandardsBtn) return;
    if(isLocked()){
      floatingStandardsBtn.style.display = 'none';
      floatingStandardsBtn.setAttribute('aria-hidden','true');
    } else {
      floatingStandardsBtn.style.display = '';
      floatingStandardsBtn.removeAttribute('aria-hidden');
    }
  }catch(e){}
}

// Show/hide teacher standards section when settings modal opens
function showTeacherStandardsSection(show){
  const sec = document.getElementById('teacher-standards-section');
  const btn = document.getElementById('teacher-icon');
  if(!sec) return;
  sec.style.display = show ? 'block' : 'none';
  if(btn) btn.style.display = show ? 'inline-flex' : 'none';
}

// Hook into modal open to render standards table lazily
document.addEventListener('DOMContentLoaded', ()=>{
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  if(settingsBtn && settingsModal){
    settingsBtn.addEventListener('click', ()=>{
      // when modal opens, keep teacher section hidden until the teacher button is clicked
      showTeacherStandardsSection(false);
      // clear detail area
      const detail = document.getElementById('standards-detail');
      if(detail){ detail.style.display='none'; detail.textContent='Click the teacher icon to view standards.'; }
    });
  }
});

function renderSafeListUI(){
  // Determine the primary container to render into: prefer the inline safe list if present,
  // otherwise render directly into the modal container.
  const primary = safeListContainer || safeListModalContainer;
  if(!primary) return;
  primary.innerHTML = '';
  // clear modal container only if it's separate from primary
  if(safeListModalContainer && safeListModalContainer !== primary) safeListModalContainer.innerHTML = '';
  ICONS.forEach(icon => {
    const id = icon.id;
    const wrapper = document.createElement('label');
    wrapper.className = 'safe-item';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.dataset.id = id;
    if(SAFE_OBJECTS.includes(id)) cb.checked = true;
    const previewNode = createIconNode(icon);
    const span = document.createElement('span');
    span.textContent = icon.label;
    cb.addEventListener('change', ()=>{
      const checked = Array.from(primary.querySelectorAll('input:checked')).map(i=>i.dataset.id);
      SAFE_OBJECTS = checked.length ? checked : DEFAULT_SAFE_OBJECTS.slice();
      SAFE_ICONS = ICONS.filter(ic => SAFE_OBJECTS.includes(ic.id));
      saveSafeObjects(SAFE_OBJECTS);
      checkRepeatWarning();
    });
    wrapper.appendChild(cb);
    wrapper.appendChild(previewNode);
    wrapper.appendChild(span);
    primary.appendChild(wrapper);
    // Also clone into modal list if present and different from primary (clone node to keep listeners separate)
    if(safeListModalContainer && safeListModalContainer !== primary){
      const clone = wrapper.cloneNode(true);
      // sync change events: when modal checkbox changes, trigger the main handler by dispatching a change on the matching primary checkbox
      const modalCb = clone.querySelector('input');
      modalCb.addEventListener('change', ()=>{
        const mainCb = primary.querySelector(`input[data-id="${modalCb.dataset.id}"]`);
        if(mainCb){ mainCb.checked = modalCb.checked; mainCb.dispatchEvent(new Event('change', {bubbles:true})); }
      });
      safeListModalContainer.appendChild(clone);
    }
  });
}

// show/hide a repeat warning near the prompt if user selected more dice than unique allowed
function checkRepeatWarning(){
  const promptEl = document.getElementById('prompt');
  // remove existing note
  const old = document.getElementById('repeat-note');
  if(old) old.remove();
  const diceCount = Number(diceCountEl.value);
  if(diceCount > SAFE_ICONS.length){
    const note = document.createElement('p');
    note.id = 'repeat-note';
    note.className = 'note';
    note.textContent = 'Note: you have selected more dice than allowed unique images; some images may repeat.';
    promptEl.appendChild(note);
  }
}

// initialize: load optional raster manifest then render UI so raster images are used when available
async function init(){
  await loadRasterManifest();
  // After manifest load we should re-create SAFE_ICONS from current SAFE_OBJECTS (in case sanitization relied on manifest)
  SAFE_ICONS = ICONS.filter(ic => SAFE_OBJECTS.includes(ic.id));
  // re-resolve DOM elements that may have been removed from the main page and fall back to modal equivalents
  safeListContainer = safeListContainer || document.getElementById('safe-list');
  safePanel = safePanel || document.getElementById('safe-list-panel');
  layoutToggle = layoutToggle || document.getElementById('layout-toggle');
  // If primary (inline) PIN controls are not present, fall back to modal controls so handlers work.
  pinInput = pinInput || document.getElementById('pin-input') || pinInputModal || document.getElementById('pin-input-modal');
  setPinBtn = setPinBtn || document.getElementById('set-pin-btn') || setPinBtnModal || document.getElementById('set-pin-btn-modal');
  lockBtn = lockBtn || document.getElementById('lock-btn') || lockBtnModal || document.getElementById('lock-btn-modal');
  unlockBtn = unlockBtn || document.getElementById('unlock-btn') || unlockBtnModal || document.getElementById('unlock-btn-modal');
  pinMsg = pinMsg || document.getElementById('pin-msg') || pinMsgModal || document.getElementById('pin-msg-modal');

  renderSafeListUI();
  checkRepeatWarning();
  // apply saved layout preference (optional horizontal layout)
  try{
    const val = localStorage.getItem('wd_layout_horizontal');
    if(val === '1'){
      diceArea.classList.add('horizontal');
      if(layoutToggle) layoutToggle.checked = true;
    }
  }catch(e){}
  renderDiceSlots(Number(diceCountEl.value));
  updatePinUI();
  // ensure floating standards button visibility matches current lock state
  try{ updateFloatingStandardsVisibility(); }catch(e){}
  // restore previous roll/kept state if present
  restoreLastRoll();

  // wire grade band controls (if present)
  try{
    const gradeSelect = document.getElementById('grade-band-select');
    const applyBtn = document.getElementById('apply-grade-preset');
    const previewBtn = document.getElementById('preview-grade-preset');
    const applyPlaceBtn = document.getElementById('apply-grade-preset-placeholders');
    // restore selection
    const savedBand = localStorage.getItem(LS_GRADE_BAND);
    if(gradeSelect && savedBand) gradeSelect.value = savedBand;
  if(applyBtn && gradeSelect){ applyBtn.addEventListener('click', ()=>{ applyGradePreset(gradeSelect.value); const note = document.getElementById('grade-preset-note'); if(note){ note.textContent = 'Applying grade preset...'; note.style.display = 'block'; setTimeout(()=>{ note.style.display = 'none'; }, 2000); } }); }
    if(applyPlaceBtn && gradeSelect){ applyPlaceBtn.addEventListener('click', ()=>{ applyGradePresetWithPlaceholders(gradeSelect.value); }); }
    if(previewBtn && gradeSelect){ previewBtn.addEventListener('click', ()=>{ previewGradePreset(gradeSelect.value); }); }
  }catch(e){}
}

// start
init();

// pickUniqueIcons: pick `n` icons without repeats when possible.
// If n > SAFE_ICONS.length then repeats will be allowed but we still try to spread picks.
function pickUniqueIcons(n){
  const available = SAFE_ICONS.slice();
  const picks = [];
  // if we need more picks than unique icons, we'll first take all unique then allow repeats
  const needRepeats = n > available.length;

  // shuffle a copy of available
  for(let i=available.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [available[i], available[j]] = [available[j], available[i]];
  }

  // take up to n or available.length
  for(let i=0;i<Math.min(n, available.length); i++) picks.push(available[i]);

  // if still need more, add random picks (may repeat)
  while(picks.length < n){
    picks.push(rand(SAFE_ICONS));
  }

  // final shuffle so positions are random
  for(let i=picks.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [picks[i], picks[j]] = [picks[j], picks[i]];
  }
  return picks;
}

// create dice slots based on selection
// determine preferred number of rows based on viewport width
function preferredRows(){
  const w = window.innerWidth;
  if(w >= 1100) return 3; // wide screens: 3 rows
  if(w <= 520) return 1; // small screens: 1 row
  return 2; // default: 2 rows
}

function renderDiceSlots(count){
  // clamp between 2 and 8
  count = Math.max(2, Math.min(8, Number(count)));
  diceArea.innerHTML = '';

  // set grid density class for styling
  diceArea.classList.remove('small','medium','large');
  if(count <= 3) diceArea.classList.add('small');
  else if(count <= 5) diceArea.classList.add('medium');
  else diceArea.classList.add('large');

  // compute columns based on preferred rows so layout adapts: cols = ceil(count / rows)
  // If horizontal class is applied, force a single row so items lay out left-to-right
  const rows = diceArea.classList.contains('horizontal') ? 1 : preferredRows();
  const cols = Math.ceil(count / rows);
  diceArea.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  for(let i=0;i<count;i++){
    const die = document.createElement('div');
    die.className = 'die';
    die.setAttribute('tabindex', '0');
  die.setAttribute('role', 'button');
  die.setAttribute('aria-pressed', 'false');
    die.setAttribute('aria-label', 'dice slot');
    // restore kept state from stored data if available
    try{
      const storedKept = JSON.parse(localStorage.getItem('wd_kept_indices') || '[]');
      if(storedKept.includes(i)){
        die.classList.add('kept');
        die.setAttribute('aria-pressed', 'true');
      }
    }catch(e){}
  // show a blank placeholder (don't default to the first icon)
  const placeholderNode = document.createElement('div');
  placeholderNode.className = 'placeholder empty';
  placeholderNode.setAttribute('aria-hidden', 'true');
    const face = document.createElement('div');
    face.className = 'face';
    face.dataset.index = String(i);
    face.appendChild(placeholderNode);
    die.appendChild(face);
    diceArea.appendChild(die);
  }
}

// After an initial roll, save the choices and show helper
function persistLastRoll(){
  try{
    const picks = Array.from(document.querySelectorAll('.face')).map(f=>f.dataset.choice||null);
    localStorage.setItem(LS_LAST_PICKS, JSON.stringify(picks));
    localStorage.setItem(LS_HAS_ROLLED, '1');
  }catch(e){}
}

function saveKeptIndices(){
  try{
    // store kept by icon id (more robust across dice count changes)
    const keptIds = Array.from(document.querySelectorAll('.die.kept')).map(d=>{
      const face = d.querySelector('.face');
      return face && face.dataset.choice ? face.dataset.choice : null;
    }).filter(Boolean);
    localStorage.setItem(LS_KEPT, JSON.stringify(keptIds));
  }catch(e){}
}

function restoreLastRoll(){
  try{
    const raw = localStorage.getItem(LS_LAST_PICKS);
    if(!raw) return;
    const picks = JSON.parse(raw);
    if(!Array.isArray(picks)) return;
    // ensure dice slots match picks length
    const dice = Array.from(document.querySelectorAll('.face'));
    if(dice.length !== picks.length) return;
    dice.forEach((face, idx)=>{
      const id = picks[idx];
      if(!id) return;
      const icon = ICONS.find(ic=>ic.id===id) || rand(SAFE_ICONS);
      face.innerHTML = '';
      const node = createIconNode(icon);
      face.appendChild(node);
      face.setAttribute('aria-label', icon.label);
      face.dataset.choice = icon.id;
    });
    // restore kept by id
    const keptRaw = localStorage.getItem(LS_KEPT);
    if(keptRaw){
      const keptIds = JSON.parse(keptRaw) || [];
      Array.from(document.querySelectorAll('.die')).forEach(die => {
        const face = die.querySelector('.face');
        const id = face && face.dataset.choice;
        if(id && keptIds.includes(id)){
          die.classList.add('kept');
          die.setAttribute('aria-pressed','true');
        }
      });
    }
    // mark hasRolled and update UI
    const h = localStorage.getItem(LS_HAS_ROLLED);
    if(h === '1'){
      hasRolled = true;
      rollBtn.textContent = 'Reroll Dice';
      rollBtn.classList.add('reroll');
      // show helper briefly
      const helper = document.getElementById('roll-helper');
      if(helper){ helper.textContent = 'Tip: click a die to keep it before rerolling.'; helper.hidden = false; setTimeout(()=>helper.hidden=true, 6000); }
    }
  }catch(e){}
}

// roll animation and result
function rollDice(){
  const dice = Array.from(document.querySelectorAll('.die'));
  const count = dice.length;
  dice.forEach(die => die.classList.add('spin'));

  // pick icons trying to avoid duplicates
  const picks = pickUniqueIcons(count);

  // After animation ends, set to chosen icons
  setTimeout(()=>{
    dice.forEach((die, idx)=>{
      die.classList.remove('spin');
      const icon = picks[idx] || rand(SAFE_ICONS);
      const face = die.querySelector('.face');
      // render icon node (prefers raster via manifest, falls back to svg or text)
      face.innerHTML = '';
      const node = createIconNode(icon);
      face.appendChild(node);
      face.setAttribute('aria-label', icon.label);
      face.dataset.choice = icon.id;
    });
    generatePrompt();
  // persist this roll
  try{ persistLastRoll(); }catch(e){}
  }, 700);
}

function generatePrompt(){
  // Only include faces that have a chosen icon id
  const chosen = Array.from(document.querySelectorAll('.face'))
    .map(f => f.dataset.choice)
    .filter(Boolean);
  if(chosen.length === 0){
    promptText.textContent = 'Roll the dice to get a new writing prompt.';
    return;
  }
  // Build a friendly prompt
  const items = chosen.map(id => id.replace(/-/g,' '));
  let text = '';
  if(items.length===1){
    text = `Write a short story about a ${items[0]}.`;
  } else if(items.length===2){
    text = `Write a story that includes a ${items[0]} and a ${items[1]}.`;
  } else {
    text = `Write a story that includes: ${items.slice(0,-1).join(', ')} and ${items.slice(-1)}.`;
  }
  promptText.textContent = text;
}

// wire up events
diceCountEl.addEventListener('change', ()=>{
  const newCount = Number(diceCountEl.value);
  // if number of dice changed, clear persisted roll state to avoid mismatches
  if(newCount !== prevDiceCount){
    try{ localStorage.removeItem(LS_LAST_PICKS); localStorage.removeItem(LS_KEPT); localStorage.removeItem(LS_HAS_ROLLED); }catch(e){}
    hasRolled = false;
    rollBtn.textContent = 'Roll Dice';
    rollBtn.classList.remove('reroll');
  }
  prevDiceCount = newCount;
  renderDiceSlots(newCount);
  checkRepeatWarning();
});

// layout toggle wiring
if(layoutToggle){
  layoutToggle.addEventListener('change', (e)=>{
    const on = !!e.target.checked;
    if(on) diceArea.classList.add('horizontal'); else diceArea.classList.remove('horizontal');
    try{ localStorage.setItem('wd_layout_horizontal', on ? '1' : '0'); }catch(e){}
    // re-render to ensure grid-template-columns get recalculated
    renderDiceSlots(Number(diceCountEl.value));
  });
}

// Settings modal open/close and syncing
if(settingsBtn){
  settingsBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    if(!settingsModal) return;
    settingsModal.hidden = false;
    // sync modal layout toggle state from current dice area or saved preference
    try{
      const saved = localStorage.getItem('wd_layout_horizontal');
      const isHorizontal = diceArea && diceArea.classList.contains('horizontal');
      if(layoutToggleModal) layoutToggleModal.checked = isHorizontal || saved === '1';
      // if inline main toggle exists, keep it in sync as well
      if(layoutToggle && layoutToggleModal) layoutToggle.checked = !!layoutToggleModal.checked;
    }catch(e){}
    // render safe-list into modal (renderSafeListUI already does cloning on init but ensure sync)
    renderSafeListUI();
    // focus first focusable in modal
    setTimeout(()=>{
      const focusEl = settingsModal.querySelector('input, button');
      if(focusEl) focusEl.focus();
      // start trapping focus inside modal
      startFocusTrap(settingsModal);
    }, 50);
  });
}

function closeSettingsModal(){
  // re-query in case elements were not available at initial script run
  const modal = settingsModal || document.getElementById('settings-modal');
  if(!modal) return;
  modal.hidden = true;
  // sync modal layout toggle state into the UI and persist it (work even if inline toggle was removed)
  try{
    const ltm = layoutToggleModal || document.getElementById('layout-toggle-modal');
    const checked = ltm ? !!ltm.checked : false;
    if(checked) diceArea.classList.add('horizontal'); else diceArea.classList.remove('horizontal');
    try{ localStorage.setItem('wd_layout_horizontal', checked ? '1' : '0'); }catch(e){}
    // also update main inline toggle if it exists
    const lt = layoutToggle || document.getElementById('layout-toggle');
    if(lt) lt.checked = checked;
    renderDiceSlots(Number(diceCountEl.value));
  }catch(e){}
  // stop focus trap and restore focus to previous element
  stopFocusTrap();
}

if(settingsClose) settingsClose.addEventListener('click', (e)=>{ e.preventDefault(); closeSettingsModal(); });
if(settingsBackdrop) settingsBackdrop.addEventListener('click', (e)=>{ closeSettingsModal(); });

// allow Esc to close modal
window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && settingsModal && !settingsModal.hidden) closeSettingsModal(); });

// Fallback delegation: close when user clicks close control or backdrop even if initial refs failed
document.addEventListener('click', (e)=>{
  const c = e.target.closest && e.target.closest('#settings-close');
  if(c){ e.preventDefault(); closeSettingsModal(); }
  const b = e.target.closest && e.target.closest('#settings-backdrop');
  if(b){ e.preventDefault(); closeSettingsModal(); }
});

// wire modal layout toggle to update live (so users see changes immediately)
if(layoutToggleModal){
  layoutToggleModal.addEventListener('change', (e)=>{
    const on = !!e.target.checked;
    // reflect immediately on the main dice area so preview updates while modal open
    if(on) diceArea.classList.add('horizontal'); else diceArea.classList.remove('horizontal');
    try{ localStorage.setItem('wd_layout_horizontal', on ? '1' : '0'); }catch(e){}
    renderDiceSlots(Number(diceCountEl.value));
  });
}

// Wire modal PIN controls to reuse existing handlers (map modal buttons to core functions)
if(setPinBtnModal) setPinBtnModal.addEventListener('click', (e)=>{ e.preventDefault(); const v = pinInputModal ? (pinInputModal.value||'') : ''; setPin(v); if(pinMsgModal) pinMsgModal.textContent = pinMsg.textContent; });
if(lockBtnModal) lockBtnModal.addEventListener('click', (e)=>{ e.preventDefault(); setLocked(true); updatePinUI(); if(pinMsgModal) pinMsgModal.textContent = 'Locked.'; });
if(unlockBtnModal) unlockBtnModal.addEventListener('click', async (e)=>{ e.preventDefault(); const v = pinInputModal ? (pinInputModal.value||'') : ''; await checkPinAndUnlock(v); if(pinMsgModal) pinMsgModal.textContent = pinMsg.textContent; });
if(pinInputModal) pinInputModal.addEventListener('keyup', async (e)=>{ if(e.key === 'Enter'){ const v = pinInputModal ? (pinInputModal.value||'') : ''; await checkPinAndUnlock(v); if(pinMsgModal) pinMsgModal.textContent = pinMsg.textContent; } });

// Keep modal and primary PIN message text in sync by observing changes to pinMsg
const pinMsgObserver = new MutationObserver(()=>{
  if(pinMsgModal) pinMsgModal.textContent = pinMsg.textContent;
});
if(pinMsg) pinMsgObserver.observe(pinMsg, {childList:true,characterData:true,subtree:true});

// Roll / Reroll behavior: initial click rolls all dice, subsequent clicks reroll only unlocked dice.
rollBtn.addEventListener('click', ()=>{
  if(!hasRolled){
    // first-time roll: generate all dice
    rollDice();
    hasRolled = true;
    // change button label to Reroll
    rollBtn.textContent = 'Reroll Dice';
    rollBtn.classList.add('reroll');
  } else {
    // subsequent rolls: reroll only dice that are not kept
    rerollUnkeptDice();
  }
});

// Allow clicking a die to toggle kept state
document.addEventListener('click', (e)=>{
  const die = e.target.closest && e.target.closest('.die');
  if(!die) return;
  // only allow toggling after first roll (so students don't 'keep' blanks)
  if(!hasRolled) return;
  die.classList.toggle('kept');
  const pressed = die.classList.contains('kept');
  die.setAttribute('aria-pressed', pressed ? 'true' : 'false');
  saveKeptIndices();
});

// keyboard toggle: Space or Enter on a focused die toggles kept
document.addEventListener('keydown', (e)=>{
  const el = document.activeElement;
  if(!el || !el.classList || !el.classList.contains('die')) return;
  if(!hasRolled) return;
  if(e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter'){
    e.preventDefault();
    el.classList.toggle('kept');
    const pressed = el.classList.contains('kept');
    el.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    saveKeptIndices();
  }
});

function rerollUnkeptDice(){
  const dice = Array.from(document.querySelectorAll('.die'));
  const picks = pickUniqueIcons(dice.length);
  // Determine which indexes to reroll (those without .kept)
  const toReroll = dice.map((d,i)=> ({d,i})).filter(x=>!x.d.classList.contains('kept'));
  if(toReroll.length === 0){
    // nothing to reroll, but still refresh prompt
    generatePrompt();
    return;
  }
  // animate only the dice that will change
  toReroll.forEach(x=> x.d.classList.add('spin'));
  setTimeout(()=>{
    // For fairness, pick new icons for the positions being rerolled
    // Prefer sampling without replacement from icons that are not currently kept.
    const keptIds = new Set(Array.from(document.querySelectorAll('.die.kept')).map(d=>{
      const f = d.querySelector('.face'); return f && f.dataset.choice ? f.dataset.choice : null;
    }).filter(Boolean));
    const changedLabels = [];
    // Pool of available icons (exclude kept)
    let available = SAFE_ICONS.map(ic=>ic).filter(ic=>ic && ic.id && !keptIds.has(ic.id));

    // If we have enough unique available icons, sample without replacement for all rerolls
    if(available.length >= toReroll.length){
      // shuffle available
      for(let i=available.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [available[i], available[j]] = [available[j], available[i]]; }
      toReroll.forEach((x, idx)=>{
        const face = x.d.querySelector('.face');
        const oldId = face.dataset.choice;
        const icon = available[idx];
        face.innerHTML = '';
        face.appendChild(createIconNode(icon));
        face.setAttribute('aria-label', icon.label);
        if(oldId !== icon.id) changedLabels.push(icon.label);
        face.dataset.choice = icon.id;
        x.d.classList.remove('spin');
      });
    } else {
      // Not enough unique icons to fully avoid duplicates; do a best-effort unique assignment first
      const assigned = new Set(Array.from(keptIds));
      // shuffle a working pool of non-kept icons
      let pool = SAFE_ICONS.map(ic=>ic).filter(ic=>ic && ic.id && !keptIds.has(ic.id));
      for(let i=pool.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
      toReroll.forEach(x=>{
        const face = x.d.querySelector('.face');
        const oldId = face.dataset.choice;
        // try to pick from pool an icon not equal to oldId and not assigned
        let choice = null;
        for(let i=0;i<pool.length;i++){
          if(pool[i].id !== oldId && !assigned.has(pool[i].id)){ choice = pool.splice(i,1)[0]; break; }
        }
        // if still no choice, try any from pool not equal to oldId
        if(!choice){
          for(let i=0;i<pool.length;i++){ if(pool[i].id !== oldId){ choice = pool.splice(i,1)[0]; break; } }
        }
        // if still no choice, fall back to any SAFE_ICON not equal to oldId
        if(!choice){
          const fallback = SAFE_ICONS.find(ic=>ic.id !== oldId && !assigned.has(ic.id));
          choice = fallback || SAFE_ICONS[Math.floor(Math.random()*SAFE_ICONS.length)];
        }
        const icon = choice;
        face.innerHTML = '';
        face.appendChild(createIconNode(icon));
        face.setAttribute('aria-label', icon.label);
        if(oldId !== icon.id) changedLabels.push(icon.label);
        face.dataset.choice = icon.id;
        assigned.add(icon.id);
        x.d.classList.remove('spin');
      });
    }
    generatePrompt();
    try{ persistLastRoll(); saveKeptIndices(); }catch(e){}
    // announce changes for screen readers
    try{
      const ann = document.getElementById('aria-announcer');
      if(ann && changedLabels.length){ ann.textContent = `Rerolled: ${changedLabels.join(', ')}`; }
    }catch(e){}
  }, 600);
}

// initialization is handled in init()

// Re-render dice layout on resize to adapt rows/columns while preserving count
let resizeTimer = null;
window.addEventListener('resize', ()=>{
  if(resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(()=>{
    const count = Number(diceCountEl.value) || 4;
    renderDiceSlots(count);
  }, 120);
});

// small accessibility: allow keyboard Enter on roll (mirror click behavior)
rollBtn.addEventListener('keyup', (e)=>{ if(e.key==='Enter') { if(!hasRolled){ rollDice(); hasRolled = true; rollBtn.textContent = 'Reroll Dice'; rollBtn.classList.add('reroll'); } else { rerollUnkeptDice(); } } });

// PIN button wiring
if(setPinBtn) setPinBtn.addEventListener('click', (e)=>{ e.preventDefault(); const v = pinInput ? (pinInput.value||'') : ''; setPin(v); });
if(lockBtn) lockBtn.addEventListener('click', (e)=>{ e.preventDefault(); setLocked(true); updatePinUI(); if(pinMsg) pinMsg.textContent = 'Locked.'; });
if(unlockBtn) unlockBtn.addEventListener('click', async (e)=>{ e.preventDefault(); const v = pinInput ? (pinInput.value||'') : ''; await checkPinAndUnlock(v); });
if(pinInput) pinInput.addEventListener('keyup', async (e)=>{ if(e.key === 'Enter'){ const v = pinInput ? (pinInput.value||'') : ''; await checkPinAndUnlock(v); } });

// ensure UI lock state reflects stored value on load
updatePinUI();
