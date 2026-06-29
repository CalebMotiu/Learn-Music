// ============================================================
//  METRONOM
// ============================================================

let metroBpm      = 120;
let metroInterval = null;
let metroBeat     = 0;
let metroPornit   = false;
let metroCtx      = null;
let metroMasura   = 2; // 2, 3 sau 4

// ── Actualizare UI stare pornit/oprit ────────────────────────
function actualizeazaStare() {
  const startBtn = document.getElementById('metro-start-btn');
  if (metroPornit) {
    if (startBtn) { startBtn.innerHTML = '⏹ Stop'; startBtn.classList.add('pornit'); }
  } else {
    if (startBtn) { startBtn.innerHTML = '▶ Start'; startBtn.classList.remove('pornit'); }
    document.querySelectorAll('.metronom-beat-dot').forEach(d => d.classList.remove('activ'));
    const pendul = document.getElementById('pendul-svg');
    if (pendul) pendul.setAttribute('x2', '16');
  }
}

// ── Buton nav — doar arată/ascunde FAB, fără audio ───────────
let fabVizibil = false;
export function toggleMetronomNav() {
  fabVizibil = !fabVizibil;
  const navBtn = document.getElementById('btn-metronom-nav');
  const fab    = document.getElementById('metronom-fab');
  if (fabVizibil) {
    if (navBtn) navBtn.classList.add('activ-metronom');
    if (fab)    fab.classList.add('vizibil');
  } else {
    if (navBtn) navBtn.classList.remove('activ-metronom');
    if (fab)    fab.classList.remove('vizibil');
  }
}

// ── Popup toggle (doar FAB) ───────────────────────────────────
export function toggleMetronomPopup() {
  document.getElementById('metronom-popup').classList.toggle('deschis');
  document.getElementById('metronom-overlay').classList.toggle('deschis');
}

export function inchideMetronom() {
  document.getElementById('metronom-popup').classList.remove('deschis');
  document.getElementById('metronom-overlay').classList.remove('deschis');
}

// ── BPM ──────────────────────────────────────────────────────
export function setBpm(val) {
  metroBpm = parseInt(val);
  document.getElementById('metro-bpm-val').textContent = metroBpm;
  document.getElementById('metro-slider').value = metroBpm;
  if (metroPornit) {
    clearInterval(metroInterval);
    pornesteMetronom();
  }
}

// ── Măsură ───────────────────────────────────────────────────
export function setMasura(val, btn) {
  metroMasura = parseInt(val);
  document.querySelectorAll('.metronom-masura-btn').forEach(b => b.classList.remove('activ'));
  btn.classList.add('activ');
  construiestePuncte();
  if (metroPornit) {
    clearInterval(metroInterval);
    metroBeat = 0;
    pornesteMetronom();
  }
}

function construiestePuncte() {
  const row = document.getElementById('metro-beats');
  if (!row) return;
  row.innerHTML = '';
  for (let i = 0; i < metroMasura; i++) {
    const dot = document.createElement('div');
    dot.className = 'metronom-beat-dot' + (i === 0 ? ' accent' : '');
    dot.id = 'beat-' + i;
    row.appendChild(dot);
  }
}

// ── Audio click ───────────────────────────────────────────────
function clickAudio(estePrim) {
  if (!metroCtx) metroCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (metroCtx.state === 'suspended') metroCtx.resume();

  const osc  = metroCtx.createOscillator();
  const gain = metroCtx.createGain();
  osc.connect(gain);
  gain.connect(metroCtx.destination);

  osc.type = 'sine';
  osc.frequency.value = estePrim ? 1000 : 700;
  gain.gain.setValueAtTime(estePrim ? 0.6 : 0.35, metroCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, metroCtx.currentTime + 0.08);
  osc.start();
  osc.stop(metroCtx.currentTime + 0.08);
}

// ── O bătaie ─────────────────────────────────────────────────
function bat() {
  document.querySelectorAll('.metronom-beat-dot').forEach(d => d.classList.remove('activ'));
  const dot = document.getElementById('beat-' + metroBeat);
  if (dot) dot.classList.add('activ');

  clickAudio(metroBeat === 0);

  const pendul = document.getElementById('pendul-svg');
  if (pendul) {
    pendul.setAttribute('x2', metroBeat % 2 === 0 ? '16' : '8');
  }

  metroBeat = (metroBeat + 1) % metroMasura;
}

// ── Pornire ───────────────────────────────────────────────────
function pornesteMetronom() {
  const intervalMs = (60 / metroBpm) * 1000;
  metroBeat = 0;
  bat();
  metroInterval = setInterval(bat, intervalMs);
}

// ── Start / Stop ─────────────────────────────────────────────
export function toggleMetronom() {
  if (!metroPornit) {
    metroPornit = true;
    pornesteMetronom();
  } else {
    metroPornit = false;
    clearInterval(metroInterval);
    metroInterval = null;
    metroBeat = 0;
  }
  actualizeazaStare();
}

// ── Init ─────────────────────────────────────────────────────
export function initMetronom() {
  construiestePuncte();
  actualizeazaStare();
}