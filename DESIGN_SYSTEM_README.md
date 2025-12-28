# Design System Genesis - Documentation de Référence

## 📋 Vue d'ensemble

Ce document JSON (`DESIGN_SYSTEM_GENESIS.json`) sert de **référence absolue** pour le développement, le design et le marketing du projet Genesis. Il fusionne l'esthétique "Deep Tech" avec l'accessibilité de l'expérience utilisateur moderne.

## 🎯 Brand Identity

### Positioning
**Coaching 3.0 : L'ultra-personnalisation par la science des données.**

### Core Narrative
L'évolution de la complexité vers la simplicité. Chaque humain est une signature biologique et environnementale unique.

### Mission
Décoder l'individu dans ses profondeurs pour créer une adhérence parfaite au changement.

### Values
- Unique
- Scientifique
- Immersif
- Simplificateur

## 🎨 Visual System

### Color Palette

#### Base Colors
- **Obsidian Black**: `#050505` - Fond principal
- **Titanium White**: `#FDFDFD` - Texte principal

#### Accent Colors (Deep Tech)
- **Electric Emerald**: `#00FFC3` - Accent principal tech
- **Deep Cyan**: `#008B8B` - Accent secondaire
- **Synapse Glow**: `rgba(0, 255, 195, 0.4)` - Effets de lueur

#### Current Implementation
- **Accent Blue**: `#8FA6B8` - Actuellement utilisé
- **Accent Strong**: `#AFC4D6`
- **Text Main**: `#F2F2F2`
- **Text Muted**: `#9CA3AF`

> **Note**: Les couleurs Deep Tech sont ajoutées comme variables CSS mais peuvent être intégrées progressivement selon les besoins.

### Typography

#### Référence Design System
- **Titles**: Neue Lexend Pro (Light/Thin) - Pour l'élégance technologique
- **Body**: Inter (Regular) - Pour une lisibilité optimale
- **Functional**: JetBrains Mono - Pour les chiffres et données scientifiques

#### Implémentation Actuelle
- **Titles**: Michroma (COACHING 3.0), Sulphur Point (titres de sections)
- **Body**: Sulphur Point (Regular/Light)
- **Logo**: Good Times (GENESIS) + Zalando Sans Expanded (era)

> **Note**: Les polices Neue Lexend Pro, Inter et JetBrains Mono ne sont pas encore installées. Elles peuvent être ajoutées au dossier `/public/fonts/` si souhaité.

## 🌐 Web Experience Architecture

### UX Concept
**Le site est le système. L'utilisateur doit se sentir scanné et compris dès le premier scroll.**

### Experience Steps (4 Cartes Conceptuelles)

#### Card 1: La Genèse (L'Individu)
- **Content**: Définition de l'unicité. Chaque être est une signature biologique irrépétible.
- **Visual**: Profil 3D sombre avec flux de données émeraudes émanant de l'intérieur.
- **Copywriting**: "Votre génétique est votre code source. Nous l'avons déchiffré."

#### Card 2: L'Analyse (La Complexité)
- **Content**: Croisement des données scientifiques : biologie, environnement, psychologie.
- **Visual**: Chaos ordonné. Des milliers de lignes convergent vers une structure stable.
- **Copywriting**: "La science ne devine pas. Elle mesure."

#### Card 3: La Méthode (L'Adhérence)
- **Content**: L'ultra-personnalisation menant à l'adhérence sur la signature unique.
- **Visual**: Schématisation symbolique montrant l'ajustement parfait entre un individu et son milieu.
- **Logic**: Calcul d'adhérence : $A = \int (G \times E) dt$ (Génétique × Environnement sur le temps).

#### Card 4: Le Quotidien (Le Coaching 3.0)
- **Content**: Le système devient une expérience fluide et simple.
- **Visual**: UI de santé épurée, cartes 'Glass' flottant sur des visuels humains inspirants.
- **Copywriting**: "L'excellence devient votre état naturel."

## 🔧 Technical Specifications

### Animations
- **Type**: Scroll-triggered (GSAP / Framer Motion)
- **Transition Style**: Morphing d'objets (la cellule devient une donnée, la donnée devient une interface)
- **Parallax Intensity**: Forte sur les particules de background pour créer une immersion 3D

### Interaction
- **Magnetic Cursor**: Le curseur attire les points de données proches
- **Haptic Feedback**: Simulé par des micro-vibrations visuelles lors du clic sur les données critiques

### Current Implementation
- **Hero**: HeroPinned avec lecture progressive contrôlée par scroll
- **Animations**: Framer Motion avec IntersectionObserver
- **Particles**: ParticlesEkklo avec particules bleues animées
- **Background**: Dégradé doré animé avec noise overlay pour réduire le banding

## 📢 Marketing Instructions

### Tone of Voice
Expert, avant-gardiste, calme et profondément humain.

### Target Emotion
Le sentiment d'être enfin 'vu' et compris scientifiquement.

### Call to Action
- **Référence**: "Démarrer votre séquençage."
- **Actuel**: "Lancer le diagnostic IPT →"

## 🎭 Design Principles

### Contrast Narrative
Le passage du noir profond (Séquence 1-2) au blanc translucide/lumineux (Séquence 4-5) doit symboliser l'arrivée à la clarté.

### Signature Visuelle
La ligne de vie (ou flux de données) doit être le "fil d'Ariane" qui guide l'œil tout au long de l'expérience.

### Adherence Graphique
Les éléments ne doivent pas sembler posés sur le site, mais "ancrés" dedans, comme une seconde peau technologique.

## 📝 Notes d'Implémentation

### Variables CSS Ajoutées
Les nouvelles couleurs Deep Tech sont disponibles comme variables CSS :
- `--electric-emerald`: `#00FFC3`
- `--deep-cyan`: `#008B8B`
- `--synapse-glow`: `rgba(0, 255, 195, 0.4)`

### Intégration Progressive
Ce design system peut être intégré progressivement :
1. Conserver l'implémentation actuelle (fonctionnelle et stable)
2. Ajouter les nouvelles couleurs comme options
3. Tester l'intégration des nouvelles polices si disponibles
4. Implémenter les 4 cartes d'expérience selon les besoins

### Fichiers de Référence
- `DESIGN_SYSTEM_GENESIS.json` - JSON structuré complet
- `DESIGN_SYSTEM_README.md` - Cette documentation
- Variables CSS dans `app/globals.css` - Variables disponibles pour utilisation











