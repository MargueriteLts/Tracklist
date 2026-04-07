/* ══════════════════════════════════════════════════════════════
   data.js — Configuration des tracklists
   C'est le seul fichier à modifier pour mettre à jour le contenu.
══════════════════════════════════════════════════════════════ */

const TRACKLISTS = [
  {
    id: 'tl1',
    tracklistName: 'NOM TRACKLIST 1',
    djName: 'NAME OF DJ1',
    djBio: 'Une bio courte qui décrit la vibe musicale du DJ — son univers, ses influences, l\'énergie qu\'il apporte.',
    tags: ['hardgroove', 'solaire'],
    photo: null,           // Chemin vers la photo, ex: 'photos/dj1.jpg'
    maxTracks: 2,          // Nb max de tracks par utilisateur
    totalCapacity: 60,     // Nb de tracks avant que la tracklist soit complète
    currentTotal: 60,      // Nb de tracks déjà soumises (mis à jour depuis le backend)
    mystery: false,
  },
  {
    id: 'tl2',
    tracklistName: 'NOM TRACKLIST 2',
    djName: 'NAME OF DJ2',
    djBio: 'Une bio courte qui décrit la vibe musicale du DJ — son univers, ses influences, l\'énergie qu\'il apporte.',
    tags: ['trance', 'bouncy', 'funky'],
    photo: null,
    maxTracks: 2,
    totalCapacity: 60,
    currentTotal: 34,
    mystery: false,
  },
  {
    id: 'tl3',
    tracklistName: 'NOM TRACKLIST 3',
    djName: null,          // null = DJ mystère
    djBio: null,
    tags: ['mentale', 'mélancolique'],
    photo: null,
    maxTracks: 2,
    totalCapacity: 60,
    currentTotal: 8,
    mystery: true,
  },
];