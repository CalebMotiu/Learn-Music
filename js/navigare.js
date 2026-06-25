// ============================================================
//  NAVIGARE SECȚIUNI + DROPDOWN INSTRUMENTE
// ============================================================
import { initChitara } from './guitar.js';
 
export function mergiLa(id, btn) {
  document.querySelectorAll('.sectiune').forEach(s => s.classList.remove('activa'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('activ'));
  document.getElementById('sec-' + id).classList.add('activa');
  btn.classList.add('activ');
}
 
// ── Dropdown instrumente ─────────────────────────────────────
let instrumentActiv = 'pian';
 
export function toggleDropdown(e) {
  e.stopPropagation();
  document.getElementById('dropdown-instrumente').classList.toggle('deschis');
}
 
export function selectInstrument(instrument) {
  instrumentActiv = instrument;
  document.getElementById('dropdown-instrumente').classList.remove('deschis');
 
  const trigger = document.getElementById('btn-instrumente');
  const labels  = { pian: '🎹 Pian', chitara: '🎸 Chitară' };
  trigger.innerHTML = `${labels[instrument]} <span class="dropdown-arrow">▾</span>`;
 
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('activ'));
  trigger.classList.add('activ');
 
  document.querySelectorAll('.sectiune').forEach(s => s.classList.remove('activa'));
  document.getElementById('sec-' + instrument).classList.add('activa');
 
  if (instrument === 'chitara') initChitara();
}
 
// Închide dropdown la click în afară
document.addEventListener('click', () => {
  document.getElementById('dropdown-instrumente').classList.remove('deschis');
});