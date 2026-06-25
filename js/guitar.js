// ============================================================
//  CHITARĂ — Date acorduri + Grif SVG
// ============================================================
import { ctx, cantaNotaMIDI } from './audio.js';

const ACORDURI = {
  major: [
    { name: 'C', label: 'Do / C',  frets: [-1,3,2,0,1,0], fingers: [{s:1,f:3,d:3},{s:2,f:2,d:2},{s:4,f:1,d:1}] },
    { name: 'D', label: 'Re / D',  frets: [-1,-1,0,2,3,2], fingers: [{s:3,f:2,d:1},{s:4,f:3,d:3},{s:5,f:2,d:2}] },
    { name: 'E', label: 'Mi / E',  frets: [0,2,2,1,0,0],  fingers: [{s:1,f:2,d:2},{s:2,f:2,d:3},{s:3,f:1,d:1}] },
    { name: 'F', label: 'Fa / F',  frets: [1,3,3,2,1,1],  fingers: [{s:0,f:1,d:1,barre:true,from:0,to:5},{s:3,f:2,d:2},{s:1,f:3,d:3},{s:2,f:3,d:4}] },
    { name: 'G', label: 'Sol / G', frets: [3,2,0,0,0,3],  fingers: [{s:0,f:3,d:2},{s:1,f:2,d:1},{s:5,f:3,d:3}] },
    { name: 'A', label: 'La / A',  frets: [-1,0,2,2,2,0], fingers: [{s:2,f:2,d:1},{s:3,f:2,d:2},{s:4,f:2,d:3}] },
    { name: 'B', label: 'Si / B',  frets: [-1,2,4,4,4,2], fingers: [{s:1,f:2,d:1,barre:true,from:1,to:5},{s:2,f:4,d:2},{s:3,f:4,d:3},{s:4,f:4,d:4}] },
  ],
  minor: [
    { name: 'Cm', label: 'Do m / Cm',  frets: [-1,3,5,5,4,3], fingers: [{s:2,f:5,d:4},{s:3,f:5,d:3},{s:4,f:4,d:2},{s:5,f:3,d:1,barre:true,from:1,to:5}] },
    { name: 'Dm', label: 'Re m / Dm',  frets: [-1,-1,0,2,3,1], fingers: [{s:3,f:2,d:2},{s:4,f:3,d:3},{s:5,f:1,d:1}] },
    { name: 'Em', label: 'Mi m / Em',  frets: [0,2,2,0,0,0],   fingers: [{s:1,f:2,d:2},{s:2,f:2,d:3}] },
    { name: 'Fm', label: 'Fa m / Fm',  frets: [1,3,3,1,1,1],   fingers: [{s:0,f:1,d:1,barre:true,from:0,to:5},{s:1,f:3,d:3},{s:2,f:3,d:4}] },
    { name: 'Gm', label: 'Sol m / Gm', frets: [3,1,0,0,3,3],   fingers: [{s:1,f:1,d:1},{s:0,f:3,d:2},{s:4,f:3,d:3},{s:5,f:3,d:4}] },
    { name: 'Am', label: 'La m / Am',  frets: [-1,0,2,2,1,0],  fingers: [{s:2,f:2,d:2},{s:3,f:2,d:3},{s:4,f:1,d:1}] 
  }],

  '7': [
    { name: 'C7', label: 'Do 7 / C7',  frets: [-1,3,2,3,1,0], fingers: [{s:1,f:3,d:3},{s:2,f:2,d:2},{s:3,f:3,d:4},{s:4,f:1,d:1}] },
    { name: 'D7', label: 'Re 7 / D7',  frets: [-1,-1,0,2,1,2], fingers: [{s:3,f:2,d:2},{s:4,f:1,d:1},{s:5,f:2,d:3}] },
    { name: 'E7', label: 'Mi 7 / E7',  frets: [0,2,0,1,0,0],   fingers: [{s:1,f:2,d:2},{s:3,f:1,d:1}] },
    { name: 'F7', label: 'Fa 7 / F7',  frets: [1,3,1,2,1,1],   fingers: [{s:0,f:1,d:1,barre:true,from:0,to:5},{s:3,f:2,d:2},{s:1,f:3,d:3}] },
    { name: 'G7', label: 'Sol 7 / G7', frets: [3,2,0,0,0,1],   fingers: [{s:0,f:3,d:3},{s:1,f:2,d:2},{s:5,f:1,d:1}] },
    { name: 'A7', label: 'La 7 / A7',  frets: [-1,0,2,0,2,0],  fingers: [{s:2,f:2,d:2},{s:4,f:2,d:3}] },
    { name: 'B7', label: 'Si 7 / B7',  frets: [-1,2,1,2,0,2],  fingers: [{s:1,f:2,d:2},{s:2,f:1,d:1},{s:3,f:2,d:3},{s:5,f:2,d:4}] },
  ],
};

