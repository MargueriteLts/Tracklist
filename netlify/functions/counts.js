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

  const uid = event.queryStringParameters?.uid || null;

  // Récupère tous les enregistrements avec tracklist_id et uid
  let records = [];
  let offset = null;

  do {
    const url = new URL(AIRTABLE_API);
    url.searchParams.append('fields[]', 'tracklist_id');
    url.searchParams.append('fields[]', 'uid');
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
    offset = data.offset;
  } while (offset);

  // Compte global par tracklist_id + compte par uid si fourni
  const counts = {};
  const userCounts = {};

  records.forEach(r => {
    const tlId = r.fields.tracklist_id;
    if (!tlId) return;
    counts[tlId] = (counts[tlId] || 0) + 1;
    if (uid && r.fields.uid === uid) {
      userCounts[tlId] = (userCounts[tlId] || 0) + 1;
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