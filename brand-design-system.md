# brand-design-system.md

## rôle du document

Ce fichier constitue la **source de vérité unique** pour :
- le branding visuel
- le design system UI
- le rendu final attendu
- l’implémentation front-end
- l’évaluation qualité des écrans

Aucune interface, composant, animation ou visuel ne doit être produit sans conformité stricte à ce document.

---

## positionnement produit & marque

### nature du produit
- produit digital premium
- système de performance, d’analyse ou d’assistance intelligente
- orientation produit, pas marketing

### ton global
- calme
- neutre
- précis
- silencieux
- confiant
- rationnel

La marque **ne cherche pas l’attention**.  
Elle impose une **présence maîtrisée et coûteuse**.

---

## philosophie de design

### principes fondamentaux
- chaque élément doit servir la lisibilité
- chaque décision doit réduire le bruit visuel
- moins d’éléments = plus de valeur perçue
- aucune décoration gratuite

### perception recherchée
- produit haut de gamme
- interface industrielle
- technologie fiable
- expérience posée et contrôlée

### perception à éviter absolument
- marketing
- émotion
- sport agressif
- futurisme
- expérimental
- décoratif

---

## système chromatique (verrouillé)

### palette officielle

| usage | couleur | variable tailwind |
|------|--------|-------------------|
| fond global | #ededed | `bg-background` |
| surface principale | #e5e5e5 | `bg-surface` |
| surface claire | #f2f2f2 | `bg-surface-light` |
| texte principal | #1f1f1f | `text-primary` |
| texte secondaire | #6f6f6f | `text-secondary` |
| texte muted | #8a8a8a | `text-muted` |
| accent unique | #0e8c5b | `bg-accent` / `text-accent` |

### règles strictes
- une seule couleur d’accent
- l’accent est réservé aux actions primaires
- aucune autre couleur autorisée
- aucun dégradé visible
- aucune saturation forte

---

## lumière, ombres & profondeur (neumorphism technique)

### principe fondamental
La profondeur est créée **uniquement par la lumière diffuse** sur un fond non-blanc.
Les valeurs ci-dessous sont **impératives** pour réussir l'effet Soft UI.

### implémentation technique des ombres (CSS Values)

**1. Shadow Outset (Cartes & Surfaces)**
Création du volume positif (élément qui sort).
`box-shadow: -6px -6px 14px rgba(255, 255, 255, 0.7), 6px 6px 14px rgba(163, 177, 198, 0.6);`

**2. Shadow Inset (Inputs & Zones enfoncées)**
Création du volume négatif (élément creusé).
`box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.7);`

**3. Bouton Primaire (Glow coloré)**
Pas d'ombre noire, mais une diffusion de la couleur d'accent.
`box-shadow: 0 4px 12px rgba(14, 140, 91, 0.3);`

### interdictions
- ombres dures (`#000000`)
- glow excessif
- contrastes marqués
- effets dramatiques

---

## surfaces & matériaux

### rendu attendu
- matte
- soft-touch
- silicone
- aluminium anodisé
- verre dépoli léger

### règles
- aucune texture visible
- aucun grain
- aucune brillance
- aucune réflexion miroir

Les surfaces doivent paraître **industrielles et silencieuses**.

---

## système de rayons (border-radius)

| élément | rayon | variable tailwind |
|--------|-------|-------------------|
| cartes principales | 24px | `rounded-card` |
| widgets / sous-cartes | 16px | `rounded-widget` |
| boutons | 14px | `rounded-btn` |
| pills | 999px | `rounded-full` |

### règle absolue
Aucun rayon arbitraire n’est autorisé.  
Tout élément doit correspondre exactement à ce système.

---

## typographie

### police principale
- **Famille :** Lufga
- **Source :** Local (`app/fonts/lufga`)
- **Style :** Sans-serif géométrique
- **Letter-spacing :** -0.02em (pour accentuer le côté technique/précis)

### hiérarchie typographique

| usage | taille | poids | tracking |
|-----|------|------|----------|
| titre | 16px | 500 | -0.02em |
| texte principal | 14px | 400 | -0.01em |
| secondaire | 13px | 400 | normal |
| meta | 12px | 400 | normal |

### règles strictes
- pas de titres massifs
- pas de capitales décoratives
- lisibilité avant identité

---

## layout & spacing

### structure
- grille stricte
- alignements mathématiques
- pas de flottement arbitraire

### espacements standards
- padding carte : 24px (`p-6`)
- gap éléments : 12–16px (`gap-3` / `gap-4`)
- sections verticales : 24–32px

### règle clé
Si un élément attire trop l’œil → il est trop grand ou trop contrasté.

---

## boutons & interactions

### bouton primaire
- fond : accent vert (`#0e8c5b`)
- texte : blanc
- rayon : 14px
- ombre : glow vert diffus (voir section ombres)
- aucune animation décorative

### boutons secondaires
- surface neutre (neumorphism outset)
- ombre douce
- interaction par micro-scale uniquement (`active:scale-95`)

---

## iconographie

### style
- minimal
- outline (trait fin 1.5px ou 2px)
- couleur : texte secondaire (`#6f6f6f`)

### règles
- pas d’illustrations
- pas de pictogrammes complexes
- pas de style cartoon

---

## configuration technique (Tailwind Mapping)

Le fichier `tailwind.config.js` doit impérativement étendre le thème ainsi pour respecter le design system :

```javascript
theme: {
  extend: {
    colors: {
      background: '#ededed',
      surface: '#e5e5e5',
      'surface-light': '#f2f2f2',
      accent: '#0e8c5b',
      primary: '#1f1f1f',
      secondary: '#6f6f6f',
      muted: '#8a8a8a',
    },
    borderRadius: {
      card: '24px',
      widget: '16px',
      btn: '14px',
    },
    fontFamily: {
      sans: ['Lufga', 'sans-serif'],
    },
    boxShadow: {
      'soft-out': '-6px -6px 14px rgba(255, 255, 255, 0.7), 6px 6px 14px rgba(163, 177, 198, 0.6)',
      'soft-in': 'inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.7)',
      'glow-accent': '0 4px 12px rgba(14, 140, 91, 0.3)',
    }
  }
}