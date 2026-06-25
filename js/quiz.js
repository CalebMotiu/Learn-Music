// ============================================================
//  QUIZ
// ============================================================

const INTREBARI = [
  { q: "Câte note are alfabetul muzical?",            hint: "Gândește-te la clapele albe dintr-o octavă.",          opt: ["5","7","8","12"],                                             corect: 1 },
  { q: "Care este cel mai mic interval în muzică?",   hint: "Distanța dintre două clape alăturate.",                opt: ["Tonul","Octava","Semitonul","Terța"],                          corect: 2 },
  { q: "Câte semitonuri are un ton întreg?",          hint: "Dacă sari peste o clapă...",                           opt: ["1","2","3","4"],                                              corect: 1 },
  { q: "Între care note NU există clapă neagră?",     hint: "Căută perechile speciale de clape albe.",              opt: ["Do–Re","Re–Mi","Mi–Fa","Sol–La"],                             corect: 2 },
  { q: "Care este tiparul gamei majore?",             hint: "7 pași cu T = ton, S = semiton.",                      opt: ["T-S-T-T-T-S-T","T-T-S-T-T-T-S","S-T-T-S-T-T-T","T-T-T-S-T-T-S"], corect: 1 },
  { q: "Gama Do major conține note cu diez?",         hint: "Ce note are Do major pe tastatura pianului?",          opt: ["Da, un diez","Da, două dieze","Nu, nicio alterație","Da, un bemol"], corect: 2 },
  { q: "Care este nota de la treapta 5 a gamei Do major?", hint: "Numără: Do(1) Re(2) Mi(3) Fa(4) Sol(5)...",     opt: ["Fa","Sol","La","Mi"],                                         corect: 1 },
  { q: "Ce gamă minoră este relativă lui Do major?",  hint: "Aceleași note, altă notă de start — treapta 6 a gamei majore.", opt: ["Re minor","Mi minor","La minor","Sol minor"],       corect: 2 },
  { q: "Ce alterație urcă o notă cu un semiton?",     hint: "Simbolul arată ca un '#'.",                           opt: ["Bemol (♭)","Diez (#)","Natural (♮)","Dublu bemol"],           corect: 1 },
  { q: "Din ce note este format acordul Do major?",   hint: "Treapta 1, 3 și 5 a gamei Do major.",                 opt: ["Do–Fa–La","Do–Re–Sol","Do–Mi–Sol","Do–Mi–La"],                corect: 2 },
];

let indexIntrebare  = 0;
let scorQuiz        = 0;
let raspunsuri      = [];
let raspunsSelectat = null;

export function incepeQuiz() {
  indexIntrebare  = 0;
  scorQuiz        = 0;
  raspunsuri      = [];
  document.getElementById('quiz-start').style.display = 'none';
  document.getElementById('quiz-final').style.display = 'none';
  document.getElementById('quiz-joc').style.display   = 'block';
  afiseazaIntrebare();
}

function afiseazaIntrebare() {
  const q = INTREBARI[indexIntrebare];
  raspunsSelectat = null;

  // Puncte progres
  const pg = document.getElementById('quiz-progres');
  pg.innerHTML = '';
  INTREBARI.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'progres-dot';
    if (i < indexIntrebare) dot.classList.add(raspunsuri[i] ? 'corect' : 'gresit');
    if (i === indexIntrebare) dot.classList.add('curent');
    pg.appendChild(dot);
  });

  document.getElementById('quiz-intrebare').textContent    = `${indexIntrebare + 1}. ${q.q}`;
  document.getElementById('quiz-hint').textContent         = `Indiciu: ${q.hint}`;
  document.getElementById('quiz-feedback').className       = 'quiz-feedback';
  document.getElementById('quiz-feedback').textContent     = '';
  document.getElementById('btn-urmatorul').style.display   = 'none';

  const optContainer = document.getElementById('optiuni-quiz');
  optContainer.innerHTML = '';
  q.opt.forEach((o, i) => {
    const btn = document.createElement('button');
    btn.className   = 'optiune-quiz';
    btn.textContent = o;
    btn.onclick     = () => raspunde(i);
    optContainer.appendChild(btn);
  });
}

function raspunde(idx) {
  if (raspunsSelectat !== null) return;
  raspunsSelectat = idx;

  const q      = INTREBARI[indexIntrebare];
  const corect = idx === q.corect;
  raspunsuri.push(corect);
  if (corect) scorQuiz++;

  document.querySelectorAll('.optiune-quiz').forEach((b, i) => {
    if (i === q.corect)          b.classList.add('corect');
    else if (i === idx && !corect) b.classList.add('gresit');
  });

  const fb = document.getElementById('quiz-feedback');
  if (corect) {
    fb.className   = 'quiz-feedback corect';
    fb.textContent = '✓ Corect! Bravo!';
  } else {
    fb.className   = 'quiz-feedback gresit';
    fb.textContent = `✗ Răspuns greșit. Răspunsul corect era: ${q.opt[q.corect]}`;
  }
  document.getElementById('btn-urmatorul').style.display = 'inline-block';
}

export function urmatoareaIntrebare() {
  indexIntrebare++;
  if (indexIntrebare >= INTREBARI.length) afiseazaFinal();
  else afiseazaIntrebare();
}

function afiseazaFinal() {
  document.getElementById('quiz-joc').style.display   = 'none';
  document.getElementById('quiz-final').style.display = 'block';
  document.getElementById('scor-afisat').textContent  = `${scorQuiz}/10`;

  const mesaj = scorQuiz <= 4
    ? "Mai exersează — recitește lecțiile și încearcă din nou!"
    : scorQuiz <= 7
      ? "Bun progres! Continuă să studiezi teoria."
      : "Excelent! Ești pe drumul cel bun spre a deveni muzician!";
  document.getElementById('scor-mesaj').textContent = mesaj;
}

export function reiaQuiz() {
  document.getElementById('quiz-final').style.display = 'none';
  document.getElementById('quiz-start').style.display = 'block';
}
