/* ══════════════════════════════════════════════════════════════
   main.js — Point d'entrée de l'application
   Déclare l'état global et initialise l'app au chargement.
══════════════════════════════════════════════════════════════ */

/* ── ÉTAT GLOBAL ─────────────────────────────────────────────── */
// currentTl est déclaré ici car il est lu et écrit par ui.js et form.js
let currentTl = null;

/* ── INITIALISATION ──────────────────────────────────────────── */
getOrCreateUID(); // Crée l'UID anonyme dès la première visite
renderHome();     // Affiche les cartes de la page home