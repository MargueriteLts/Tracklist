/* ══════════════════════════════════════════════════════════════
   main.js — Point d'entrée de l'application
══════════════════════════════════════════════════════════════ */

let currentTl = null;

// Charge les compteurs depuis Airtable avant de rendre la home
const uid = getOrCreateUID();
fetch(`/.netlify/functions/counts?uid=${encodeURIComponent(uid)}`)
  .then(r => r.json())
  .then(data => {
    const counts = data.counts || {};
    TRACKLISTS.forEach(tl => {
      tl.currentTotal = counts[tl.id] ?? 0;
    });

    // Mémorise les comptes Airtable (source de vérité côté serveur)
    const userCounts = data.userCounts || {};
    TRACKLISTS.forEach(tl => {
      setServerCount(tl.id, userCounts[tl.id] || 0);
    });

    // Nettoie les soumissions locales si supprimées dans Airtable (mais garde lastPseudo)
    TRACKLISTS.forEach(tl => {
      const localSubmissions = loadData().submissions?.[tl.id]?.length ?? 0;
      if (localSubmissions > 0 && !userCounts[tl.id]) {
        clearSubmissions(tl.id);
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