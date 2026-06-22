// ============================================================
//  AUDIO ENGINE (Web Audio API)
// ============================================================
const ctx = new (window.AudioContext || window.webkitAudioContext)();

function noteazaFrec(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function cantaNotaMIDI(midi, durata = 0.8) {
  if (ctx.state === 'suspended') ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  const master = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.value = noteazaFrec(midi);
  osc2.type = 'sine';
  osc2.frequency.value = noteazaFrec(midi);

  gain.gain.setValueAtTime(0.6, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durata);
  gain2.gain.setValueAtTime(0.4, ctx.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durata * 0.7);
  master.gain.value = 0.4;

  osc.connect(gain); gain.connect(master);
  osc2.connect(gain2); gain2.connect(master);
  master.connect(ctx.destination);

  osc.start(); osc2.start();
  osc.stop(ctx.currentTime + durata);
  osc2.stop(ctx.currentTime + durata * 0.7);
}

// ============================================================
//  DATE NOTE & GAME
// ============================================================
const NOTE_OCTAVA = ['Do','Do#','Re','Re#','Mi','Fa','Fa#','Sol','Sol#','La','La#','Si'];
const TIPAR_MAJOR = [2,2,1,2,2,2,1];
const TIPAR_MINOR = [2,1,2,2,1,2,2];

const INDICE_NOTA = {'Do':0,'Re':2,'Mi':4,'Fa':5,'Sol':7,'La':9,'Si':11};

function construiesteGama(radacina, tip) {
  const start = INDICE_NOTA[radacina];
  const tipar = tip === 'major' ? TIPAR_MAJOR : TIPAR_MINOR;
  const note = [start];
  for (let i = 0; i < 7; i++) note.push(note[note.length-1] + tipar[i]);
  return note.map(n => n % 12);
}

// ============================================================
//  CONSTRUIRE TASTATURA
// ============================================================
// Una octava: 8 albe, 5 negre
// MIDI offset albe: 0,2,4,5,7,9,11,12
// Negre relative la pozitia albelor (offset px)
const ALBE_OFFSET = [0,2,4,5,7,9,11]; // semitonuri
const ALBE_TASTE_KB = ['A','S','D','F','G','H','J'];
const NEGRE_TASTE_KB = ['W','E','T','Y','U'];
// Pozitia negre (intre care albe, offset in px relativ la stanga albei stanga)
const NEGRE_CONFIG = [
  {dupa: 0, semi: 1},  // Do# dupa Do
  {dupa: 1, semi: 3},  // Re# dupa Re
  {dupa: 3, semi: 6},  // Fa# dupa Fa
  {dupa: 4, semi: 8},  // Sol# dupa Sol
  {dupa: 5, semi: 10}  // La# dupa La
];

let octavaActuala = 4;
let eticheteVizibile = true;
let tasteKBVizibile = false;
let gamaActiva = null;

function getMIDI(semi, octava) {
  // Do4 = MIDI 60
  return 12 * (octava + 1) + semi;
}

function construiesteKb(idContainer, octava, gamaSet) {
  const container = document.getElementById(idContainer);
  container.innerHTML = '';

  const lataAlba = 52;
  const lataNeagra = 34;

  // Albe
  ALBE_OFFSET.forEach((semi, i) => {
    const midi = getMIDI(semi, octava);
    const el = document.createElement('div');
    el.className = 'clapa-alba';
    el.id = `${idContainer}-w-${semi}`;
    el.dataset.midi = midi;
    el.dataset.semi = semi;
    el.dataset.container = idContainer;

    // Evidentiaza gama
    if (gamaSet) {
      if (gamaSet.includes(semi % 12)) {
        if (semi % 12 === gamaSet[0]) el.classList.add('tonica');
        else el.classList.add('nota-gama');
      }
    }

    const lblNota = document.createElement('div');
    lblNota.className = 'label-nota' + (eticheteVizibile ? '' : ' ascuns');
    lblNota.textContent = NOTE_OCTAVA[semi];
    el.appendChild(lblNota);

    if (tasteKBVizibile && ALBE_TASTE_KB[i]) {
      const lblKb = document.createElement('div');
      lblKb.className = 'label-tasta';
      lblKb.textContent = ALBE_TASTE_KB[i];
      el.appendChild(lblKb);
    }

    el.addEventListener('mousedown', () => apasaClapa(el, midi));
    el.addEventListener('touchstart', e => { e.preventDefault(); apasaClapa(el, midi); });
    container.appendChild(el);
  });

  // Ultima Do (octava+1)
  const semiDo2 = 12;
  const midiDo2 = getMIDI(0, octava+1);
  const elDo2 = document.createElement('div');
  elDo2.className = 'clapa-alba';
  elDo2.id = `${idContainer}-w-${semiDo2}`;
  elDo2.dataset.midi = midiDo2;
  elDo2.dataset.semi = 12;
  elDo2.dataset.container = idContainer;
  if (gamaSet && gamaSet.includes(0)) elDo2.classList.add('tonica');
  const lblDo2 = document.createElement('div');
  lblDo2.className = 'label-nota' + (eticheteVizibile ? '' : ' ascuns');
  lblDo2.textContent = 'Do';
  elDo2.appendChild(lblDo2);
  elDo2.addEventListener('mousedown', () => apasaClapa(elDo2, midiDo2));
  elDo2.addEventListener('touchstart', e => { e.preventDefault(); apasaClapa(elDo2, midiDo2); });
  container.appendChild(elDo2);

  // Negre
  NEGRE_CONFIG.forEach((cfg, i) => {
    const midi = getMIDI(cfg.semi, octava);
    const el = document.createElement('div');
    el.className = 'clapa-neagra';
    el.id = `${idContainer}-b-${cfg.semi}`;
    el.dataset.midi = midi;
    el.dataset.semi = cfg.semi;
    el.dataset.container = idContainer;

    if (gamaSet && gamaSet.includes(cfg.semi % 12)) {
      el.classList.add('nota-gama');
    }

    const left = cfg.dupa * lataAlba + lataAlba - lataNeagra / 2;
    el.style.left = left + 'px';

    if (tasteKBVizibile && NEGRE_TASTE_KB[i]) {
      const lblKb = document.createElement('div');
      lblKb.className = 'label-nota';
      lblKb.style.fontSize = '9px';
      lblKb.style.color = 'rgba(200,180,140,0.6)';
      lblKb.textContent = NEGRE_TASTE_KB[i];
      el.appendChild(lblKb);
    }

    el.addEventListener('mousedown', () => apasaClapa(el, midi));
    el.addEventListener('touchstart', e => { e.preventDefault(); apasaClapa(el, midi); });
    container.appendChild(el);
  });

  // Latime container
  container.style.width = (8 * lataAlba) + 'px';
  container.style.height = '190px';
}

function apasaClapa(el, midi) {
  if (ctx.state === 'suspended') ctx.resume();
  cantaNotaMIDI(midi);
  el.classList.add('apasata');
  setTimeout(() => el.classList.remove('apasata'), 200);

  const semiton = midi % 12;
  document.getElementById('nota-curenta').textContent = NOTE_OCTAVA[semiton] + ' ' + (Math.floor(midi/12)-1);
}

// ============================================================
//  TASTATTURA FIZICA
// ============================================================
const mapTasteAlbe = {'a':0,'s':2,'d':4,'f':5,'g':7,'h':9,'j':11,'k':12};
const mapTasteNegre = {'w':1,'e':3,'t':6,'y':8,'u':10};

document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  let semi = mapTasteAlbe[k] ?? mapTasteNegre[k];
  if (semi === undefined) return;
  const midi = getMIDI(semi % 12, semi >= 12 ? octavaActuala+1 : octavaActuala);
  const tip = mapTasteAlbe[k] !== undefined ? 'w' : 'b';
  const realSemi = semi % 12 === 0 && semi === 12 ? 12 : semi;
  const el = document.getElementById(`tastatura-${tip === 'w' ? 'w' : 'b'}-${realSemi}`);
  if (el) apasaClapa(el, midi);
  else {
    cantaNotaMIDI(midi);
    document.getElementById('nota-curenta').textContent = NOTE_OCTAVA[midi%12] + ' ' + (Math.floor(midi/12)-1);
  }
});

