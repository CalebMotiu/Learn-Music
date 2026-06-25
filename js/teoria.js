// ============================================================
//  DATE NOTE & CONSTANTE MUZICALE (shared între module)
// ============================================================
export const NOTE_OCTAVA = ['Do','Do# / Re♭','Re','Re# / Mi♭','Mi','Fa','Fa# / Sol♭','Sol','Sol# / La♭','La','La# / Si♭','Si'];
export const TIPAR_MAJOR = [2,2,1,2,2,2,1];
export const TIPAR_MINOR = [2,1,2,2,1,2,2];
export const INDICE_NOTA = {'Do':0,'Re':2,'Mi':4,'Fa':5,'Sol':7,'La':9,'Si':11};

export function construiesteGama(radacina, tip) {
  const start = INDICE_NOTA[radacina];
  const tipar = tip === 'major' ? TIPAR_MAJOR : TIPAR_MINOR;
  const note = [start];
  for (let i = 0; i < 7; i++) note.push(note[note.length - 1] + tipar[i]);
  return note.map(n => n % 12);
}

export function getMIDI(semi, octava) {
  // Do4 = MIDI 60
  return 12 * (octava + 1) + semi;
}
