// netlify/functions/submit.js

const AIRTABLE_TOKEN           = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID         = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PLAYLISTS_TABLE = process.env.AIRTABLE_PLAYLISTS_TABLE_ID;
const MAX_PER_USER             = 2;

const AIRTABLE_PLAYLISTS_API = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_PLAYLISTS_TABLE}`;

const headers = {
  'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
  'Content-Type': 'application/json',
};

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {

  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  }

  // Parse du body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const { uid, tracklist_id, pseudo, track, link } = body;

  // Validation des champs requis
  if (!uid || !tracklist_id || !pseudo || !track) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ error: 'Missing fields' }),
    };
  }

  // Vérifie que la tracklist existe, n'est pas cachée, et récupère son tableId
  const filterPlaylist = encodeURIComponent(`AND({id}="${tracklist_id}", NOT({hidden}))`);
  const playlistCheck = await fetch(
    `${AIRTABLE_PLAYLISTS_API}?filterByFormula=${filterPlaylist}&fields%5B%5D=id&fields%5B%5D=tableId`,
    { headers }
  );
  if (!playlistCheck.ok) {
    return {
      statusCode: 502,
      headers: cors,
      body: JSON.stringify({ error: 'Playlist check failed' }),
    };
  }
  const playlistData = await playlistCheck.json();
  if (!playlistData.records.length) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ error: 'Invalid tracklist_id' }),
    };
  }

  const tableId = playlistData.records[0].fields.tableId;
  if (!tableId) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ error: 'No submissions table configured for this tracklist' }),
    };
  }

  const SUBMISSIONS_API = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`;

  // Validation des longueurs
  if (pseudo.length > 50 || track.length > 200 || (link && link.length > 500)) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ error: 'Fields too long' }),
    };
  }

  // Caractères interdits dans le pseudo (protège les formules Airtable)
  if (/["\\{}]/.test(pseudo)) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ error: 'Invalid characters in pseudo' }),
    };
  }

  // Vérification par uid ET par pseudo dans la table dédiée à cette tracklist
  const filterUid    = encodeURIComponent(`{uid}="${uid}"`);
  const filterPseudo = encodeURIComponent(`{pseudo}="${pseudo}"`);

  const [checkUid, checkPseudo] = await Promise.all([
    fetch(`${SUBMISSIONS_API}?filterByFormula=${filterUid}&fields%5B%5D=uid`, { headers }),
    fetch(`${SUBMISSIONS_API}?filterByFormula=${filterPseudo}&fields%5B%5D=pseudo`, { headers }),
  ]);

  if (!checkUid.ok || !checkPseudo.ok) {
    return {
      statusCode: 502,
      headers: cors,
      body: JSON.stringify({ error: 'Airtable check failed' }),
    };
  }

  const [dataUid, dataPseudo] = await Promise.all([
    checkUid.json(),
    checkPseudo.json(),
  ]);

  if (dataUid.records.length >= MAX_PER_USER) {
    return {
      statusCode: 403,
      headers: cors,
      body: JSON.stringify({ error: 'limit_reached', reason: 'uid' }),
    };
  }

  if (dataPseudo.records.length >= MAX_PER_USER) {
    return {
      statusCode: 403,
      headers: cors,
      body: JSON.stringify({ error: 'limit_reached', reason: 'pseudo' }),
    };
  }

  // ── INSERTION ─────────────────────────────────────────────
  // Note : le check et l'insert ne sont pas atomiques (limite Airtable).
  // Deux requêtes simultanées du même UID peuvent toutes deux passer le check.
  // Risque acceptable pour ce volume de trafic ; résoudre nécessiterait une DB SQL.
  const insertRes = await fetch(SUBMISSIONS_API, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      fields: {
        uid,
        pseudo,
        track,
        link: link || '',
      },
    }),
  });

  if (!insertRes.ok) {
    return {
      statusCode: 502,
      headers: cors,
      body: JSON.stringify({ error: 'Insert failed' }),
    };
  }

  const record = await insertRes.json();
  return {
    statusCode: 200,
    headers: cors,
    body: JSON.stringify({ success: true, id: record.id }),
  };
};
