// ============================================================
//  AUDIO ENGINE (Web Audio API)
// ============================================================
export const ctx = new (window.AudioContext || window.webkitAudioContext)();

export function noteazaFrec(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function cantaNotaMIDI(midi, durata = 0.8) {
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
