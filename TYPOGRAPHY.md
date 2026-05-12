# Système typographique — Tracklist

Toutes les valeurs typographiques sont définies dans `:root` de `tracklist.css`.
Aucune valeur brute (px, em, chiffre de weight) ne doit apparaître directement dans une classe — utiliser les variables ci-dessous.

---

## Polices

| Variable | Police | Usage |
|---|---|---|
| `--font-display` | owners | Titres, nav, boutons, labels UI |
| `--font-body` | neue-haas-unica | Corps de texte, inputs, métadonnées |

> Les alias `--font-primary` et `--font-secondary` sont conservés pour compatibilité avec les anciens fichiers.

---

## Tailles (`--fs-*`)

| Variable | Valeur | Utilisée pour |
|---|---|---|
| `--fs-hero` | clamp(52px → 80px) | Titre héro — *non utilisé actuellement* |
| `--fs-xl` | clamp(40px → 64px) | Nom de la tracklist sur la page submit |
| `--fs-h1` | 30px | Logo nav |
| `--fs-h2` | 22px | Titres de section, compteur de track, tags submit, sous-titres about |
| `--fs-h3` | 18px | Nom de la tracklist sur les cartes, nom du DJ (submit) |
| `--fs-nav` | 17px | Liens de navigation |
| `--fs-body` | 15px | Corps de texte (non utilisé directement car line-height global = 1) |
| `--fs-ui` | 13px | Boutons, tags, labels, bio DJ, colonnes about, erreurs |
| `--fs-label` | 11px | Labels de formulaire, bouton retour |
| `--fs-micro` | 10px | Footer |

---

## Graisses (`--fw-*`)

| Variable | Valeur | Usage typique |
|---|---|---|
| `--fw-black` | 700 | Titres principaux, logos, noms de tracklist |
| `--fw-bold` | 600 | Nom du DJ sur les cartes, compteur, boutons |
| `--fw-medium` | 500 | Nav (inactive), sous-titres closing, `.nav-link` |
| `--fw-regular` | 400 | Corps de texte, inputs, labels, tags, bios |
| `--fw-light` | 300 | Bouton fermeture `×` dans la nav |

---

## Espacement des lettres (`--ls-*`)

| Variable | Valeur | Usage |
|---|---|---|
| `--ls-tight` | -0.04em | Titres hero et display — condensé, impactant |
| `--ls-snug` | -0.03em | Titres de section, noms en uppercase |
| `--ls-normal` | -0.01em | Corps, inputs, boutons |
| `--ls-wide` | 0.1em | Footer uppercase |
| `--ls-wider` | 0.14em | Labels de formulaire uppercase |

---

## Couleurs typographiques

| Variable | Valeur | Règle d'utilisation |
|---|---|---|
| `--text` | `#f0f0f0` | **Contenu principal** : titres, inputs actifs, CTA, tags, contenu interactif |
| `--text-dim` | `#868686` | **Contenu secondaire** : noms de DJ sur les cartes, bios, labels de formulaire, colonnes about |
| `--text-muted` | `#5f5f5f` | **Métadonnées** : nav inactive, boutons ghost, footer, notes limites, bio sur submit |

---

## Line-height

`line-height: 1` est défini globalement dans le reset (`*`).
Aucune valeur de line-height n'est surchargée dans les classes individuelles.

---

## Hiérarchie visuelle des pages

```
Page home
  tracklist-name   --fs-h3 / --fw-black / --font-display   [blanc]
  dj-tags          --fs-ui  / --fw-regular / --font-body    [blanc]
  dj-name          --fs-ui  / --fw-bold / --font-display    [dim]

Page submit
  tracklist-name   --fs-xl  / --fw-black / --font-display   [blanc]  ← contraste max
  dj-tags          --fs-h2  / --fw-regular / --font-body    [blanc]
  dj-name          --fs-h3  / --fw-medium / --font-display  [dim]
  dj-bio           --fs-ui  / --fw-regular / --font-body    [muted]

Page about
  about-subtitle   --fs-h2  / --fw-black / --font-display   [blanc]  ← intro
  about-col        --fs-ui  / --fw-regular / --font-body    [dim]    ← colonnes
  about-subtitle   --fs-h3  / --fw-medium / --font-display  [dim]    ← closing

Nav
  nav-logo         --fs-h1  / --fw-black / --font-display   [blanc]
  nav-link         --fs-nav / --fw-medium / --font-display  [muted → blanc au hover]
```
