// ============================================================
//  HAMBURGER MENU — navigare mobilă
// ============================================================
import { initChitara } from './guitar.js';
import { initMandolina } from './mandolina.js';

// ── Toggle meniu ─────────────────────────────────────────────
export function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('deschis');
}

// ── Selectare instrument din meniu mobil ─────────────────────
export function selectInstrumentMobil(instrument) {
  inchisMeniu();

  const labels = { pian: '🎹 Pian', chitara: '🎸 Chitară', mandolina: '🪕 Mandolină' };

  document.querySelectorAll('.sectiune').forEach(s => s.classList.remove('activa'));
  document.getElementById('sec-' + instrument).classList.add('activa');

  actualizareMobilActiv(instrument);

  if (instrument === 'chitara')   initChitara();
  if (instrument === 'mandolina') initMandolina();
}

// ── Navigare pagini din meniu mobil ──────────────────────────
export function mergiLaMobil(id) {
  inchisMeniu();
  document.querySelectorAll('.sectiune').forEach(s => s.classList.remove('activa'));
  document.getElementById('sec-' + id).classList.add('activa');
  actualizareMobilActiv(id);
}

// ── Helpers ───────────────────────────────────────────────────
function inchisMeniu() {
  document.getElementById('mobile-menu').classList.remove('deschis');
}

function actualizareMobilActiv(id) {
  document.querySelectorAll('.mobile-menu button').forEach(b => b.classList.remove('activ'));
  const btn = document.querySelector(`.mobile-menu [data-id="${id}"]`);
  if (btn) btn.classList.add('activ');
}

// ── Închide la click în afara meniului ───────────────────────
export function initHamburger() {
  document.addEventListener('click', e => {
    const menu = document.getElementById('mobile-menu');
    const btn  = document.getElementById('hamburger-btn');
    if (!menu || !btn) return;
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('deschis');
    }
  });
}