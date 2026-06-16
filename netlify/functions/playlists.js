// netlify/functions/playlists.js

const AIRTABLE_TOKEN   = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PLAYLISTS_TABLE = process.env.AIRTABLE_PLAYLISTS_TABLE_ID;

const AIRTABLE_API = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_PLAYLISTS_TABLE}`;

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

  const url = new URL(AIRTABLE_API);
  url.searchParams.append('sort[0][field]', 'order');
  url.searchParams.append('sort[0][direction]', 'asc');

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    return {
      statusCode: 502,
      headers: cors,
      body: JSON.stringify({ error: 'Airtable error' }),
    };
  }

  const data = await res.json();

  const showDrafts = process.env.SHOW_DRAFTS === 'true';

  const playlists = data.records
    .filter(r => r.fields.id && (!r.fields.hidden || showDrafts))
    .map(r => ({
      id: r.fields.id,
      tracklistName: r.fields.tracklistName || '',
      djName: r.fields.djName || null,
      djBio: {
        fr: r.fields.djBio_fr || null,
        en: r.fields.djBio_en || null,
      },
      tags: r.fields.tags
        ? r.fields.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [],
      photo: Array.isArray(r.fields.photo) ? (r.fields.photo[0]?.url || null) : (r.fields.photo || null),
      maxTracks: r.fields.maxTracks || 2,
      totalCapacity: r.fields.totalCapacity || 60,
      currentTotal: 0,
      mystery: r.fields.mystery || false,
      deadline: r.fields.deadline || null,
    }));

  return {
    statusCode: 200,
    headers: cors,
    body: JSON.stringify({ playlists }),
  };
};