// ============================================================
//  CONTROLS
// ============================================================
function toggleEtichete() {
  eticheteVizibile = !eticheteVizibile;
  document.getElementById('btn-etichete').classList.toggle('on', eticheteVizibile);
  document.querySelectorAll('.label-nota').forEach(el => {
    if (el.closest('#tastatura')) el.classList.toggle('ascuns', !eticheteVizibile);
  });
}

function toggleTasteKB() {
  tasteKBVizibile = !tasteKBVizibile;
  document.getElementById('btn-taste-kb').classList.toggle('on', tasteKBVizibile);
  construiesteKb('tastatura', octavaActuala, null);
}

function schimbaOctava(dir) {
  octavaActuala = Math.max(2, Math.min(6, octavaActuala + dir));
  document.getElementById('octava-label').textContent = 'Octava ' + octavaActuala;
  construiesteKb('tastatura', octavaActuala, null);
}

// ============================================================
//  GAME & SCALE
// ============================================================
let gamaSelectata = null;

function selecteazaGama(radacina, tip, btn) {
  document.querySelectorAll('.gama-btn').forEach(b => b.classList.remove('activa'));
  btn.classList.add('activa');

  const note = construiesteGama(radacina, tip);
  gamaSelectata = note;

  const tipar = tip === 'major' ? TIPAR_MAJOR : TIPAR_MINOR;
  const tiparText = tipar.map(t => t === 1 ? '<span class="badge-S">S</span>' : '<span class="badge-T">T</span>').join(' – ');

  document.getElementById('titlu-gama-info').textContent = `Gama ${radacina} ${tip}`;
  document.getElementById('tipar-gama-info').innerHTML = tiparText;

  const numeNote = note.map(n => NOTE_OCTAVA[n]);
  const container = document.getElementById('note-gama-afis');
  container.innerHTML = '';
  numeNote.forEach((n, i) => {
    const chip = document.createElement('span');
    chip.className = 'chip-nota' + (i === 0 ? ' tonica' : '');
    chip.textContent = (i+1) + '. ' + n;
    container.appendChild(chip);
  });
  // Adauga octava
  const chip8 = document.createElement('span');
  chip8.className = 'chip-nota tonica';
  chip8.textContent = '8. ' + numeNote[0];
  container.appendChild(chip8);

  construiesteKb('tastatura2', 4, note);
}

