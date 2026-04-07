// netlify/functions/submit.js

const AIRTABLE_TOKEN   = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE   = process.env.AIRTABLE_TABLE_ID;
const MAX_PER_USER     = 2;

const AIRTABLE_API = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}`;

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

  const { uid, tracklist_id, tracklist_name, pseudo, track, link } = body;

  // Validation des champs requis
  if (!uid || !tracklist_id || !tracklist_name || !pseudo || !track) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ error: 'Missing fields' }),
    };
  }

  // ── VÉRIFICATION AUTHORITATIVE ────────────────────────────
  // Compte les soumissions existantes pour cet uid + tracklist
  //const filterFormula = encodeURIComponent(
  //  `AND({uid}="${uid}", {tracklist_id}="${tracklist_id}")`
  //);

  //const checkRes = await fetch(
  //  `${AIRTABLE_API}?filterByFormula=${filterFormula}&fields%5B%5D=uid`,
  //  { headers }
  //);

  //if (!checkRes.ok) {
  //  return {
  //    statusCode: 502,
  //    headers: cors,
  //    body: JSON.stringify({ error: 'Airtable check failed' }),
  //  };
  //}

  //const checkData = await checkRes.json();

  //if (checkData.records.length >= MAX_PER_USER) {
  //  return {
  //    statusCode: 403,
  //    headers: cors,
  //    body: JSON.stringify({
  //      error: 'limit_reached',
  //      count: checkData.records.length,
  //    }),
  //  };
  //}

  // Vérification par uid ET par pseudo
  const filterUid = encodeURIComponent(
    `AND({uid}="${uid}", {tracklist_id}="${tracklist_id}")`
  );
  const filterPseudo = encodeURIComponent(
    `AND({pseudo}="${pseudo}", {tracklist_id}="${tracklist_id}")`
  );

  const [checkUid, checkPseudo] = await Promise.all([
    fetch(`${AIRTABLE_API}?filterByFormula=${filterUid}&fields%5B%5D=uid`, { headers }),
    fetch(`${AIRTABLE_API}?filterByFormula=${filterPseudo}&fields%5B%5D=pseudo`, { headers }),
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
  const insertRes = await fetch(AIRTABLE_API, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      fields: {
        uid,
        tracklist_id,
        tracklist_name,
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