// ============================================================
//  PIAN — Tastatura + Portativ
// ============================================================
import { ctx, cantaNotaMIDI } from './audio.js';
import { NOTE_OCTAVA, getMIDI } from './teoria.js';

// ── Configurare taste ────────────────────────────────────────
const ALBE_OFFSET  = [0, 2, 4, 5, 7, 9, 11];
const NEGRE_CONFIG = [
  { dupa: 0, semi: 1,  sharp: 'Do#', flat: 'Re♭'  },
  { dupa: 1, semi: 3,  sharp: 'Re#', flat: 'Mi♭'  },
  { dupa: 3, semi: 6,  sharp: 'Fa#', flat: 'Sol♭' },
  { dupa: 4, semi: 8,  sharp: 'Sol#', flat: 'La♭' },
  { dupa: 5, semi: 10, sharp: 'La#', flat: 'Si♭'  },
];

// ── Stare internă ────────────────────────────────────────────
export let octavaActuala   = 4;
export let eticheteVizibile = true;
export let tasteKBVizibile  = false;

// ── Portativ map ─────────────────────────────────────────────
const PORTATIV_MAP = {
  60: { left: '22%', top: '142px', ledger: true, ledgerTop: '141px' },
  61: { left: '28%', top: '142px', ledger: true, ledgerTop: '141px' },
  62: { left: '32%', top: '134px' },
  63: { left: '38%', top: '134px' },
  64: { left: '42%', top: '127px' },
  65: { left: '46%', top: '116px' },
  66: { left: '50%', top: '116px' },
  67: { left: '54%', top: '105px' },
  68: { left: '58%', top: '105px' },
  69: { left: '64%', top: '94px'  },
  70: { left: '70%', top: '94px'  },
  71: { left: '76%', top: '83px'  },
  72: { left: '82%', top: '72px'  },
};

// ── Dimensiuni responsive ────────────────────────────────────
function getDimensiuniTastatura() {
  return window.innerWidth < 700
    ? { lataAlba: 45, lataNeagra: 30 }
    : { lataAlba: 52, lataNeagra: 34 };
}

