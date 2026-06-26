// ============================================================
//  MANDOLINA — fretboard interactiv + portativ note Sol3–Mi5
// ============================================================
import { cantaNotaMIDI } from './audio.js';

// ── Corzi mandolină (G3 stânga → E5 dreapta, cum se ține mandolina) ─────────
// Index 0 = G3 (cea mai groasă, stânga), index 3 = E5 (cea mai subțire, dreapta)
const CORZI_MANDOLINA = [
  { label: 'G3', openMidi: 55 }, // Sol3
  { label: 'D4', openMidi: 62 }, // Re4
  { label: 'A4', openMidi: 69 }, // La4
  { label: 'E5', openMidi: 76 }, // Mi5
];

const CULORI_DEGETE = {
  1: '#E86830',
  2: '#3B7FC4',
  3: '#2A8C5A',
  4: '#8B44C8',
};

let notaSelectataMidi = null;
let modAlterat = 'simplu'; // 'simplu' | 'diez' | 'bemol'

// ── Inițializare ─────────────────────────────────────────────────────────────
export function initMandolina() {
  deseneazaFretboard(null);
  randeazaPortativMandolina();
  actualizeazaNotaCurenta(null);
}

// ── Selectare notă ───────────────────────────────────────────────────────────
function selecteazaNota(midi) {
  notaSelectataMidi = midi;
  cantaNotaMIDI(midi, 1.0);
  deseneazaFretboard(midi);
  actualizeazaNotaCurenta(midi);
  randeazaPortativMandolina(); // re-render ca să marcheze nota selectată
}

// ── Denumire notă ────────────────────────────────────────────────────────────
function numeNotaAfis(midi) {
  const semi = midi % 12;
  const octava = Math.floor(midi / 12) - 1;
  const numeDiez  = ['Do','Do#','Re','Re#','Mi','Fa','Fa#','Sol','Sol#','La','La#','Si'];
  const numeBemol = ['Do','Re♭','Re','Mi♭','Mi','Fa','Sol♭','Sol','La♭','La','Si♭','Si'];
  const name = modAlterat === 'bemol' ? numeBemol[semi] : numeDiez[semi];
  return `${name} ${octava}`;
}

function actualizeazaNotaCurenta(midi) {
  const el = document.getElementById('mandolina-nota-curenta');
  if (!el) return;
  el.textContent = midi !== null ? numeNotaAfis(midi) : '—';
}

// ── Deget pentru casetă ──────────────────────────────────────────────────────
function degetPentruCaseta(caseta) {
  if (caseta <= 2) return 1;
  if (caseta <= 4) return 2;
  if (caseta === 5) return 3;
  return 4;
}

// ── Poziții pe fretboard ─────────────────────────────────────────────────────
function pozitiiPeFretboard(midi) {
  const pozitii = [];
  CORZI_MANDOLINA.forEach((coarda, idx) => {
    const diff = midi - coarda.openMidi;
    if (diff >= 0 && diff <= 6) {
      pozitii.push({ cordaIdx: idx, caseta: diff });
    }
  });
  return pozitii;
}