const CULORI_DEGETE = {
  1: '#E86830',
  2: '#3B7FC4',
  3: '#2A8C5A',
  4: '#8B44C8',
};

let categorieActiva = 'major';
let acordSelectat   = null;

export function initChitara() {
  construiesteGrif();
  populateazaAcorduri('major');
  // reset tabs
  document.querySelectorAll('.acord-tab').forEach((b, i) => {
    b.classList.toggle('activ', i === 0);
  });
}

function construiesteGrif(acord) {
  const fb = document.getElementById('fretboard');
  fb.innerHTML = '';

  const NR_CORZI = 6;
  const NR_FRETE = 5;

  let startFret = 1;
  if (acord) {
    const fretsValide = acord.frets.filter(f => f > 0);
    const minFret = fretsValide.length ? Math.min(...fretsValide) : 1;
    const maxFret = fretsValide.length ? Math.max(...fretsValide) : 5;
    if (maxFret > 5) startFret = minFret;
  }

  const isMobile     = window.innerWidth < 700;
  const stringSpacing = isMobile ? 44 : 56;
  const fretSpacing   = isMobile ? 52 : 66;
  const paddingLeft   = 48;
  const paddingTop    = 24;
  const width         = paddingLeft + NR_CORZI * stringSpacing;
  const height        = paddingTop  + NR_FRETE * fretSpacing + 20;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', '100%');
  svg.style.maxWidth = width + 'px';

  // Nut
  const nut = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  nut.setAttribute('x', paddingLeft - 2);
  nut.setAttribute('y', paddingTop);
  nut.setAttribute('width', (NR_CORZI - 1) * stringSpacing + 4);
  nut.setAttribute('height', startFret === 1 ? 6 : 3);
  nut.setAttribute('rx', '2');
  nut.setAttribute('fill', startFret === 1 ? '#C9A84C' : 'rgba(255,255,255,0.3)');
  svg.appendChild(nut);

  // Linii frete
  for (let f = 0; f <= NR_FRETE; f++) {
    const y    = paddingTop + f * fretSpacing;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', paddingLeft);
    line.setAttribute('y1', y);
    line.setAttribute('x2', paddingLeft + (NR_CORZI - 1) * stringSpacing);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(255,255,255,0.18)');
    line.setAttribute('stroke-width', f === 0 ? '0' : '1.5');
    svg.appendChild(line);

    if (f > 0) {
      const fretNr = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      fretNr.setAttribute('x', paddingLeft - 14);
      fretNr.setAttribute('y', paddingTop + (f - 0.5) * fretSpacing + 5);
      fretNr.setAttribute('text-anchor', 'middle');
      fretNr.setAttribute('font-size', '11');
      fretNr.setAttribute('fill', 'rgba(255,255,255,0.3)');
      fretNr.setAttribute('font-family', 'DM Sans, sans-serif');
      fretNr.textContent = startFret + f - 1;
      svg.appendChild(fretNr);
    }
  }

  // Corzi
  for (let s = 0; s < NR_CORZI; s++) {
    const x    = paddingLeft + s * stringSpacing;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x);
    line.setAttribute('y1', paddingTop);
    line.setAttribute('x2', x);
    line.setAttribute('y2', paddingTop + NR_FRETE * fretSpacing);
    line.setAttribute('stroke', 'rgba(220,200,160,0.7)');
    line.setAttribute('stroke-width', 3.5 - s * 0.45);
    svg.appendChild(line);
  }

  if (!acord) { fb.appendChild(svg); return; }

  // Barre
  acord.fingers.filter(f => f.barre).forEach(bf => {
    const fretRelativ = bf.f - startFret + 1;
    const y     = paddingTop + (fretRelativ - 0.5) * fretSpacing;
    const xFrom = paddingLeft + bf.from * stringSpacing;
    const xTo   = paddingLeft + bf.to   * stringSpacing;

    const barre = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    barre.setAttribute('x', xFrom - 12);
    barre.setAttribute('y', y - 12);
    barre.setAttribute('width',  xTo - xFrom + 24);
    barre.setAttribute('height', 24);
    barre.setAttribute('rx', '12');
    barre.setAttribute('fill', CULORI_DEGETE[bf.d]);
    barre.setAttribute('opacity', '0.85');
    svg.appendChild(barre);

    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', xFrom - 2);
    txt.setAttribute('y', y + 5);
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('font-size', '13');
    txt.setAttribute('font-weight', '700');
    txt.setAttribute('fill', '#fff');
    txt.setAttribute('font-family', 'DM Sans, sans-serif');
    txt.textContent = bf.d;
    svg.appendChild(txt);
  });

  // Degete individuale
  acord.fingers.filter(f => !f.barre).forEach(fi => {
    const fretRelativ = fi.f - startFret + 1;
    const x = paddingLeft + fi.s * stringSpacing;
    const y = paddingTop  + (fretRelativ - 0.5) * fretSpacing;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r',  '13');
    circle.setAttribute('fill', CULORI_DEGETE[fi.d]);
    svg.appendChild(circle);

    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', x);
    txt.setAttribute('y', y + 5);
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('font-size', '13');
    txt.setAttribute('font-weight', '700');
    txt.setAttribute('fill', '#fff');
    txt.setAttribute('font-family', 'DM Sans, sans-serif');
    txt.textContent = fi.d;
    svg.appendChild(txt);
  });

  // O / X deasupra grifului
  acord.frets.forEach((fv, si) => {
    const x = paddingLeft + si * stringSpacing;
    const y = paddingTop - 10;
    if (fv === -1) {
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', x);
      txt.setAttribute('y', y);
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('font-size', '14');
      txt.setAttribute('font-weight', '700');
      txt.setAttribute('fill', 'rgba(255,100,80,0.8)');
      txt.setAttribute('font-family', 'DM Sans, sans-serif');
      txt.textContent = '✕';
      svg.appendChild(txt);
    } else if (fv === 0) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y - 2);
      circle.setAttribute('r',  '6');
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', 'rgba(200,200,200,0.6)');
      circle.setAttribute('stroke-width', '1.5');
      svg.appendChild(circle);
    }
  });

  fb.appendChild(svg);
}