// ── Portativ ─────────────────────────────────────────────────
export function initPortativ() {
  ['portativ-note', 'portativ-ledger', 'portativ-accidental'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

export function afiseazaNotaPortativ(midi) {
  const nota   = PORTATIV_MAP[midi];
  const noteEl = document.getElementById('portativ-note');
  const ledgerEl = document.getElementById('portativ-ledger');
  const accEl  = document.getElementById('portativ-accidental');

  if (!noteEl || !nota) {
    if (noteEl)   noteEl.style.display   = 'none';
    if (ledgerEl) ledgerEl.style.display = 'none';
    if (accEl)    accEl.style.display    = 'none';
    return;
  }

  noteEl.style.display = 'block';
  noteEl.style.left    = nota.left;
  noteEl.style.top     = nota.top;

  if (nota.ledger && ledgerEl) {
    ledgerEl.style.display = 'block';
    ledgerEl.style.left    = nota.left;
    ledgerEl.style.top     = nota.ledgerTop || nota.top;
  } else if (ledgerEl) {
    ledgerEl.style.display = 'none';
  }

  if (accEl) {
    const semiton = midi % 12;
    const blackSemitones = [1, 3, 6, 8, 10];
    if (blackSemitones.includes(semiton)) {
      accEl.style.display = 'block';
      accEl.style.left    = semiton === 1 ? `calc(${nota.left} - 8px)` : nota.left;
      accEl.style.top     = nota.top;
      accEl.textContent   = '#';
    } else {
      accEl.style.display = 'none';
    }
  }
}

// ── Apasă clapă ──────────────────────────────────────────────
export function apasaClapa(el, midi) {
  if (ctx.state === 'suspended') ctx.resume();
  cantaNotaMIDI(midi);
  el.classList.add('apasata');
  setTimeout(() => el.classList.remove('apasata'), 200);

  const semiton = midi % 12;
  document.getElementById('nota-curenta').textContent =
    NOTE_OCTAVA[semiton] + ' ' + (Math.floor(midi / 12) - 1);
  afiseazaNotaPortativ(midi);
}

// ── Construiește tastatura ────────────────────────────────────
export function construiesteKb(idContainer, octava, gamaSet) {
  const container = document.getElementById(idContainer);
  container.innerHTML = '';
  const { lataAlba, lataNeagra } = getDimensiuniTastatura();

  // Clape albe
  ALBE_OFFSET.forEach((semi, i) => {
    const midi = getMIDI(semi, octava);
    const el   = document.createElement('div');
    el.className          = 'clapa-alba';
    el.id                 = `${idContainer}-w-${semi}`;
    el.dataset.midi       = midi;
    el.dataset.semi       = semi;
    el.dataset.container  = idContainer;

    if (gamaSet) {
      if (gamaSet.includes(semi % 12)) {
        el.classList.add(semi % 12 === gamaSet[0] ? 'tonica' : 'nota-gama');
      }
    }

    const lblNota = document.createElement('div');
    lblNota.className   = 'label-nota' + (eticheteVizibile ? '' : ' ascuns');
    lblNota.textContent = NOTE_OCTAVA[semi];
    el.appendChild(lblNota);

    el.addEventListener('mousedown', () => apasaClapa(el, midi));
    el.addEventListener('touchstart', e => { e.preventDefault(); apasaClapa(el, midi); });
    container.appendChild(el);
  });

  // Ultima Do (octava+1)
  const midiDo2 = getMIDI(0, octava + 1);
  const elDo2   = document.createElement('div');
  elDo2.className         = 'clapa-alba';
  elDo2.id                = `${idContainer}-w-12`;
  elDo2.dataset.midi      = midiDo2;
  elDo2.dataset.semi      = 12;
  elDo2.dataset.container = idContainer;
  if (gamaSet && gamaSet.includes(0)) elDo2.classList.add('tonica');
  const lblDo2 = document.createElement('div');
  lblDo2.className   = 'label-nota' + (eticheteVizibile ? '' : ' ascuns');
  lblDo2.textContent = 'Do';
  elDo2.appendChild(lblDo2);
  elDo2.addEventListener('mousedown', () => apasaClapa(elDo2, midiDo2));
  elDo2.addEventListener('touchstart', e => { e.preventDefault(); apasaClapa(elDo2, midiDo2); });
  container.appendChild(elDo2);

  // Clape negre
  NEGRE_CONFIG.forEach((cfg) => {
    const midi = getMIDI(cfg.semi, octava);
    const el   = document.createElement('div');
    el.className         = 'clapa-neagra';
    el.id                = `${idContainer}-b-${cfg.semi}`;
    el.dataset.midi      = midi;
    el.dataset.semi      = cfg.semi;
    el.dataset.container = idContainer;

    if (gamaSet && gamaSet.includes(cfg.semi % 12)) el.classList.add('nota-gama');

    el.style.left = (cfg.dupa * lataAlba + lataAlba - lataNeagra / 2) + 'px';

    const lblNota = document.createElement('div');
    lblNota.className = 'label-nota' + (eticheteVizibile ? '' : ' ascuns');
    lblNota.innerHTML = `${cfg.sharp}<br>${cfg.flat}`;
    el.appendChild(lblNota);

    el.addEventListener('mousedown', () => apasaClapa(el, midi));
    el.addEventListener('touchstart', e => { e.preventDefault(); apasaClapa(el, midi); });
    container.appendChild(el);
  });
}

// ── Schimbă octava ───────────────────────────────────────────
export function schimbaOctava(dir) {
  octavaActuala = Math.max(2, Math.min(6, octavaActuala + dir));
  document.getElementById('octava-label').textContent = 'Octava ' + octavaActuala;
  construiesteKb('tastatura', octavaActuala, null);
}

// ── Tastatură fizică ─────────────────────────────────────────
const mapTasteAlbe = { a:0, s:2, d:4, f:5, g:7, h:9, j:11, k:12 };
const mapTasteNegre = { w:1, e:3, t:6, y:8, u:10 };

export function initTastaturaPiano() {
  document.addEventListener('keydown', e => {
    const k    = e.key.toLowerCase();
    const semi = mapTasteAlbe[k] ?? mapTasteNegre[k];
    if (semi === undefined) return;

    const midi = getMIDI(semi % 12, semi >= 12 ? octavaActuala + 1 : octavaActuala);
    const tip  = mapTasteAlbe[k] !== undefined ? 'w' : 'b';
    const el   = document.getElementById(`tastatura-${tip}-${semi}`);

    if (el) {
      apasaClapa(el, midi);
    } else {
      cantaNotaMIDI(midi);
      document.getElementById('nota-curenta').textContent =
        NOTE_OCTAVA[midi % 12] + ' ' + (Math.floor(midi / 12) - 1);
      afiseazaNotaPortativ(midi);
    }
  });
}