// ── Fretboard SVG ────────────────────────────────────────────────────────────
function deseneazaFretboard(midi) {
  const container = document.getElementById('mandolina-fretboard');
  if (!container) return;
  container.innerHTML = '';

  const NR_CORZI_VIZUALE = 4; // 4 perechi de corzi duble
  const NR_CASETE = 6;
  const isMobile = window.innerWidth < 700;

  // Spațiere mai mare pentru corzile duble
  const pairSpacing = isMobile ? 48 : 60; // distanța între perechi
  const twinOffset  = 2; // distanța între cele două corzi dintr-o pereche
  const fretSpacing = isMobile ? 52 : 62;
  const paddingLeft = 52;
  const paddingTop  = 28;

  const totalWidth = paddingLeft + (NR_CORZI_VIZUALE - 1) * pairSpacing + 20;
  const height = paddingTop + NR_CASETE * fretSpacing + 20;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${totalWidth} ${height}`);
  svg.setAttribute('width', '100%');
  svg.style.maxWidth = totalWidth + 'px';

  // Nut
  const nut = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  nut.setAttribute('x', paddingLeft - 2);
  nut.setAttribute('y', paddingTop);
  nut.setAttribute('width', (NR_CORZI_VIZUALE - 1) * pairSpacing + twinOffset + 4);
  nut.setAttribute('height', 6);
  nut.setAttribute('rx', '2');
  nut.setAttribute('fill', '#C9A84C');
  svg.appendChild(nut);

  // Linii casete (orizontale)
  for (let f = 0; f <= NR_CASETE; f++) {
    const y = paddingTop + f * fretSpacing;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', paddingLeft);
    line.setAttribute('y1', y);
    line.setAttribute('x2', paddingLeft + (NR_CORZI_VIZUALE - 1) * pairSpacing + twinOffset);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(255,255,255,0.18)');
    line.setAttribute('stroke-width', f === 0 ? '0' : '1.5');
    svg.appendChild(line);

    if (f > 0) {
      const nr = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nr.setAttribute('x', paddingLeft - 16);
      nr.setAttribute('y', paddingTop + (f - 0.5) * fretSpacing + 5);
      nr.setAttribute('text-anchor', 'middle');
      nr.setAttribute('font-size', '11');
      nr.setAttribute('fill', 'rgba(255,255,255,0.3)');
      nr.setAttribute('font-family', 'DM Sans, sans-serif');
      nr.textContent = f;
      svg.appendChild(nr);
    }
  }

  // Corzi duble (linii verticale în perechi)
  // G3=gros(idx0), D4, A4, E5=subțire(idx3)
  const thicknesses = [3.2, 2.4, 1.8, 1.2]; // G3..E5
  for (let s = 0; s < NR_CORZI_VIZUALE; s++) {
    const xCenter = paddingLeft + s * pairSpacing;
    // Două corzi: una la xCenter - twinOffset/2, una la xCenter + twinOffset/2
    [-twinOffset / 2, twinOffset / 2].forEach(offset => {
      const x = xCenter + offset;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x);
      line.setAttribute('y1', paddingTop);
      line.setAttribute('x2', x);
      line.setAttribute('y2', paddingTop + NR_CASETE * fretSpacing);
      line.setAttribute('stroke', 'rgba(220,200,160,0.75)');
      line.setAttribute('stroke-width', thicknesses[s]);
      svg.appendChild(line);
    });
  }

  // Degete pe fretboard
  if (midi !== null) {
    const pozitii = pozitiiPeFretboard(midi);
    pozitii.forEach(({ cordaIdx, caseta }) => {
      const xCenter = paddingLeft + cordaIdx * pairSpacing;

      if (caseta === 0) {
        // Coardă liberă — cerc deasupra nut-ului
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', xCenter);
        circle.setAttribute('cy', paddingTop - 12);
        circle.setAttribute('r', '8');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'rgba(201,168,76,0.9)');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);
      } else {
        const deget = degetPentruCaseta(caseta);
        const y = paddingTop + (caseta - 0.5) * fretSpacing;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', xCenter);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '16');
        circle.setAttribute('fill', CULORI_DEGETE[deget]);
        svg.appendChild(circle);

        const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txt.setAttribute('x', xCenter);
        txt.setAttribute('y', y + 5);
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('font-size', '13');
        txt.setAttribute('font-weight', '700');
        txt.setAttribute('fill', '#fff');
        txt.setAttribute('font-family', 'DM Sans, sans-serif');
        txt.textContent = deget;
        svg.appendChild(txt);
      }
    });
  }

  container.appendChild(svg);
}

// ── Portativ ─────────────────────────────────────────────────────────────────
//
// Portativ mai mare: H=300, linii la Y:
//   L1=170, L2=150, L3=130, L4=110, L5=90  (de jos în sus)
// Spații: Sp1=160, Sp2=140, Sp3=120, Sp4=100, Sp5=80
//
// Notele naturale:
//   Sol3 (55) → sub portativ, a 2-a linie ajut. de sub L1
//   La3  (57) → spațiu liber între L.aj.Sol3 și L.aj.Do4  (Y=218)
//   Si3  (59) → linia ajut. Do4 vizibila, Si3 in spatiul de deasupra → Y=202 (spatiu deasupra L.aj.Do4)
//   Do4  (60) → linie ajut. sub L1  (Y=192)  ← prima linie sub portativ
//   Re4  (62) → spațiu sub L1  (Y=180)
//   Mi4  (64) → L1  (Y=170)
//   Fa4  (65) → Sp1  (Y=160)
//   Sol4 (67) → L2   (Y=150)
//   La4  (69) → Sp2  (Y=140)
//   Si4  (71) → L3   (Y=130)
//   Do5  (72) → Sp3  (Y=120)
//   Re5  (74) → L4   (Y=110)
//   Mi5  (76) → Sp4  (Y=100)
//
// Linii ajutătoare:
//   Do4: linie la Y=192
//   La3: linia Do4 (Y=192) + linia proprie La3 (Y=228)
//   Sol3: liniile Do4 (Y=192), La3 (Y=228), Sol3 (Y=244)

const W = 620;
const H = 310;

// Liniile portativului — spațiu 22px (identic cu portativul de la pian)
// L1(Mi4)=170, L2(Sol4)=148, L3(Si4)=126, L4(Re5)=104, L5(Fa5)=82
const LINII_PORTATIV_Y = [170, 148, 126, 104, 82];

// Harta MIDI → { y, ledgers }
// Pas între trepte = 11px (jumătate din spațiul de 22px dintre linii)
// L1=170 → spațiu sub=181 → L.aj.Do4=192 → spațiu Si3=203 → L.aj.La3=214 → spațiu Sol3=225
const PORTATIV_MAP_MAND = {
  55: { y: 225, ledgers: [{ y: 192 }, { y: 214 }] }, // Sol3 — spațiu sub L.aj.La3
  57: { y: 214, ledgers: [{ y: 192 }, { y: 214 }] }, // La3  — a 2-a linie ajut.
  59: { y: 203, ledgers: [{ y: 192 }] },              // Si3  — spațiu între L.aj.Do4 și L.aj.La3
  60: { y: 192, ledgers: [{ y: 192 }] },              // Do4  — prima linie ajut. sub L1
  62: { y: 181, ledgers: [] },                        // Re4  — spațiu sub L1
  64: { y: 170, ledgers: [] },                        // Mi4  — L1
  65: { y: 159, ledgers: [] },                        // Fa4  — spațiu L1-L2
  67: { y: 148, ledgers: [] },                        // Sol4 — L2
  69: { y: 137, ledgers: [] },                        // La4  — spațiu L2-L3
  71: { y: 126, ledgers: [] },                        // Si4  — L3
  72: { y: 115, ledgers: [] },                        // Do5  — spațiu L3-L4
  74: { y: 104, ledgers: [] },                        // Re5  — L4
  76: { y:  93, ledgers: [] },                        // Mi5  — spațiu L4-L5
};

function isAlterat(midi) {
  return ![0, 2, 4, 5, 7, 9, 11].includes(midi % 12);
}

function getMidiNaturalInferior(midi) {
  if (!isAlterat(midi)) return midi;
  return midi - 1;
}

function getPozMand(midi) {
  if (!isAlterat(midi)) return PORTATIV_MAP_MAND[midi] || null;
  // Nota cromatică → Y la mijlocul dintre naturala inferioară și cea superioară
  const natInf = getMidiNaturalInferior(midi);
  const natSup = natInf + 1; // semitonul următor e natural (Mi→Fa, Si→Do) sau natInf+2
  // Găsim naturala superioară reală
  const naturale = [0, 2, 4, 5, 7, 9, 11];
  let sup = midi + 1;
  while (sup <= 76 && !naturale.includes(sup % 12)) sup++;

  const pInf = PORTATIV_MAP_MAND[natInf];
  const pSup = PORTATIV_MAP_MAND[sup];
  if (!pInf) return null;
  const ySup = pSup ? pSup.y : pInf.y - 10;
  return { y: Math.round((pInf.y + ySup) / 2), ledgers: pInf.ledgers };
}

function getNoteAfisabile() {
  const note = [];
  const naturale = [0, 2, 4, 5, 7, 9, 11];
  const alterate = [1, 3, 6, 8, 10];
  for (let midi = 55; midi <= 76; midi++) {
    const semi = midi % 12;
    if (modAlterat === 'simplu') {
      if (naturale.includes(semi)) note.push(midi);
    } else {
      // diez sau bemol: afișăm DOAR notele alterate (cromatice)
      if (alterate.includes(semi)) note.push(midi);
    }
  }
  return note;
}

export function randeazaPortativMandolina() {
  const wrapper = document.getElementById('mandolina-portativ-wrapper');
  if (!wrapper) return;

  wrapper.innerHTML = '<div class="mand-portativ" id="mand-portativ-svg"></div>';
  const container = document.getElementById('mand-portativ-svg');

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', '100%');
  svg.style.maxWidth = W + 'px';

  // Fundal alb
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('x', '0'); bg.setAttribute('y', '0');
  bg.setAttribute('width', W); bg.setAttribute('height', H);
  bg.setAttribute('fill', '#FAF7F2'); bg.setAttribute('rx', '10');
  svg.appendChild(bg);

  // Cheie Sol — poziționată ca să se alinieze cu L1..L4
  const clef = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  clef.setAttribute('x', '14');
  clef.setAttribute('y', '210');
  clef.setAttribute('font-size', '140');
  clef.setAttribute('fill', '#1A1410');
  clef.setAttribute('font-family', 'serif');
  clef.textContent = '𝄞';
  svg.appendChild(clef);

  // Cele 5 linii principale
  const xStart = 68;
  LINII_PORTATIV_Y.forEach(y => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', xStart); line.setAttribute('y1', y);
    line.setAttribute('x2', W - 12); line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(26,20,16,0.75)');
    line.setAttribute('stroke-width', '1.5');
    svg.appendChild(line);
  });

  const noteDeAfis = getNoteAfisabile();
  const xNoteStart = xStart + 4;
  const xNoteEnd   = W - 20;
  const xStep = (xNoteEnd - xNoteStart) / (noteDeAfis.length + 1);

  // Colectăm liniile ajutătoare globale necesare (pentru toate notele afișate)
  // ca să nu le desenăm de mai multe ori
  const ledgerYSet = new Set();

  // Prima trecere: colectăm ledger lines necesare
  noteDeAfis.forEach(midi => {
    const poz = getPozMand(midi);
    if (!poz) return;
    poz.ledgers.forEach(l => ledgerYSet.add(l.y));
  });

  // A doua trecere: desenăm notele și ledger lines per notă
  noteDeAfis.forEach((midi, i) => {
    const poz = getPozMand(midi);
    if (!poz) return;

    const x = xNoteStart + (i + 1) * xStep;
    const y = poz.y;
    const alterat = isAlterat(midi);
    const eSelectata = (midi === notaSelectataMidi);

    // Linii ajutătoare pentru această notă
    poz.ledgers.forEach(l => {
      const ledger = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      ledger.setAttribute('x1', x - 16);
      ledger.setAttribute('y1', l.y);
      ledger.setAttribute('x2', x + 16);
      ledger.setAttribute('y2', l.y);
      ledger.setAttribute('stroke', 'rgba(26,20,16,0.7)');
      ledger.setAttribute('stroke-width', '1.5');
      svg.appendChild(ledger);
    });

    // Semn alterație
    if (alterat && modAlterat !== 'simplu') {
      const semn = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      semn.setAttribute('x', x - 14);
      semn.setAttribute('y', y + 5);
      semn.setAttribute('text-anchor', 'middle');
      semn.setAttribute('font-size', '14');
      semn.setAttribute('font-weight', '700');
      semn.setAttribute('fill', eSelectata ? '#1A1410' : 'rgba(26,20,16,0.6)');
      semn.setAttribute('font-family', 'serif');
      semn.textContent = modAlterat === 'diez' ? '#' : '♭';
      svg.appendChild(semn);
    }

    // Elipsa notei
    const nota = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    nota.setAttribute('cx', x);
    nota.setAttribute('cy', y);
    nota.setAttribute('rx', '9');
    nota.setAttribute('ry', '7');

    let fillColor;
    if (eSelectata) {
      fillColor = '#C9A84C';
    } else {
      fillColor = 'rgba(26,20,16,0.55)';
    }

    nota.setAttribute('fill', fillColor);
    nota.setAttribute('stroke', eSelectata ? '#8B6B1A' : 'rgba(26,20,16,0.3)');
    nota.setAttribute('stroke-width', '1');
    nota.style.cursor = 'pointer';

    nota.addEventListener('mouseenter', () => {
      if (midi !== notaSelectataMidi) nota.setAttribute('fill', 'rgba(201,168,76,0.6)');
    });
    nota.addEventListener('mouseleave', () => {
      if (midi !== notaSelectataMidi) nota.setAttribute('fill', fillColor);
    });
    nota.addEventListener('click', () => selecteazaNota(midi));

    const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    hitArea.setAttribute('x', x - 16);
    hitArea.setAttribute('y', y - 12);
    hitArea.setAttribute('width', '32');
    hitArea.setAttribute('height', '24');
    hitArea.setAttribute('fill', 'transparent');
    hitArea.style.cursor = 'pointer';
    hitArea.addEventListener('click', () => selecteazaNota(midi));

    svg.appendChild(nota);
    svg.appendChild(hitArea);
  });

  container.appendChild(svg);
}

// ── Selector mod ─────────────────────────────────────────────────────────────
export function selectModMandolina(mod, btn) {
  modAlterat = mod;
  document.querySelectorAll('.mand-mod-btn').forEach(b => b.classList.remove('activ'));
  btn.classList.add('activ');
  notaSelectataMidi = null;
  actualizeazaNotaCurenta(null);
  deseneazaFretboard(null);
  randeazaPortativMandolina();
}