/* ══════════════════════════════════════════════════════════════
   form.js — Formulaire de soumission
   Gère l'ouverture, la validation, l'envoi et les états de confirmation.
══════════════════════════════════════════════════════════════ */

/* ── OUVERTURE DE LA PAGE SUBMIT ─────────────────────────────── */

function openSubmit(tlId) {
  const tl = TRACKLISTS.find(t => t.id === tlId);
  if (!tl) return;
  currentTl = tl;

  const userCount    = getUserCount(tl.id);
  const spotsLeft    = tl.totalCapacity - tl.currentTotal;
  const effectiveMax = Math.min(tl.maxTracks, userCount + spotsLeft);
  const progressPct  = Math.min(100, (tl.currentTotal / tl.totalCapacity) * 100);

  // Remplir le header
  document.getElementById('submit-progress-bar').style.width   = progressPct + '%';
  document.getElementById('submit-tracklist-name').textContent = tl.tracklistName;
  document.getElementById('submit-dj-tags').textContent        = tl.tags.map(t => '#' + t).join(' ');
  document.getElementById('submit-dj-name').textContent        = tl.mystery ? 'X X X X X' : tl.djName;
  document.getElementById('submit-dj-bio').textContent         = (!tl.mystery && tl.djBio) ? tl.djBio : '';

  // Message de limite adapté au contexte
  document.getElementById('submit-limit-note').textContent = spotsLeft === 1
    ? 'Il ne reste qu\'une place dans cette tracklist — tu ne peux envoyer qu\'une seule track.'
    : `Tu peux envoyer maximum ${tl.maxTracks} track${tl.maxTracks > 1 ? 's' : ''} sur cette tracklist`;

  // Compteur de track (ex: "1/2" ou "2/2")
  document.getElementById('track-counter').textContent = `${userCount + 1}/${effectiveMax}`;

  // Réinitialiser le formulaire
  document.getElementById('input-pseudo').value = getLastPseudo();
  document.getElementById('input-track').value  = '';
  document.getElementById('input-link').value   = '';
  clearErrors();

  _showFormState();
  showPage('submit');
}

/* ── VALIDATION ──────────────────────────────────────────────── */

function clearErrors() {
  ['pseudo', 'track', 'link'].forEach(field => {
    document.getElementById('error-' + field).textContent = '';
    document.getElementById('input-' + field).classList.remove('error');
  });
}

function setError(field, msg) {
  document.getElementById('error-' + field).textContent = msg;
  document.getElementById('input-' + field).classList.add('error');
}

function validateForm() {
  clearErrors();
  let valid = true;

  const pseudo = document.getElementById('input-pseudo').value.trim();
  const track  = document.getElementById('input-track').value.trim();
  const link   = document.getElementById('input-link').value.trim();

  if (!pseudo)              { setError('pseudo', 'Ton pseudo est requis.'); valid = false; }
  else if (pseudo.length < 2) { setError('pseudo', 'Minimum 2 caractères.'); valid = false; }

  if (!track)              { setError('track', "Indique le nom de la track et de l'artiste."); valid = false; }
  else if (track.length < 3) { setError('track', 'Minimum 3 caractères.'); valid = false; }

  if (link && !_isValidUrl(link)) { setError('link', 'Le lien ne semble pas valide.'); valid = false; }

  return valid;
}

function _isValidUrl(str) {
  try { new URL(str); return true; } catch { return false; }
}

/* ── SOUMISSION ──────────────────────────────────────────────── */

