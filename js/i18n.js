/* ══════════════════════════════════════════════════════════════
   i18n.js — Internationalisation (FR / EN)
   Doit être chargé avant ui.js et form.js.
══════════════════════════════════════════════════════════════ */

const TRANSLATIONS = {
  fr: {
    /* Nav */
    'nav.about': 'À propos',
    'nav.close': 'Fermer',

    /* Submit — navigation & formulaire */
    'back_btn':            '← Retour',
    'form.pseudo_label':   'Ton pseudo',
    'form.pseudo_tooltip': 'Ton pseudo sert à identifier tes soumissions. Caractères interdits : " \\ { }',
    'form.track_label':    'Nom de la track & artiste',
    'form.link_label':     'Lien de streaming',
    'form.optional':       '(facultatif)',
    'form.submit_btn':          'Envoyer',
    'form.submitting':          'Envoi…',
    'form.pseudo_placeholder':  'dj_shadow_fan',
    'form.track_placeholder':   'Track — Artiste',
    'form.link_placeholder':    'Spotify, SoundCloud, YouTube…',

    /* Validation & erreurs */
    'err.pseudo_required': 'Ton pseudo est requis.',
    'err.pseudo_short':    'Minimum 2 caractères.',
    'err.track_required':  "Indique le nom de la track et de l'artiste.",
    'err.track_short':     'Minimum 3 caractères.',
    'err.link_invalid':    'Le lien ne semble pas valide.',
    'err.pseudo_chars':    'Caractères interdits : " \\ { }',
    'err.limit_local':     'Tu as déjà envoyé le maximum de tracks pour cette tracklist.',
    'err.limit_server':    'Tu as déjà atteint la limite pour cette tracklist.',
    'err.submit_failed':   'Une erreur est survenue. Réessaie dans un instant.',

    /* Note de limite */
    'limit.single': "Il ne reste qu'une place — tu ne peux envoyer qu'une seule track.",
    'limit.plural': 'Tu peux envoyer maximum {max} track{s} sur cette tracklist',

    /* Cartes home */
    'card.full_cta':  'Tracklist complète',
    'card.sent':      '{max}/{max} tracks envoyées',
    'card.send_btn':  'Envoyer des tracks',
    'deadline':       'Deadline : 26.05.26',

    /* État vide */
    'empty.title': 'Pas encore de tracklists disponibles',
    'empty.sub':   'Revenez bientôt — de nouvelles tracklists arrivent prochainement.',

    /* Confirmation */
    'confirm.title':      'Track envoyée !',
    'confirm.can_more':   'Tu peux encore envoyer une track à cette tracklist.',
    'confirm.limit':      'Tu as atteint la limite de {max} tracks pour cette tracklist.',
    'confirm.btn_second': 'Envoyer une 2ème track',
    'confirm.btn_other':  'Envoyer une track à une autre tracklist',

    /* Modale limite */
    'modal.limit_title': 'Limite atteinte',
    'modal.limit_sub':   'Tu as déjà envoyé le maximum de tracks pour cette tracklist.',
    'modal.back_home':   'Retour à l\'accueil',

    /* Footer */
    'footer': 'TRACKLIST © 2026 — Tous droits réservés',

    /* About */
    'about.subtitle1':    'La musique avant tout.<br>Avant les noms, avant les followers,<br>avant les algorithmes qui te dictent qui tu dois aller voir.',
    'about.subparagraph': "Tracklist est né d'un constat simple : aujourd'hui le DJ est devenu une idole, omniprésente, non pas pour ses skills mais pour ses followers.<br><span class=\"red-text\">On regarde qui joue au lieu d'écouter ce qui est joué.</span>",
    'about.col1': "La musique passe au second plan, les lighteux·ses sont oublié·es, le VJ a complètement disparu des line-ups et les producteur·ices restent dans l'ombre alors que leurs tracks circulent.",
    'about.col2': "Avec Tracklist, on veut inverser ça. Donner de la visibilité aux producteur·ices. Remettre en valeur l'art du VJing. Et replacer au centre ce qui compte : le savoir-faire du DJ — pas son compte Instagram. Pour nous, le DJ n'est pas une star intouchable. C'est un technicien, un artisan, un chimiste du son. Quelqu'un qui assemble, transforme, raconte une histoire avec les morceaux des autres. C'est ça qu'on veut mettre en avant.",
    'about.col3': "Mais surtout, le cœur du projet, c'est vous. Le public. Ceux qui digg, écoutent et dansent. Ceux qui ont des pépites anciennes comme récentes cachées dans leurs playlists et qui n'attendent qu'une chose : les partager. Tracklist, c'est donner un espace à ces morceaux, les faire sortir de l'ombre et les voir prendre vie entre les mains d'un DJ.",
    'about.col4': "Alors on a imaginé un concept simple : le public propose des sons, on construit une tracklist collective, et un DJ a pour mission de la jouer, de la sublimer, de lui donner vie. Pas de zone de confort. Un challenge : composer avec vos choix, vos univers, vos surprises.",
    'about.col5': "Mais Tracklist ne s'arrête pas au son : on veut relancer le dialogue entre la musique et l'image en remettant le VJ aux côtés du DJ comme véritable partenaire de set. Chaque set est accompagné d'un visuel unique et devient une œuvre double, sonore et visuelle. Une expérience complète, vivante et immersive, construite à deux.",
    'about.infos': "Vous pouvez soumettre jusqu'à 2 tracks, sans compte.<br>Votre pseudo sera affiché dans le visuel accompagnant le set si votre track a été choisie.",
    'about.closing': "Parce que la musique, c'est un échange.<br>Pas un monologue.",
  },

  en: {
    /* Nav */
    'nav.about': 'About Us',
    'nav.close': 'Close',

    /* Submit */
    'back_btn':            '← Back',
    'form.pseudo_label':   'Your username',
    'form.pseudo_tooltip': 'Your username identifies your submissions. Forbidden characters: " \\ { }',
    'form.track_label':    'Track name & artist',
    'form.link_label':     'Streaming link',
    'form.optional':       '(optional)',
    'form.submit_btn':          'Send',
    'form.submitting':          'Sending…',
    'form.pseudo_placeholder':  'dj_shadow_fan',
    'form.track_placeholder':   'Track — Artist',
    'form.link_placeholder':    'Spotify, SoundCloud, YouTube…',

    /* Validation & errors */
    'err.pseudo_required': 'Your username is required.',
    'err.pseudo_short':    'Minimum 2 characters.',
    'err.track_required':  'Enter the track and artist name.',
    'err.track_short':     'Minimum 3 characters.',
    'err.link_invalid':    "This link doesn't look valid.",
    'err.pseudo_chars':    'Forbidden characters: " \\ { }',
    'err.limit_local':     "You've already sent the maximum tracks for this tracklist.",
    'err.limit_server':    "You've already reached the limit for this tracklist.",
    'err.submit_failed':   'Something went wrong. Try again in a moment.',

    /* Submission limit */
    'limit.single': "Only one spot left — you can only send one track.",
    'limit.plural': 'You can send up to {max} track{s} on this tracklist',

    /* Home cards */
    'card.full_cta':  'Tracklist full',
    'card.sent':      '{max}/{max} tracks sent',
    'card.send_btn':  'Send tracks',
    'deadline':       'Deadline: 26.05.26',

    /* Empty state */
    'empty.title': 'No tracklists available yet',
    'empty.sub':   'Come back soon — new tracklists are on their way.',

    /* Confirmation */
    'confirm.title':      'Track sent!',
    'confirm.can_more':   'You can send another track to this tracklist.',
    'confirm.limit':      "You've reached the limit of {max} tracks for this tracklist.",
    'confirm.btn_second': 'Send a 2nd track',
    'confirm.btn_other':  'Send a track to another tracklist',

    /* Modal limit */
    'modal.limit_title': 'Limit reached',
    'modal.limit_sub':   "You've already sent the maximum tracks for this tracklist.",
    'modal.back_home':   'Back to home',

    /* Footer */
    'footer': 'TRACKLIST © 2026 — All rights reserved',

    /* About */
    'about.subtitle1':    'Music first.<br>Before names, before followers,<br>before the algorithms telling you who to see.',
    'about.subparagraph': "Tracklist was born from a simple observation: today's DJ has become an idol — everywhere, not for their skills but for their follower count.<br><span class=\"red-text\">We watch who's playing instead of listening to what's being played.</span>",
    'about.col1': "Music takes a back seat, lighting designers are forgotten, VJs have all but disappeared from lineups, and producers stay in the shadows while their tracks go around.",
    'about.col2': "With Tracklist, we want to flip that. Give visibility to producers. Bring VJing back into the spotlight. And put what actually matters at the center: the DJ's craft — not their Instagram. For us, the DJ isn't an untouchable star. They're a technician, an artisan, a sound chemist — someone who assembles, transforms, tells a story with other people's tracks. That's what we want to put forward.",
    'about.col3': "But most of all, you are the heart of this project. The audience. The ones who dig, listen, and dance. The ones with hidden gems — old and new — in their playlists, just waiting to share them. Tracklist is about giving these tracks a space, pulling them out of the shadows and watching them come alive in a DJ's hands.",
    'about.col4': "So we came up with a simple concept: the audience submits tracks, we build a collective tracklist, and a DJ's mission is to play it, elevate it, bring it to life. No comfort zone. A challenge: compose with your choices, your worlds, your surprises.",
    'about.col5': "But Tracklist doesn't stop at sound: we want to restart the dialogue between music and image by placing the VJ back beside the DJ as a true set partner. Every set is accompanied by a unique visual and becomes a double work — sonic and visual. A complete, living, immersive experience, built by two.",
    'about.infos': "You can submit up to 2 tracks, no account needed.<br>Your username will appear in the set's visual if your track gets selected.",
    'about.closing': 'Because music is an exchange.<br>Not a monologue.',
  },
};

