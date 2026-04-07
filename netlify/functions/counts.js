// netlify/functions/counts.js

const AIRTABLE_TOKEN   = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE   = process.env.AIRTABLE_TABLE_ID;

const AIRTABLE_API = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}`;

const headers = {
  'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
};

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  // Récupère tous les enregistrements (champ tracklist_id uniquement)
  let records = [];
  let offset = null;

  do {
    const url = new URL(AIRTABLE_API);
    url.searchParams.set('fields[]', 'tracklist_id');
    if (offset) url.searchParams.set('offset', offset);

    const res = await fetch(url.toString(), { headers });
    if (!res.ok) {
      return {
        statusCode: 502,
        headers: cors,
        body: JSON.stringify({ error: 'Airtable error' }),
      };
    }

    const data = await res.json();
    records = records.concat(data.records);
    offset = data.offset; // null si dernière page
  } while (offset);

  // Compte par tracklist_id
  const counts = {};
  records.forEach(r => {
    const id = r.fields.tracklist_id;
    if (id) counts[id] = (counts[id] || 0) + 1;
  });

  return {
    statusCode: 200,
    headers: cors,
    body: JSON.stringify({ counts }),
  };
};