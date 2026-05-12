/* ══════════════════════════════════════════════════════════════
   storage.js — Persistence locale (fingerprint + pseudo)
   Gère l'identité anonyme de l'utilisateur et ses soumissions.
══════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'tracklist_v1';

/* Génère une empreinte légère à partir de signaux stables du navigateur */
function getFingerprint() {
  const signals = [
    navigator.language,
    navigator.platform,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
  ].join('|');

  let hash = 0;
  for (let i = 0; i < signals.length; i++) {
    hash = ((hash << 5) - hash) + signals.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/* Retourne l'UID existant ou en crée un nouveau (fingerprint + random) */
function getOrCreateUID() {
  const data = loadData();
  if (!data.uid) {
    data.uid = getFingerprint() + '_' + Math.random().toString(36).slice(2, 8);
    saveData(data);
  }
  return data.uid;
}

/* Lecture du localStorage */
function loadData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

/* Écriture dans le localStorage */
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* Retourne le nombre de tracks envoyées par cet utilisateur pour une tracklist.
   Prend le max entre le localStorage et le dernier compte confirmé par Airtable,
   pour rester cohérent dans les deux sens (suppression ou restauration dans Airtable). */
function getUserCount(tlId) {
  const data = loadData();
  const localCount  = data.submissions?.[tlId]?.length ?? 0;
  const serverCount = data.serverCounts?.[tlId] ?? 0;
  return Math.max(localCount, serverCount);
}

/* Mémorise le nombre de soumissions confirmées par Airtable pour une tracklist */
function setServerCount(tlId, count) {
  const data = loadData();
  if (!data.serverCounts) data.serverCounts = {};
  data.serverCounts[tlId] = count;
  saveData(data);
}

/* Enregistre une soumission localement */
function recordSubmission(tlId, pseudo, trackName, link) {
  const data = loadData();
  if (!data.submissions)       data.submissions = {};
  if (!data.submissions[tlId]) data.submissions[tlId] = [];
  data.submissions[tlId].push({ pseudo, trackName, link, ts: Date.now() });
  data.lastPseudo = pseudo;
  saveData(data);
}

/* Supprime les soumissions d'une tracklist du localStorage */
function clearSubmissions(tlId) {
  const data = loadData();
  if (data.submissions?.[tlId]) {
    delete data.submissions[tlId];
    saveData(data);
  }
}

/* Retourne le dernier pseudo utilisé (pour pré-remplir le champ) */
function getLastPseudo() {
  return loadData().lastPseudo || '';
}