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
  document.getElementById('submit-progress-pct').textContent   = Math.round(progressPct) + '%';
  document.getElementById('submit-tracklist-name').textContent = tl.tracklistName;
  document.getElementById('submit-dj-tags').textContent        = tl.tags.map(t => '#' + t).join(' ');
  document.getElementById('submit-dj-name').textContent        = tl.mystery ? 'X X X X X' : (tl.djName || '');
  const bio = (!tl.mystery && tl.djBio)
    ? (typeof tl.djBio === 'object' ? (tl.djBio[currentLang] || tl.djBio.fr) : tl.djBio)
    : '';
  document.getElementById('submit-dj-bio').textContent = bio;

  const photoEl = document.getElementById('submit-dj-photo');
  if (tl.mystery) {
    photoEl.style.display = 'none';
  } else {
    photoEl.style.display = '';
    photoEl.innerHTML = tl.photo ? `<img src="${tl.photo}" alt="${tl.djName || 'DJ'}" />` : '';
  }

  // Message de limite adapté au contexte
  document.getElementById('submit-limit-note').textContent = spotsLeft === 1
    ? t('limit.single')
    : t('limit.plural', { max: tl.maxTracks, s: tl.maxTracks > 1 ? 's' : '' });

  // Compteur de track (ex: "1/2" ou "2/2")
  document.getElementById('track-counter').textContent = `${userCount + 1}/${effectiveMax}`;

  // Réinitialiser le formulaire
  document.getElementById('input-pseudo').value = getLastPseudo();
  document.getElementById('input-track').value  = '';
  document.getElementById('input-link').value   = '';
  clearErrors();

  _showFormState();
  showPage('submit');
  if (!_restoringFromHistory) history.pushState({ page: 'submit', tlId }, '', `/submit/${tlId}`);
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

  if (!pseudo)                        { setError('pseudo', t('err.pseudo_required')); valid = false; }
  else if (pseudo.length < 2)         { setError('pseudo', t('err.pseudo_short'));    valid = false; }
  else if (/["\\{}]/.test(pseudo))    { setError('pseudo', t('err.pseudo_chars'));    valid = false; }

  if (!track)              { setError('track', t('err.track_required')); valid = false; }
  else if (track.length < 3) { setError('track', t('err.track_short')); valid = false; }

  if (link && !_isValidUrl(link)) { setError('link', t('err.link_invalid')); valid = false; }

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
    alert(t('err.limit_local'));
    return;
  }

  _setSubmitLoading(true);

  fetch('/.netlify/functions/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uid,
      tracklist_id:   currentTl.id,
      tracklist_name: currentTl.tracklistName,
      pseudo,
      track:          trackName,
      link:           link || '',
    }),
  })
  .then(async res => {
    const data = await res.json();

    if (res.status === 403 && data.error === 'limit_reached') {
      alert(t('err.limit_server'));
      _setSubmitLoading(false);
      goHome();
      return;
    }

    if (!res.ok) throw new Error(data.error || 'unknown');

    onSubmitSuccess(pseudo, trackName, link);
  })
  .catch(() => {
    _setSubmitLoading(false);
    onSubmitError();
  });
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
  setError('track', t('err.submit_failed'));
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
  document.getElementById('confirm-title').textContent      = t('confirm.title');
  document.getElementById('confirm-track-name').textContent = `« ${trackName} »`;
  document.getElementById('confirm-sub').textContent        = canSendMore
    ? t('confirm.can_more')
    : t('confirm.limit', { max: currentTl.maxTracks });

  const actionsEl = document.getElementById('confirm-actions');
  actionsEl.innerHTML = '';

  if (canSendMore) {
    const btn1       = document.createElement('button');
    btn1.className   = 'btn btn-solid';
    btn1.textContent = t('confirm.btn_second');
    btn1.onclick     = () => openSubmitSecond();
    actionsEl.appendChild(btn1);
  }

  const btn2       = document.createElement('button');
  btn2.className   = canSendMore ? 'btn btn-ghost' : 'btn btn-outline';
  btn2.textContent = t('confirm.btn_other');
  btn2.onclick     = () => goHome();
  actionsEl.appendChild(btn2);

  document.getElementById('form-state').style.display    = 'none';
  document.getElementById('confirm-state').style.display = 'block';
}

function _setSubmitLoading(isLoading) {
  const btn = document.getElementById('btn-submit');
  btn.textContent = isLoading ? t('form.submitting') : t('form.submit_btn');
  btn.disabled    = isLoading;
}