// ============================================================
//  NAVIGARE SECTIUNI
// ============================================================
function mergiLa(id, btn) {
  document.querySelectorAll('.sectiune').forEach(s => s.classList.remove('activa'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('activ'));
  document.getElementById('sec-' + id).classList.add('activa');
  btn.classList.add('activ');
}

// ============================================================
//  LECTII
// ============================================================
const CONTINUT_LECTII = {
  1: `<h2 style="font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--gold);margin-bottom:20px;">Lecția 1: Alfabetul Muzical</h2>
    <div class="lectie-bloc">
      <h3>Cele 7 note</h3>
      Muzica folosește un alfabet special de doar <strong>7 note</strong>: <strong>Do – Re – Mi – Fa – Sol – La – Si</strong>. 
      După Si, totul o ia de la capăt cu Do. Aceste note reprezintă sunete cu înălțimi specifice.
    </div>
    <div class="lectie-bloc">
      <h3>Tastatura pianului</h3>
      Pe pian, clapele albe sunt cele 7 note. Clapele negre sunt note "intermediare" (dieze și bemoli — le vom studia mai târziu). 
      Clapele negre apar în grupuri de <strong>2 și 3</strong>. <strong>Do</strong> este mereu clapa albă din stânga unui grup de 2 clape negre.
    </div>
    <div class="lectie-bloc">
      <h3>Exercițiu practic</h3>
      Mergi la secțiunea <strong>Pian</strong> și găsește toate Do-urile. Cântă alfabetul muzical de la stânga la dreapta.
    </div>`,

  2: `<h2 style="font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--gold);margin-bottom:20px;">Lecția 2: Tonuri și Semitonuri</h2>
    <div class="lectie-bloc">
      <h3>Semitonul — cel mai mic pas</h3>
      Un <strong>semiton</strong> este distanța de la o clapă la cea imediat alăturată (incluzând clapele negre). 
      De exemplu: <strong>Do → Do#</strong> sau <strong>Mi → Fa</strong> (fără clapă neagră între ele!).
    </div>
    <div class="lectie-bloc">
      <h3>Tonul întreg = 2 semitonuri</h3>
      Un <strong>ton</strong> înseamnă să sari peste o clapă. Exemplu: <strong>Do → Re</strong> (sari peste Do#).
    </div>
    <div class="lectie-bloc">
      <h3>Semitonuri naturale — memorează!</h3>
      Există doar 2 perechi de clape albe fără clapă neagră între ele:<br><br>
      <strong style="color:#E86830;">Mi → Fa</strong> &nbsp;&nbsp;&nbsp; <strong style="color:#E86830;">Si → Do</strong><br><br>
      Exact acolo unde nu există clapă neagră!
    </div>
    <table class="tabel-tipar">
      <thead><tr><th>De la</th><th>La</th><th>Distanța</th></tr></thead>
      <tbody>
        <tr><td>Do</td><td>Re</td><td><span class="badge-T">T</span></td></tr>
        <tr><td>Re</td><td>Mi</td><td><span class="badge-T">T</span></td></tr>
        <tr><td>Mi</td><td>Fa</td><td><span class="badge-S">S</span></td></tr>
        <tr><td>Fa</td><td>Sol</td><td><span class="badge-T">T</span></td></tr>
        <tr><td>Sol</td><td>La</td><td><span class="badge-T">T</span></td></tr>
        <tr><td>La</td><td>Si</td><td><span class="badge-T">T</span></td></tr>
        <tr><td>Si</td><td>Do</td><td><span class="badge-S">S</span></td></tr>
      </tbody>
    </table>`,

  3: `<h2 style="font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--gold);margin-bottom:20px;">Lecția 3: Gama Majoră</h2>
    <div class="lectie-bloc">
      <h3>Tiparul magic</h3>
      Orice gamă majoră urmează același tipar de tonuri și semitonuri:<br><br>
      <span style="font-size:1.3rem;font-weight:600;letter-spacing:2px;"><span class="badge-T">T</span> – <span class="badge-T">T</span> – <span class="badge-S">S</span> – <span class="badge-T">T</span> – <span class="badge-T">T</span> – <span class="badge-T">T</span> – <span class="badge-S">S</span></span>
    </div>
    <div class="lectie-bloc">
      <h3>Gama Do major</h3>
      Pornind de la Do cu tiparul de mai sus: <strong>Do – Re – Mi – Fa – Sol – La – Si – Do</strong>.
      Do major folosește doar clape albe — de aceea e prima gamă învățată.
    </div>
    <div class="lectie-bloc">
      <h3>Gama Sol major</h3>
      Pornind de la Sol: Sol – La – Si – Do – Re – Mi – <strong style="color:var(--gold);">Fa#</strong> – Sol.<br>
      Fa trebuie să devină Fa# pentru că altfel tiparul nu e respectat!
    </div>
    <div class="lectie-bloc">
      <h3>Treptele gamei</h3>
      Fiecare notă are un număr (treaptă). Treapta 1 = <strong>Tonica</strong> (nota de acasă). Treapta 5 = <strong>Dominanta</strong> (cea mai stabilă după tonică).
    </div>`,

  4: `<h2 style="font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--gold);margin-bottom:20px;">Lecția 4: Gama Minoră</h2>
    <div class="lectie-bloc">
      <h3>De ce sună tristă?</h3>
      Gama minoră are un <strong>tipar diferit</strong> față de cea majoră. Semitonul apare mai devreme (după treapta 2), ceea ce îi dă acel caracter melancolic, emoționant.
    </div>
    <div class="lectie-bloc">
      <h3>Tiparul gamei minore naturale</h3>
      <span style="font-size:1.2rem;font-weight:600;letter-spacing:2px;"><span class="badge-T">T</span> – <span class="badge-S">S</span> – <span class="badge-T">T</span> – <span class="badge-T">T</span> – <span class="badge-S">S</span> – <span class="badge-T">T</span> – <span class="badge-T">T</span></span>
    </div>
    <div class="lectie-bloc">
      <h3>La minor — gama relativă</h3>
      Gama <strong>La minor</strong> folosește exact aceleași note ca Do major — La – Si – Do – Re – Mi – Fa – Sol – La. 
      Diferența este nota de start! Fiecare gamă majoră are o gamă minoră "soră" (relativă).
    </div>
    <table class="tabel-tipar">
      <thead><tr><th>Gamă majoră</th><th>Relativă minoră</th></tr></thead>
      <tbody>
        <tr><td>Do major</td><td>La minor</td></tr>
        <tr><td>Sol major</td><td>Mi minor</td></tr>
        <tr><td>Re major</td><td>Si minor</td></tr>
        <tr><td>Fa major</td><td>Re minor</td></tr>
      </tbody>
    </table>`,

  5: `<h2 style="font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--gold);margin-bottom:20px;">Lecția 5: Dieze și Bemoli</h2>
    <div class="lectie-bloc">
      <h3>Ce sunt clapele negre?</h3>
      Clapele negre sunt note <strong>alterate</strong>. Fiecare are două nume:<br><br>
      <strong style="color:var(--gold);">Diez (#)</strong> = urcăm nota cu un semiton (Do# = Do ridicat)<br>
      <strong style="color:var(--gold);">Bemol (♭)</strong> = coborâm nota cu un semiton (Re♭ = Re coborât)<br><br>
      Do# și Re♭ sunt același sunet — doar numele diferă în funcție de context!
    </div>
    <table class="tabel-tipar">
      <thead><tr><th>Numele cu diez</th><th>Numele cu bemol</th><th>Poziție</th></tr></thead>
      <tbody>
        <tr><td>Do#</td><td>Re♭</td><td>Între Do și Re</td></tr>
        <tr><td>Re#</td><td>Mi♭</td><td>Între Re și Mi</td></tr>
        <tr><td>Fa#</td><td>Sol♭</td><td>Între Fa și Sol</td></tr>
        <tr><td>Sol#</td><td>La♭</td><td>Între Sol și La</td></tr>
        <tr><td>La#</td><td>Si♭</td><td>Între La și Si</td></tr>
      </tbody>
    </table>
    <div class="lectie-bloc" style="margin-top:16px;">
      <h3>De ce folosim dieze sau bemoli?</h3>
      Convenție: în game cu dieze (Sol major, Re major...) folosim dieze. În game cu bemoli (Fa major, Si♭ major...) folosim bemoli.
    </div>`,

  6: `<h2 style="font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--gold);margin-bottom:20px;">Lecția 6: Acorduri de Bază</h2>
    <div class="lectie-bloc">
      <h3>Ce este un acord?</h3>
      Un <strong>acord</strong> este 3 sau mai multe note cântate <em>simultan</em>. Acordurile sunt fundamentul armoniei — orice cântec popular, rock sau clasic este construit din acorduri.
    </div>
    <div class="lectie-bloc">
      <h3>Acordul major (vesel)</h3>
      Se construiește din treapta 1 a gamei: ia nota de bază, adaugă o terță mare (4 semitonuri) și o terță mică (3 semitonuri).<br><br>
      Exemplu — <strong>Do major (C)</strong>: <strong>Do – Mi – Sol</strong><br>
      (Do→Mi = 4 semitonuri, Mi→Sol = 3 semitonuri)
    </div>
    <div class="lectie-bloc">
      <h3>Acordul minor (melancolic)</h3>
      Invers: terță mică (3 semitonuri) + terță mare (4 semitonuri).<br><br>
      Exemplu — <strong>La minor (Am)</strong>: <strong>La – Do – Mi</strong><br>
      (La→Do = 3 semitonuri, Do→Mi = 4 semitonuri)
    </div>
    <table class="tabel-tipar">
      <thead><tr><th>Acord</th><th>Note</th><th>Caracter</th></tr></thead>
      <tbody>
        <tr><td>Do major</td><td>Do – Mi – Sol</td><td>Vesel, luminos</td></tr>
        <tr><td>Re minor</td><td>Re – Fa – La</td><td>Trist, emoționant</td></tr>
        <tr><td>Sol major</td><td>Sol – Si – Re</td><td>Vibrant, plin</td></tr>
        <tr><td>La minor</td><td>La – Do – Mi</td><td>Melancolic</td></tr>
      </tbody>
    </table>`
};

function deschideLectie(nr) {
  document.getElementById('lista-lectii').style.display = 'none';
  document.getElementById('continut-lectie').classList.add('activa');
  document.getElementById('text-lectie').innerHTML = CONTINUT_LECTII[nr];
  window.scrollTo(0, 0);
}
function inapoiLaLectii() {
  document.getElementById('lista-lectii').style.display = 'block';
  document.getElementById('continut-lectie').classList.remove('activa');
}

// ============================================================
//  QUIZ
// ============================================================
const INTREBARI = [
  { q: "Câte note are alfabetul muzical?", hint: "Gândește-te la clapele albe dintr-o octavă.", opt: ["5","7","8","12"], corect: 1 },
  { q: "Care este cel mai mic interval în muzică?", hint: "Distanța dintre două clape alăturate.", opt: ["Tonul","Octava","Semitonul","Terța"], corect: 2 },
  { q: "Câte semitonuri are un ton întreg?", hint: "Dacă sari peste o clapă...", opt: ["1","2","3","4"], corect: 1 },
  { q: "Între care note NU există clapă neagră?", hint: "Căută perechile speciale de clape albe.", opt: ["Do–Re","Re–Mi","Mi–Fa","Sol–La"], corect: 2 },
  { q: "Care este tiparul gamei majore?", hint: "7 pași cu T = ton, S = semiton.", opt: ["T-S-T-T-T-S-T","T-T-S-T-T-T-S","S-T-T-S-T-T-T","T-T-T-S-T-T-S"], corect: 1 },
  { q: "Gama Do major conține note cu diez?", hint: "Ce note are Do major pe tastatura pianului?", opt: ["Da, un diez","Da, două dieze","Nu, nicio alterație","Da, un bemol"], corect: 2 },
  { q: "Care este nota de la treapta 5 a gamei Do major?", hint: "Numără: Do(1) Re(2) Mi(3) Fa(4) Sol(5)...", opt: ["Fa","Sol","La","Mi"], corect: 1 },
  { q: "Ce gamă minoră este relativă lui Do major?", hint: "Aceleași note, altă notă de start — treapta 6 a gamei majore.", opt: ["Re minor","Mi minor","La minor","Sol minor"], corect: 2 },
  { q: "Ce alterație urcă o notă cu un semiton?", hint: "Simbolul arată ca un '#'.", opt: ["Bemol (♭)","Diez (#)","Natural (♮)","Dublu bemol"], corect: 1 },
  { q: "Din ce note este format acordul Do major?", hint: "Treapta 1, 3 și 5 a gamei Do major.", opt: ["Do–Fa–La","Do–Re–Sol","Do–Mi–Sol","Do–Mi–La"], corect: 2 }
];

let indexIntrebare = 0;
let scorQuiz = 0;
let raspunsuri = [];
let raspunsSelectat = null;

function incepeQuiz() {
  indexIntrebare = 0;
  scorQuiz = 0;
  raspunsuri = [];
  document.getElementById('quiz-start').style.display = 'none';
  document.getElementById('quiz-final').style.display = 'none';
  document.getElementById('quiz-joc').style.display = 'block';
  afiseazaIntrebare();
}

function afiseazaIntrebare() {
  const q = INTREBARI[indexIntrebare];
  raspunsSelectat = null;

  // Progres
  const pg = document.getElementById('quiz-progres');
  pg.innerHTML = '';
  INTREBARI.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'progres-dot';
    if (i < indexIntrebare) dot.classList.add(raspunsuri[i] ? 'corect' : 'gresit');
    if (i === indexIntrebare) dot.classList.add('curent');
    pg.appendChild(dot);
  });

  document.getElementById('quiz-intrebare').textContent = `${indexIntrebare+1}. ${q.q}`;
  document.getElementById('quiz-hint').textContent = `Indiciu: ${q.hint}`;
  document.getElementById('quiz-feedback').className = 'quiz-feedback';
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('btn-urmatorul').style.display = 'none';

  const optContainer = document.getElementById('optiuni-quiz');
  optContainer.innerHTML = '';
  q.opt.forEach((o, i) => {
    const btn = document.createElement('button');
    btn.className = 'optiune-quiz';
    btn.textContent = o;
    btn.onclick = () => raspunde(i, btn);
    optContainer.appendChild(btn);
  });
}

