/* ══════════════════════════════════════════════════════════════
   main.js — Point d'entrée de l'application
══════════════════════════════════════════════════════════════ */

let currentTl = null;

getOrCreateUID();

// Charge les compteurs depuis Airtable avant de rendre la home
fetch('/.netlify/functions/counts')
  .then(r => r.json())
  .then(data => {
    const counts = data.counts || {};
    // Met à jour currentTotal pour chaque tracklist
    TRACKLISTS.forEach(tl => {
      if (counts[tl.id] !== undefined) {
        tl.currentTotal = counts[tl.id];
      }
    });
  })
  .catch(() => {
    // En cas d'erreur réseau, on utilise les valeurs de data.js
    console.warn('Impossible de charger les compteurs depuis Airtable.');
  })
  .finally(() => {
    renderHome();

    const path = window.location.pathname;
    if (path === '/about') {
      history.replaceState({ page: 'about' }, '', '/about');
      showPage('about');
    } else if (path.startsWith('/submit/')) {
      const id = path.slice('/submit/'.length);
      const tl = TRACKLISTS.find(t => t.id === id);
      if (tl) {
        history.replaceState({ page: 'submit', tlId: id }, '', path);
        _restoringFromHistory = true;
        openSubmit(id);
        _restoringFromHistory = false;
      } else {
        history.replaceState({ page: 'home' }, '', '/');
      }
    } else {
      history.replaceState({ page: 'home' }, '', '/');
    }
  });

window.addEventListener('popstate', e => {
  _restoringFromHistory = true;
  const state = e.state || { page: 'home' };
  if (state.page === 'submit' && state.tlId) {
    openSubmit(state.tlId);
  } else if (state.page === 'about') {
    showPage('about');
  } else {
    currentTl = null;
    renderHome();
    showPage('home');
  }
  _restoringFromHistory = false;
});