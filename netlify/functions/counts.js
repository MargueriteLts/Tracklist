// netlify/functions/counts.js

const AIRTABLE_TOKEN           = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID         = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PLAYLISTS_TABLE = process.env.AIRTABLE_PLAYLISTS_TABLE_ID;

const AIRTABLE_PLAYLISTS_API = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_PLAYLISTS_TABLE}`;

const headers = {
  'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
};

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

async function fetchAllUids(tableId) {
  const base = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`;
  let records = [];
  let offset = null;

  do {
    const url = new URL(base);
    url.searchParams.append('fields[]', 'uid');
    if (offset) url.searchParams.set('offset', offset);

    const res = await fetch(url.toString(), { headers });
    if (!res.ok) throw new Error(`Airtable error on table ${tableId}`);

    const data = await res.json();
    records = records.concat(data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  const uid = event.queryStringParameters?.uid || null;

  // Récupère toutes les playlists avec leur tableId dédié
  const playlistsUrl = new URL(AIRTABLE_PLAYLISTS_API);
  playlistsUrl.searchParams.append('fields[]', 'id');
  playlistsUrl.searchParams.append('fields[]', 'tableId');
  playlistsUrl.searchParams.append('fields[]', 'hidden');

  const playlistsRes = await fetch(playlistsUrl.toString(), { headers });
  if (!playlistsRes.ok) {
    return {
      statusCode: 502,
      headers: cors,
      body: JSON.stringify({ error: 'Airtable error' }),
    };
  }

  const playlistsData = await playlistsRes.json();
  const activePlaylists = playlistsData.records.filter(
    r => r.fields.id && r.fields.tableId && !r.fields.hidden
  );

  // Requête chaque table en parallèle
  const results = await Promise.allSettled(
    activePlaylists.map(r => fetchAllUids(r.fields.tableId).then(records => ({
      playlistId: r.fields.id,
      records,
    })))
  );

  const counts = {};
  const userCounts = {};

  results.forEach(result => {
    if (result.status !== 'fulfilled') return;
    const { playlistId, records } = result.value;

    counts[playlistId] = records.length;

    if (uid) {
      const userMatches = records.filter(r => r.fields.uid === uid).length;
      if (userMatches > 0) userCounts[playlistId] = userMatches;
    }
  });

  const response = { counts };
  if (uid) response.userCounts = userCounts;

  return {
    statusCode: 200,
    headers: cors,
    body: JSON.stringify(response),
  };
};
