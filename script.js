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

// Raster manifest (optional): load available raster outputs (webp/png) so the UI
// can prefer high-quality raster images when present. Expected structure:
// {
//   "tree": { "webp": [{"path":"assets/raster/1024/tree.webp","width":1024}, ...], "png": [...] },
//   ...
// }
let RASTER_MANIFEST = {};
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
const diceCountEl = document.getElementById('dice-count');
const rollBtn = document.getElementById('roll-btn');
const newPromptBtn = document.getElementById('new-prompt');
const promptText = document.getElementById('prompt-text');

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

// UI: render safe-list checkboxes
const safeListContainer = document.getElementById('safe-list');
const safePanel = document.getElementById('safe-list-panel');
// PIN UI elements
const pinInput = document.getElementById('pin-input');
const setPinBtn = document.getElementById('set-pin-btn');
const lockBtn = document.getElementById('lock-btn');
const unlockBtn = document.getElementById('unlock-btn');
const pinMsg = document.getElementById('pin-msg');

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

async function checkPinAndUnlock(){
  const input = (pinInput.value||'').trim();
  if(!input){ pinMsg.textContent = 'Enter a PIN to unlock.'; return false; }
  const stored = localStorage.getItem(LS_PIN_HASH);
  if(!stored){ pinMsg.textContent = 'No PIN set. Use Set PIN to create one.'; return false; }
  const h = await sha256Hex(input);
  if(h === stored){ setLocked(false); updatePinUI(); pinMsg.textContent = 'Unlocked.'; return true; }
  pinMsg.textContent = 'Incorrect PIN.'; return false;
}

async function setPin(){
  const input = (pinInput.value||'').trim();
  if(!input){ pinMsg.textContent = 'Enter a PIN to set.'; return; }
  const h = await sha256Hex(input);
  localStorage.setItem(LS_PIN_HASH, h);
  setLocked(true);
  updatePinUI();
  pinMsg.textContent = 'PIN set and panel locked.';
}

function updatePinUI(){
  const locked = isLocked();
  // disable checkboxes when locked
  Array.from(document.querySelectorAll('#safe-list input')).forEach(i=>i.disabled = locked);
  lockBtn.style.display = locked ? 'none' : '';
  unlockBtn.style.display = locked ? '' : 'none';
}

function renderSafeListUI(){
  if(!safeListContainer) return;
  safeListContainer.innerHTML = '';
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
      const checked = Array.from(safeListContainer.querySelectorAll('input:checked')).map(i=>i.dataset.id);
      SAFE_OBJECTS = checked.length ? checked : DEFAULT_SAFE_OBJECTS.slice();
      SAFE_ICONS = ICONS.filter(ic => SAFE_OBJECTS.includes(ic.id));
      saveSafeObjects(SAFE_OBJECTS);
      checkRepeatWarning();
    });
    wrapper.appendChild(cb);
    wrapper.appendChild(previewNode);
    wrapper.appendChild(span);
    safeListContainer.appendChild(wrapper);
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
  renderSafeListUI();
  checkRepeatWarning();
  renderDiceSlots(Number(diceCountEl.value));
  updatePinUI();
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
  const rows = preferredRows();
  const cols = Math.ceil(count / rows);
  diceArea.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  for(let i=0;i<count;i++){
    const die = document.createElement('div');
    die.className = 'die';
    die.setAttribute('role','img');
    die.setAttribute('aria-label', 'dice slot');
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
  renderDiceSlots(Number(diceCountEl.value));
  checkRepeatWarning();
});

rollBtn.addEventListener('click', ()=>{
  rollDice();
});

newPromptBtn.addEventListener('click', ()=>{
  generatePrompt();
});

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

// small accessibility: allow keyboard Enter on roll
rollBtn.addEventListener('keyup', (e)=>{ if(e.key==='Enter') rollDice(); });

// PIN button wiring
if(setPinBtn) setPinBtn.addEventListener('click', (e)=>{ e.preventDefault(); setPin(); });
if(lockBtn) lockBtn.addEventListener('click', (e)=>{ e.preventDefault(); setLocked(true); updatePinUI(); pinMsg.textContent = 'Locked.'; });
if(unlockBtn) unlockBtn.addEventListener('click', async (e)=>{ e.preventDefault(); await checkPinAndUnlock(); });
if(pinInput) pinInput.addEventListener('keyup', async (e)=>{ if(e.key === 'Enter'){ await checkPinAndUnlock(); } });

// ensure UI lock state reflects stored value on load
updatePinUI();