function handleSubmit(e) {
  e.preventDefault();
  if (!currentTl)        return;
  if (!validateForm())   return;

  const pseudo    = document.getElementById('input-pseudo').value.trim();
  const trackName = document.getElementById('input-track').value.trim();
  const link      = document.getElementById('input-link').value.trim();
  const uid       = getOrCreateUID();

  // Vérification côté client (double sécurité)
  if (getUserCount(currentTl.id) >= currentTl.maxTracks) {
    alert('Tu as déjà envoyé le maximum de tracks pour cette tracklist.');
    return;
  }

  _setSubmitLoading(true);

  // ── ENVOI VERS LE BACKEND ────────────────────────────────
  // Décommente et configure ce bloc quand Airtable est prêt :

  fetch('/.netlify/functions/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uid,
      tracklist_id: currentTl.id,
      pseudo,
      track: trackName,
      link: link || '',
    }),
  })
  .then(async res => {
    const data = await res.json();
    if (res.status === 403 && data.error === 'limit_reached') {
      // Cas de désync localStorage/Airtable — on met à jour le local
      alert('Tu as déjà atteint la limite pour cette tracklist.');
      goHome();
      return;
    }
    if (!res.ok) throw new Error(data.error || 'unknown');
    onSubmitSuccess(pseudo, trackName, link);
  })
  .catch(() => onSubmitError());
}

function onSubmitSuccess(pseudo, trackName, link) {
  recordSubmission(currentTl.id, pseudo, trackName, link);

  // Mise à jour optimiste du total (avant rechargement depuis backend)
  currentTl.currentTotal = Math.min(currentTl.totalCapacity, currentTl.currentTotal + 1);

  const userCount   = getUserCount(currentTl.id);
  const spotsLeft   = currentTl.totalCapacity - currentTl.currentTotal;
  const canSendMore = userCount < currentTl.maxTracks && spotsLeft > 0;

  _showConfirmState(trackName, canSendMore);
  _setSubmitLoading(false);
}

function onSubmitError() {
  _setSubmitLoading(false);
  setError('track', 'Une erreur est survenue. Réessaie dans un instant.');
}

/* ── 2ÈME SOUMISSION (même tracklist) ───────────────────────── */

function openSubmitSecond() {
  const userCount    = getUserCount(currentTl.id);
  const spotsLeft    = currentTl.totalCapacity - currentTl.currentTotal;
  const effectiveMax = Math.min(currentTl.maxTracks, userCount + spotsLeft);

  document.getElementById('track-counter').textContent = `${userCount + 1}/${effectiveMax}`;
  document.getElementById('input-pseudo').value        = getLastPseudo();
  document.getElementById('input-track').value         = '';
  document.getElementById('input-link').value          = '';
  clearErrors();

  _showFormState();
}

/* ── HELPERS PRIVÉS ─────────────────────────────────────────── */

function _showFormState() {
  document.getElementById('form-state').style.display    = 'block';
  document.getElementById('confirm-state').style.display = 'none';
}

function _showConfirmState(trackName, canSendMore) {
  document.getElementById('confirm-title').textContent      = 'Track envoyée !';
  document.getElementById('confirm-track-name').textContent = `« ${trackName} »`;
  document.getElementById('confirm-sub').textContent        = canSendMore
    ? 'Tu peux encore envoyer une track à cette tracklist.'
    : `Tu as atteint la limite de ${currentTl.maxTracks} tracks pour cette tracklist.`;

  const actionsEl = document.getElementById('confirm-actions');
  actionsEl.innerHTML = '';

  if (canSendMore) {
    const btn1       = document.createElement('button');
    btn1.className   = 'btn btn-solid';
    btn1.textContent = 'Envoyer une 2ème track';
    btn1.onclick     = () => openSubmitSecond();
    actionsEl.appendChild(btn1);
  }

  const btn2       = document.createElement('button');
  btn2.className   = 'btn btn-ghost';
  btn2.textContent = 'Envoyer une track à une autre tracklist';
  btn2.onclick     = () => goHome();
  actionsEl.appendChild(btn2);

  document.getElementById('form-state').style.display    = 'none';
  document.getElementById('confirm-state').style.display = 'block';
}

function _setSubmitLoading(isLoading) {
  const btn = document.getElementById('btn-submit');
  btn.textContent = isLoading ? 'Envoi…' : 'Envoyer';
  btn.disabled    = isLoading;
}