// ============================================================
//  GAME & SCĂRI
// ============================================================
import { NOTE_OCTAVA, TIPAR_MAJOR, TIPAR_MINOR, construiesteGama } from './teoria.js';
import { construiesteKb } from './piano.js';

export let gamaSelectata = null;

export function selecteazaGama(radacina, tip, btn) {
  document.querySelectorAll('.gama-btn').forEach(b => b.classList.remove('activa'));
  btn.classList.add('activa');

  const note = construiesteGama(radacina, tip);
  gamaSelectata = note;

  const tipar     = tip === 'major' ? TIPAR_MAJOR : TIPAR_MINOR;
  const tiparText = tipar
    .map(t => t === 1
      ? '<span class="badge-S">S</span>'
      : '<span class="badge-T">T</span>')
    .join(' – ');

  document.getElementById('titlu-gama-info').textContent = `Gama ${radacina} ${tip}`;
  document.getElementById('tipar-gama-info').innerHTML   = tiparText;

  const numeNote = note.map(n => NOTE_OCTAVA[n]);
  const container = document.getElementById('note-gama-afis');
  container.innerHTML = '';

  numeNote.forEach((n, i) => {
    const chip = document.createElement('span');
    chip.className   = 'chip-nota' + (i === 0 ? ' tonica' : '');
    chip.textContent = (i + 1) + '. ' + n;
    container.appendChild(chip);
  });

  // Octava (nota 8 = tonica repetată)
  const chip8 = document.createElement('span');
  chip8.className   = 'chip-nota tonica';
  chip8.textContent = '8. ' + numeNote[0];
  container.appendChild(chip8);

  construiesteKb('tastatura2', 4, note);
}