function populateazaAcorduri(categorie) {
  const grid  = document.getElementById('acorduri-grid');
  grid.innerHTML = '';
  ACORDURI[categorie].forEach(acord => {
    const btn = document.createElement('button');
    btn.className   = 'acord-chip';
    btn.textContent = acord.label;
    btn.onclick     = () => selecteazaAcord(acord, btn, categorie);
    grid.appendChild(btn);
  });
}

export function selectCategorie(cat, btn) {
  document.querySelectorAll('.acord-tab').forEach(b => b.classList.remove('activ'));
  btn.classList.add('activ');
  categorieActiva = cat;
  populateazaAcorduri(cat);
  acordSelectat = null;
  document.getElementById('acord-curent').textContent    = '—';
  document.getElementById('acord-tip-label').textContent = '';
  construiesteGrif(null);
}

function selecteazaAcord(acord, btn, categorie) {
  document.querySelectorAll('.acord-chip').forEach(b => b.classList.remove('selectat'));
  btn.classList.add('selectat');
  acordSelectat = acord;

  const labelMap = { major: 'major', minor: 'minor', '7': 'septimă' };
  document.getElementById('acord-curent').textContent    = acord.label;
  document.getElementById('acord-tip-label').textContent = labelMap[categorie] || '';

  construiesteGrif(acord);
  playAcord(acord);
}

function playAcord(acord) {
  if (ctx.state === 'suspended') ctx.resume();
  const CORZI_MIDI_OPEN = [40, 45, 50, 55, 59, 64];
  const delays = [0, 0.06, 0.12, 0.18, 0.24, 0.30];
  acord.frets.forEach((fret, si) => {
    if (fret === -1) return;
    const midi = CORZI_MIDI_OPEN[si] + fret;
    setTimeout(() => cantaNotaMIDI(midi, 1.4), delays[si] * 1000);
  });
}