/* ══════════════════════════════════════════════════════════════
   ui.js — Rendu de l'interface et navigation
   Construit les cartes de la page home et gère les transitions.
══════════════════════════════════════════════════════════════ */

/* ── NAVIGATION ─────────────────────────────────────────────── */

let previousPage = 'home';
let _restoringFromHistory = false;

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const btn = document.getElementById('nav-about-btn');
  if (btn) {
    const isAbout = name === 'about';
    btn.textContent = isAbout ? '×' : t('nav.about');
    btn.classList.toggle('is-close', isAbout);
    btn.setAttribute('aria-label', isAbout ? t('nav.close') : '');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleAbout() {
  const isAbout = document.getElementById('page-about').classList.contains('active');
  if (isAbout) {
    showPage(previousPage);
    if (!_restoringFromHistory) {
      const url = previousPage === 'submit' && currentTl ? `/submit/${currentTl.id}` : '/';
      history.pushState({ page: previousPage, tlId: currentTl ? currentTl.id : null }, '', url);
    }
  } else {
    const active = document.querySelector('.page.active');
    previousPage = active ? active.id.replace('page-', '') : 'home';
    showPage('about');
    if (!_restoringFromHistory) history.pushState({ page: 'about' }, '', '/about');
  }
}

function goHome() {
  currentTl = null;
  renderHome();
  showPage('home');
  if (!_restoringFromHistory) history.pushState({ page: 'home' }, '', '/');
}

/* ── SKELETON HOME ───────────────────────────────────────────── */

function renderSkeleton(count) {
  const grid = document.getElementById('tracklist-grid');
  grid.innerHTML = '';
  const n = count ?? TRACKLISTS.length;
  Array.from({ length: n }).forEach(() => {
    const card = document.createElement('div');
    card.className = 'tracklist-card';
    card.innerHTML = `
      <div class="card-info">
        <div class="skel skel-name"></div>
        <div class="skel skel-tags"></div>
        <div class="skel skel-dj"></div>
      </div>
      <div class="card-body skel-body"></div>
      <div class="card-cta">
        <div class="skel skel-btn"></div>
      </div>`;
    grid.appendChild(card);
  });
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
    ? ''
    : `<div class="progress-wrap-row">
         <div class="progress-wrap">
           <div class="progress-bar" style="width:${progressPct}%"></div>
         </div>
         <span class="progress-pct">${Math.round(progressPct)}%</span>
       </div>`;

  const photoHtml = tl.photo
    ? `<img src="${tl.photo}" alt="${tl.djName || 'DJ mystère'}" loading="lazy" />`
    : `<div class="card-placeholder"></div>`;

  const nameHtml = tl.mystery
    ? `<div class="dj-name dj-name--mystery">X X X X X</div>`
    : `<div class="dj-name">${tl.djName || ''}</div>`;

  const tagsHtml = `<div class="dj-tags">${tl.tags.map(t => '#' + t).join(' ')}</div>`;

  let ctaHtml;
  if (isFull) {
    ctaHtml = `<div class="sent-label sent-label--full">${t('card.full_cta')}</div>`;
  } else if (userDone) {
    ctaHtml = `<div class="sent-label">${t('card.sent', { max: tl.maxTracks })}</div>`;
  } else {
    ctaHtml = `
      <button class="btn btn-outline" onclick="openSubmit('${tl.id}')">
        ${t('card.send_btn')}
        <span class="btn-counter">${userCount}/${effectiveMax}</span>
      </button>`;
  }

  return `
    <div class="card-info">
      <div class="tracklist-name">${tl.tracklistName}</div>
      ${tagsHtml}
      ${nameHtml}
    </div>
    <div class="card-body">
      ${photoHtml}
    </div>
    <div class="card-cta">
      ${progressHtml}
      ${ctaHtml}
      <div class="deadline-label">${t('deadline')}</div>
    </div>`;
}