function raspunde(idx, btn) {
  if (raspunsSelectat !== null) return;
  raspunsSelectat = idx;
  const q = INTREBARI[indexIntrebare];
  const corect = idx === q.corect;
  raspunsuri.push(corect);
  if (corect) scorQuiz++;

  document.querySelectorAll('.optiune-quiz').forEach((b, i) => {
    if (i === q.corect) b.classList.add('corect');
    else if (i === idx && !corect) b.classList.add('gresit');
  });

  const fb = document.getElementById('quiz-feedback');
  if (corect) {
    fb.className = 'quiz-feedback corect';
    fb.textContent = '✓ Corect! Bravo!';
  } else {
    fb.className = 'quiz-feedback gresit';
    fb.textContent = `✗ Răspuns greșit. Răspunsul corect era: ${q.opt[q.corect]}`;
  }
  document.getElementById('btn-urmatorul').style.display = 'inline-block';
}

function urmatoareaIntrebare() {
  indexIntrebare++;
  if (indexIntrebare >= INTREBARI.length) {
    afiseazaFinal();
  } else {
    afiseazaIntrebare();
  }
}

function afiseazaFinal() {
  document.getElementById('quiz-joc').style.display = 'none';
  document.getElementById('quiz-final').style.display = 'block';
  document.getElementById('scor-afisat').textContent = `${scorQuiz}/10`;
  let mesaj = scorQuiz <= 4 ? "Mai exersează — recitește lecțiile și încearcă din nou!" :
               scorQuiz <= 7 ? "Bun progres! Continuă să studiezi teoria." :
               "Excelent! Ești pe drumul cel bun spre a deveni muzician!";
  document.getElementById('scor-mesaj').textContent = mesaj;
}

function reiaQuiz() {
  document.getElementById('quiz-final').style.display = 'none';
  document.getElementById('quiz-start').style.display = 'block';
}

// ============================================================
//  INIT
// ============================================================
construiesteKb('tastatura', octavaActuala, null);
construiesteKb('tastatura2', 4, construiesteGama('Do', 'major'));