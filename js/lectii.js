// ============================================================
//  LECȚII
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
        <tr><td>Do</td><td>Re</td><td><span class="badge-T">Ton</span></td></tr>
        <tr><td>Re</td><td>Mi</td><td><span class="badge-T">Ton</span></td></tr>
        <tr><td>Mi</td><td>Fa</td><td><span class="badge-S">Semiton</span></td></tr>
        <tr><td>Fa</td><td>Sol</td><td><span class="badge-T">Ton</span></td></tr>
        <tr><td>Sol</td><td>La</td><td><span class="badge-T">Ton</span></td></tr>
        <tr><td>La</td><td>Si</td><td><span class="badge-T">Ton</span></td></tr>
        <tr><td>Si</td><td>Do</td><td><span class="badge-S">Semiton</span></td></tr>
      </tbody>
    </table>`,

  3: `<h2 style="font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--gold);margin-bottom:20px;">Lecția 3: Dieze și Bemoli</h2>
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
      Convenție: în game cu dieze (Sol major, Re major...) folosim dieze. În game cu bemoli (Fa major, Si♭ major...) folosim bemoli. Despre game o sa învățăm mai târziu.
    </div>`,

  4: `<div class="lectie-wrapper">
  <h2 class="lectie-titlu">Lecția 4: Valori de Note — Cât durează sunetul?</h2>
  <div class="lectie-bloc">
    <h3>Ce este valoarea unei note?</h3>
    <p>Muzica nu înseamnă doar <em>ce</em> sunete cânți, ci și <em>cât</em> timp durează fiecare. <strong style="color:var(--gold)">Valoarea</strong> unei note îți spune durata ei — câte bătăi (timpi) ocupă în măsură.</p>
  </div>
  <div class="note-grid">
    <div class="nota-card">
      <div class="nota-durata">Întreagă</div>
      <svg viewBox="0 0 60 50" width="60" height="50">
        <ellipse cx="30" cy="30" rx="16" ry="11" fill="none" stroke="#7C4E9B" stroke-width="2.5"/>
      </svg>
      <div class="nota-name">Notă întreagă</div>
      <div class="nota-beats">4 timpi</div>
    </div>
    <div class="nota-card">
      <div class="nota-durata">Doime</div>
      <svg viewBox="0 0 60 60" width="60" height="60">
        <ellipse cx="28" cy="42" rx="13" ry="9" fill="none" stroke="#3B7FC4" stroke-width="2.5"/>
        <line x1="41" y1="42" x2="41" y2="10" stroke="#3B7FC4" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <div class="nota-name">½ din întreagă</div>
      <div class="nota-beats">2 timpi</div>
    </div>
    <div class="nota-card">
      <div class="nota-durata">Pătrărime</div>
      <svg viewBox="0 0 60 60" width="60" height="60">
        <ellipse cx="28" cy="42" rx="13" ry="9" fill="#2A8C5A"/>
        <line x1="41" y1="42" x2="41" y2="10" stroke="#2A8C5A" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <div class="nota-name">¼ din întreagă</div>
      <div class="nota-beats">1 timp</div>
    </div>
    <div class="nota-card">
      <div class="nota-durata">Optime</div>
      <svg viewBox="0 0 60 60" width="60" height="60">
        <ellipse cx="25" cy="42" rx="12" ry="8" fill="#C9793A"/>
        <line x1="37" y1="42" x2="37" y2="10" stroke="#C9793A" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M37 10 Q52 18 44 28" fill="none" stroke="#C9793A" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <div class="nota-name">⅛ din întreagă</div>
      <div class="nota-beats">½ timp</div>
    </div>
    <div class="nota-card">
      <div class="nota-durata">16-ime</div>
      <svg viewBox="0 0 60 60" width="60" height="60">
        <ellipse cx="25" cy="42" rx="12" ry="8" fill="#B5404A"/>
        <line x1="37" y1="42" x2="37" y2="8" stroke="#B5404A" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M37 8 Q52 16 44 26" fill="none" stroke="#B5404A" stroke-width="2" stroke-linecap="round"/>
        <path d="M37 16 Q52 24 44 34" fill="none" stroke="#B5404A" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <div class="nota-name">¹⁄₁₆ din întreagă</div>
      <div class="nota-beats">¼ timp</div>
    </div>
  </div>
  <div class="lectie-bloc">
    <h3>Cum se împart timpii — vizual</h3>
    <p style="margin-bottom:12px">O notă întreagă = 4 timpi. Fiecare valoare mai mică este <strong>jumătatea</strong> celei de dinainte:</p>
    <div class="bara-proportii"><div class="bara-segment seg-1">Întreagă</div></div>
    <div class="bara-proportii">
      <div class="bara-segment seg-2a">Doime</div>
      <div class="bara-segment seg-2b">Doime</div>
    </div>
    <div class="bara-proportii">
      <div class="bara-segment seg-4a">Ptr.</div>
      <div class="bara-segment seg-4b">Ptr.</div>
      <div class="bara-segment seg-4c">Ptr.</div>
      <div class="bara-segment seg-4d">Ptr.</div>
    </div>
    <div class="bara-proportii">
      <div class="bara-segment seg-8" style="flex:2">Op</div>
      <div class="bara-segment seg-8" style="flex:2">Op</div>
      <div class="bara-segment seg-8" style="flex:2">Op</div>
      <div class="bara-segment seg-8" style="flex:2">Op</div>
      <div class="bara-segment seg-8" style="flex:2">Op</div>
      <div class="bara-segment seg-8" style="flex:2">Op</div>
      <div class="bara-segment seg-8" style="flex:2">Op</div>
      <div class="bara-segment seg-8" style="flex:2">Op</div>
    </div>
    <div class="bara-legenda" style="margin-top:12px">
      <div class="leg-item"><div class="leg-dot" style="background:#7C4E9B"></div>Întreagă (4 timpi)</div>
      <div class="leg-item"><div class="leg-dot" style="background:#3B7FC4"></div>Doime (2 timpi)</div>
      <div class="leg-item"><div class="leg-dot" style="background:#2A8C5A"></div>Pătrărime (1 timp)</div>
      <div class="leg-item"><div class="leg-dot" style="background:#C9793A"></div>Optime (½ timp)</div>
    </div>
  </div>
  <div class="lectie-bloc">
    <h3>Tabelul valorilor de note</h3>
    <table class="tabel-tipar">
      <thead>
        <tr><th>Notă</th><th>Simbol</th><th>Timpi în 4/4</th><th>Față de întreagă</th></tr>
      </thead>
      <tbody>
        <tr><td>Notă întreagă</td><td><span class="badge badge-nota">○</span></td><td><strong>4</strong> timpi</td><td>1 / 1</td></tr>
        <tr><td>Doime</td><td><span class="badge badge-b">♩ (goală)</span></td><td><strong>2</strong> timpi</td><td>1 / 2</td></tr>
        <tr><td>Pătrărime</td><td><span class="badge badge-p">♩ (plină)</span></td><td><strong>1</strong> timp</td><td>1 / 4</td></tr>
        <tr><td>Optime</td><td><span class="badge badge-o">♪</span></td><td><strong>½</strong> timp</td><td>1 / 8</td></tr>
        <tr><td>Șaisprezecime</td><td><span class="badge badge-s">♬</span></td><td><strong>¼</strong> timp</td><td>1 / 16</td></tr>
      </tbody>
    </table>
  </div>
  <div class="lectie-bloc">
    <h3>Nota cu punct ( . ) — regula de aur</h3>
    <p style="margin-bottom:14px">Când o notă are un <strong style="color:var(--gold)">punct</strong> lângă ea, aceasta câștigă <strong>jumătate din valoarea ei proprie</strong>.</p>
    <div style="background:rgba(201,147,58,0.12);border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:0.9rem;color:var(--gold);font-weight:500;text-align:center;letter-spacing:0.02em;">
      Notă cu punct = valoare × 1½
    </div>
    <div class="punct-grid">
      <div class="punct-card">
        <div class="pc-title">Doime cu punct</div>
        <div class="pc-formula">2 timpi + 1 timp = 3 timpi</div>
        <div class="punct-viz">
          <div class="pv-block" style="flex:2;background:#3B7FC4;opacity:0.8"></div>
          <span class="pv-plus">+</span>
          <div class="pv-block" style="flex:1;background:#3B7FC4;opacity:0.4"></div>
          <span class="pv-eq">= 3</span>
        </div>
      </div>
      <div class="punct-card">
        <div class="pc-title">Pătrărime cu punct</div>
        <div class="pc-formula">1 timp + ½ timp = 1½ timpi</div>
        <div class="punct-viz">
          <div class="pv-block" style="flex:2;background:#2A8C5A;opacity:0.8"></div>
          <span class="pv-plus">+</span>
          <div class="pv-block" style="flex:1;background:#2A8C5A;opacity:0.4"></div>
          <span class="pv-eq">= 1½</span>
        </div>
      </div>
      <div class="punct-card">
        <div class="pc-title">Optime cu punct</div>
        <div class="pc-formula">½ timp + ¼ timp = ¾ timp</div>
        <div class="punct-viz">
          <div class="pv-block" style="flex:2;background:#C9793A;opacity:0.8"></div>
          <span class="pv-plus">+</span>
          <div class="pv-block" style="flex:1;background:#C9793A;opacity:0.4"></div>
          <span class="pv-eq">= ¾</span>
        </div>
      </div>
      <div class="punct-card">
        <div class="pc-title">Întreagă cu punct</div>
        <div class="pc-formula">4 timpi + 2 timpi = 6 timpi</div>
        <div class="punct-viz">
          <div class="pv-block" style="flex:2;background:#7C4E9B;opacity:0.8"></div>
          <span class="pv-plus">+</span>
          <div class="pv-block" style="flex:1;background:#7C4E9B;opacity:0.4"></div>
          <span class="pv-eq">= 6</span>
        </div>
      </div>
    </div>
  </div>
  <div class="lectie-bloc">
    <h3>Exercițiu practic</h3>
    <p>Bate ritmic cu palma pe masă și numără cu voce tare: <strong style="color:var(--gold)">1-2-3-4</strong>. Acesta este un măsura de 4/4. Acum încearcă:<br><br>
    • O bătaie lungă pe 4 timpi → <strong>notă întreagă</strong><br>
    • Două bătăi a câte 2 timpi → <strong>două doimi</strong><br>
    • Patru bătăi scurte, una pe fiecare timp → <strong>patru pătrărime</strong><br>
    • Opt bătăi rapide, câte două pe timp → <strong>opt optimi</strong></p>
  </div>
</div>`,
};

export function deschideLectie(nr) {
  document.getElementById('lista-lectii').style.display = 'none';
  document.getElementById('continut-lectie').classList.add('activa');
  document.getElementById('text-lectie').innerHTML = CONTINUT_LECTII[nr];
  window.scrollTo(0, 0);
}

export function inapoiLaLectii() {
  document.getElementById('lista-lectii').style.display = 'block';
  document.getElementById('continut-lectie').classList.remove('activa');
}
