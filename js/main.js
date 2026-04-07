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
  });