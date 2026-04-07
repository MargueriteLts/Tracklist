/* ══════════════════════════════════════════════════════════════
   ui.js — Rendu de l'interface et navigation
   Construit les cartes de la page home et gère les transitions.
══════════════════════════════════════════════════════════════ */

/* ── NAVIGATION ─────────────────────────────────────────────── */

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
  currentTl = null;
  renderHome();
  showPage('home');
}

/* ── HOME RENDER ─────────────────────────────────────────────── */

function renderHome() {
  const grid = document.getElementById('tracklist-grid');
  grid.innerHTML = '';

  TRACKLISTS.forEach(tl => {
    const userCount    = getUserCount(tl.id);
    const isFull       = tl.currentTotal >= tl.totalCapacity;
    const userDone     = userCount >= tl.maxTracks;
    const progressPct  = Math.min(100, (tl.currentTotal / tl.totalCapacity) * 100);
    const spotsLeft    = tl.totalCapacity - tl.currentTotal;
    const effectiveMax = Math.min(tl.maxTracks, userCount + spotsLeft);

    const card = document.createElement('div');
    card.className = 'tracklist-card';
    card.innerHTML = _buildCardHTML({ tl, isFull, userDone, userCount, progressPct, effectiveMax });
    grid.appendChild(card);
  });
}

/* Construit le HTML d'une carte (fonction privée, préfixe _) */
function _buildCardHTML({ tl, isFull, userDone, userCount, progressPct, effectiveMax }) {
  const progressHtml = isFull
    ? `<div class="card-full-label">Tracklist Complète</div>`
    : `<div class="progress-wrap">
         <div class="progress-bar" style="width:${progressPct}%"></div>
       </div>`;

  const photoHtml = tl.photo
    ? `<img src="${tl.photo}" alt="${tl.djName || 'DJ mystère'}" loading="lazy" />`
    : `<div class="card-placeholder"></div>`;

  const nameHtml = tl.mystery
    ? `<div class="dj-name" style="letter-spacing:0.25em; color:var(--text-muted)">X X X X X</div>`
    : `<div class="dj-name">${tl.djName}</div>`;

  const tagsHtml = `<div class="dj-tags">${tl.tags.map(t => '#' + t).join(' ')}</div>`;

  let ctaHtml;
  if (isFull) {
    ctaHtml = `<div class="sent-label" style="color:var(--text-dim)">Tracklist complète</div>`;
  } else if (userDone) {
    ctaHtml = `<div class="sent-label">${tl.maxTracks}/${tl.maxTracks} tracks envoyées</div>`;
  } else {
    ctaHtml = `
      <button class="btn btn-outline" onclick="openSubmit('${tl.id}')">
        Envoyer des tracks
        <span class="btn-counter">${userCount}/${effectiveMax}</span>
      </button>`;
  }

  return `
    ${progressHtml}
    <div class="card-body">
      ${photoHtml}
    </div>
    <div class="card-info">
      <div class="tracklist-name">${tl.tracklistName}</div>
      ${tagsHtml}
      ${nameHtml}
    </div>
    <div class="card-cta">
      ${ctaHtml}
    </div>`;
}

/* ── NAV SCROLL EFFECT ───────────────────────────────────────── */

window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 10);
});