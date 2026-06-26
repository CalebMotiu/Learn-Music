// ============================================================
//  MAIN — punct de intrare, inițializare + expunere globală
// ============================================================
import { construiesteKb, schimbaOctava, octavaActuala, initTastaturaPiano } from './piano.js';
import { construiesteGama } from './teoria.js';
import { selecteazaGama, gamaSelectata } from './scale.js';
import { deschideLectie, inapoiLaLectii } from './lectii.js';
import { incepeQuiz, urmatoareaIntrebare, reiaQuiz } from './quiz.js';
import { mergiLa, toggleDropdown, selectInstrument } from './navigare.js';
import { selectCategorie } from './guitar.js';
import { initMandolina, randeazaPortativMandolina, selectModMandolina } from './mandolina.js';

// ── Inițializare ─────────────────────────────────────────────
construiesteKb('tastatura', octavaActuala, null);
construiesteKb('tastatura2', 4, construiesteGama('Do', 'major'));
initTastaturaPiano();

// ── Resize responsiv ─────────────────────────────────────────
window.addEventListener('resize', () => {
  construiesteKb('tastatura', octavaActuala, null);
  construiesteKb('tastatura2', 4, gamaSelectata || construiesteGama('Do', 'major'));
});

// ── Expunere globală (folosite din onclick în HTML) ───────────
window.mergiLa              = mergiLa;
window.toggleDropdown       = toggleDropdown;
window.selectInstrument     = selectInstrument;
window.schimbaOctava        = schimbaOctava;
window.selecteazaGama       = selecteazaGama;
window.deschideLectie       = deschideLectie;
window.inapoiLaLectii       = inapoiLaLectii;
window.incepeQuiz           = incepeQuiz;
window.urmatoareaIntrebare  = urmatoareaIntrebare;
window.reiaQuiz             = reiaQuiz;
window.selectCategorie      = selectCategorie;

// ── Mandolină ─────────────────────────────────────────────────
window.initMandolina        = initMandolina;
window.selectModMandolina   = selectModMandolina;