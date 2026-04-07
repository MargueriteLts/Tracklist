// netlify/functions/submit.js
const AIRTABLE_TOKEN   = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE   = process.env.AIRTABLE_TABLE_ID;
const MAX_PER_USER     = 2; // correspond à maxTracks dans data.js

const AIRTABLE_API = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}`;

const headers = {
  'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  // CORS — adapte l'origine à ton domaine en prod
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { uid, tracklist_id, pseudo, track, link } = body;

  // Validation minimale
  if (!uid || !tracklist_id || !pseudo || !track) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing fields' }) };
  }

  // ── VÉRIFICATION AUTHORITATIVE ─────────────────────────────
  // Compte les soumissions existantes pour cet uid + tracklist
  const filterFormula = encodeURIComponent(
    `AND({uid}="${uid}", {tracklist_id}="${tracklist_id}")`
  );
  const checkRes = await fetch(
    `${AIRTABLE_API}?filterByFormula=${filterFormula}&fields%5B%5D=uid`,
    { headers }
  );
  const checkData = await checkRes.json();

  if (!checkRes.ok) {
    return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: 'Airtable error' }) };
  }

  if (checkData.records.length >= MAX_PER_USER) {
    return {
      statusCode: 403,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'limit_reached', count: checkData.records.length }),
    };
  }

  // ── INSERTION ──────────────────────────────────────────────
  const insertRes = await fetch(AIRTABLE_API, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      fields: { uid, tracklist_id, pseudo, track, link: link || '' },
    }),
  });

  if (!insertRes.ok) {
    return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: 'Insert failed' }) };
  }

  const record = await insertRes.json();
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ success: true, id: record.id }),
  };
};