let currentLang = localStorage.getItem('lang') || 'fr';

function t(key, vars = {}) {
  const str = (TRANSLATIONS[currentLang] || TRANSLATIONS.fr)[key] || key;
  return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyTranslations();
  if (typeof renderHome === 'function') renderHome();
  // Met à jour la note de limite sans réinitialiser le formulaire
  if (typeof currentTl !== 'undefined' && currentTl) {
    const limitEl = document.getElementById('submit-limit-note');
    if (limitEl) {
      const spotsLeft = currentTl.totalCapacity - currentTl.currentTotal;
      limitEl.textContent = spotsLeft === 1
        ? t('limit.single')
        : t('limit.plural', { max: currentTl.maxTracks, s: currentTl.maxTracks > 1 ? 's' : '' });
    }
    const bioEl = document.getElementById('submit-dj-bio');
    if (bioEl && currentTl.djBio && typeof currentTl.djBio === 'object') {
      bioEl.textContent = currentTl.djBio[lang] || currentTl.djBio.fr;
    }
  }
}

function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  const aboutBtn = document.getElementById('nav-about-btn');
  if (aboutBtn && !aboutBtn.classList.contains('is-close')) {
    aboutBtn.textContent = t('nav.about');
  }
  document.querySelectorAll('.lang-option').forEach(btn => {
    const isActive = btn.dataset.lang === currentLang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });
}

applyTranslations();
