'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { BarChart3, ArrowLeft, ChevronDown, Copy, Check } from 'lucide-react';
import GenesisAssistant from '@/components/GenesisAssistant';

// --- TYPES ---
type Gender = 'male' | 'female';
type Method = 'navy' | 'skinfold';

export default function BodyFatCalculator() {
  // --- STATES ---
  const [method, setMethod] = useState<Method>('navy');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  
  const [chest, setChest] = useState('');
  const [abdominal, setAbdominal] = useState('');
  const [thigh, setThigh] = useState('');
  const [triceps, setTriceps] = useState('');
  const [suprailiac, setSuprailiac] = useState('');
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false); // État pour le bouton copier
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const [result, setResult] = useState<{
    bodyFat: number;
    fatMass: number;
    leanMass: number;
    category: string;
    categoryDesc: string;
    color: string;
    marginOfError: string;
    methodUsed: string;
    warnings: string[];
  } | null>(null);

  // --- US NAVY METHOD (Hodgdon & Beckett 1984) - OPTION B (MÉTRIQUE) ---
  const calculateNavy = (w: number, h: number, n: number, wa: number, hi: number, a: number): number => {
    let density: number;
    // Utilisation des constantes pour les mesures en CM (Metric) pour obtenir la Densité Corporelle
    if (gender === 'male') {
      density = 1.0324 - 0.19077 * Math.log10(wa - n) + 0.15456 * Math.log10(h);
    } else {
      density = 1.29579 - 0.35004 * Math.log10(wa + hi - n) + 0.22100 * Math.log10(h);
    }
    // Conversion Densité -> Body Fat % via l'équation de Siri
    return (495 / density) - 450;
  };

  // --- JACKSON-POLLOCK 3-SITE (1978/1980) ---
  const calculateSkinfold = (sum3: number, a: number): number => {
    let bodyDensity: number;
    if (gender === 'male') {
      bodyDensity = 1.10938 - (0.0008267 * sum3) + (0.0000016 * (sum3 ** 2)) - (0.0002574 * a);
    } else {
      bodyDensity = 1.0994921 - (0.0009929 * sum3) + (0.0000023 * (sum3 ** 2)) - (0.0001392 * a);
    }
    const bf = ((4.95 / bodyDensity) - 4.50) * 100; // Siri equation
    return bf;
  };

  // --- CATÉGORISATION ACE STANDARDS ---
  const getCategory = (bf: number, sex: Gender): { category: string; desc: string; color: string } => {
    if (sex === 'male') {
      if (bf < 2) return { category: 'DANGEREUX', desc: 'Sous minimum essentiel (risque hormonal)', color: 'from-red-50 to-red-100/50' };
      if (bf < 6) return { category: 'ESSENTIEL', desc: 'Graisse vitale minimale', color: 'from-orange-50 to-orange-100/50' };
      if (bf < 14) return { category: 'ATHLÈTE', desc: 'Performance élite (sport haut niveau)', color: 'from-yellow-50 to-yellow-100/50' };
      if (bf < 18) return { category: 'FITNESS', desc: 'Forme optimale santé/performance', color: 'from-emerald-50 to-emerald-100/50' };
      if (bf < 25) return { category: 'ACCEPTABLE', desc: 'Santé générale (population moyenne)', color: 'from-blue-50 to-blue-100/50' };
      return { category: 'OBÉSITÉ', desc: 'Risques cardiométaboliques élevés', color: 'from-slate-50 to-slate-100/50' };
    } else {
      if (bf < 10) return { category: 'DANGEREUX', desc: 'Sous minimum essentiel (aménorrhée)', color: 'from-red-50 to-red-100/50' };
      if (bf < 14) return { category: 'ESSENTIEL', desc: 'Graisse vitale minimale', color: 'from-orange-50 to-orange-100/50' };
      if (bf < 21) return { category: 'ATHLÈTE', desc: 'Performance élite (sport haut niveau)', color: 'from-yellow-50 to-yellow-100/50' };
      if (bf < 25) return { category: 'FITNESS', desc: 'Forme optimale santé/performance', color: 'from-emerald-50 to-emerald-100/50' };
      if (bf < 32) return { category: 'ACCEPTABLE', desc: 'Santé générale (population moyenne)', color: 'from-blue-50 to-blue-100/50' };
      return { category: 'OBÉSITÉ', desc: 'Risques cardiométaboliques élevés', color: 'from-slate-50 to-slate-100/50' };
    }
  };

  // --- ZONE OPTIMALE ---
  const getOptimalZone = (sex: Gender): { range: string; desc: string; rationale: string } => {
    if (sex === 'male') {
      return { range: '14-17%', desc: 'Fitness Optimal', rationale: 'Équilibre performance/santé/longévité' };
    } else {
      return { range: '21-24%', desc: 'Fitness Optimal', rationale: 'Santé hormonale + performance durable' };
    }
  };

  // --- CALCUL PRINCIPAL ---
  const calculateBodyFat = () => {
    setCopied(false);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (!w || !h || !a) return;

    let bf: number;
    let methodName: string;
    let marginError: string;

    if (method === 'navy') {
      const n = parseFloat(neck);
      const wa = parseFloat(waist);
      const hi = parseFloat(hips);

      if (!n || !wa || (gender === 'female' && !hi)) return;

      bf = calculateNavy(w, h, n, wa, hi, a);
      methodName = 'US Navy (Hodgdon & Beckett 1984)';
      marginError = '±3-5%';

    } else {
      let sum3: number;
      if (gender === 'male') {
        const ch = parseFloat(chest);
        const ab = parseFloat(abdominal);
        const th = parseFloat(thigh);
        if (!ch || !ab || !th) return;
        sum3 = ch + ab + th;
      } else {
        const tr = parseFloat(triceps);
        const su = parseFloat(suprailiac);
        const th = parseFloat(thigh);
        if (!tr || !su || !th) return;
        sum3 = tr + su + th;
      }
      bf = calculateSkinfold(sum3, a);
      methodName = 'Jackson-Pollock 3-Site (1978)';
      marginError = '±3-4%';
    }

    const minBF = gender === 'male' ? 3 : 10;
    const maxBF = 60;
    if (bf < minBF) bf = minBF;
    if (bf > maxBF) bf = maxBF;

    const { category, desc, color } = getCategory(bf, gender);
    const fm = (w * bf) / 100;
    const lm = w - fm;

    // WARNINGS SCIENTIFIQUES
    const warnings: string[] = [];
    const bmi = w / ((h / 100) ** 2);
    
    if (bmi < 18.5) warnings.push('IMC <18.5 : Formules anthropométriques moins précises pour profils sous-poids. DEXA recommandé.');
    else if (bmi > 35) warnings.push('IMC >35 : Formules sous-estiment BF% chez obésité sévère (±7-10% erreur). Scan DEXA gold standard.');
    
    if (method === 'navy') {
      const wa = parseFloat(waist);
      const whr = wa / h;
      if (whr > 0.6) warnings.push('Ratio Taille/Hauteur >0.6 : Risque cardiométabolique élevé (obésité abdominale viscérale). Surveillance médicale recommandée.');
    }
    
    if (a > 60) warnings.push('Âge >60 ans : Redistribution graisseuse (viscéral ↑, sous-cutané ↓). Marge erreur formules accrue. DEXA ou bioimpédance multi-fréquence recommandé.');

    if (gender === 'female' && bf < 14) warnings.push('BF% <14% femme : Risque aménorrhée hypothalamique (perturbation axe HPG). Surveillance cycle menstruel essentielle.');

    if (bf >= 14 && bf <= 17 && gender === 'male') warnings.push('✓ BF% optimal homme (14-17%) : Zone ACE Fitness Standards. Performance + santé métabolique + longévité.');

    if (bf >= 21 && bf <= 24 && gender === 'female') warnings.push('✓ BF% optimal femme (21-24%) : Zone ACE Fitness Standards. Santé hormonale + performance + fertilité préservée.');

    setResult({
      bodyFat: Math.round(bf * 10) / 10,
      fatMass: Math.round(fm * 10) / 10,
      leanMass: Math.round(lm * 10) / 10,
      category,
      categoryDesc: desc,
      color,
      marginOfError: marginError,
      methodUsed: methodName,
      warnings
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // --- FONCTION DE COPIE ---
  const handleCopy = () => {
    if (!result) return;
    
    const optimalInfo = getOptimalZone(gender);
    // URL FIXÉE EN DUR
    const url = 'https://www.stryvlab.com/outils';

    const textToCopy = `Bilan Composition Corporelle - STRYV LAB

• Body Fat : ${result.bodyFat}%
• Catégorie : ${result.category}
• Masse Grasse : ${result.fatMass} kg
• Masse Maigre : ${result.leanMass} kg

• Zone Optimale : ${optimalInfo.range}
• Méthode : ${result.methodUsed}

Retrouvez cet outil ici : ${url}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqItems = [
    {
      question: "Pourquoi mesurer le body fat plutôt que simplement se peser ou utiliser l'IMC ?",
      answer: "Le poids total et l'IMC (poids/taille²) ne distinguent pas masse grasse (adipocytes, tissu adipeux) vs masse maigre (muscle, os, organes, eau). Deux individus identiques (poids, taille, IMC) peuvent avoir compositions radicalement différentes : l'un 10% BF (athlète, 90% LBM), l'autre 30% BF (sédentaire, 70% LBM). Santé métabolique, risque cardiovasculaire et performance corrèlent avec BF%, pas IMC. Exemple classique : bodybuilders IMC>25 'surpoids' selon WHO mais BF% <10% (excellent santé). Limite IMC : ignore distribution graisseuse (viscérale vs sous-cutanée) et masse musculaire. BF% permet suivi précis progression (perte graisse vs perte muscle). Gold standard : DEXA (±1-2%) > BIA multi-fréquence (±3-4%) > formules anthropométriques Navy/Jackson-Pollock (±3-5%) > IMC (indicateur population, non individuel)."
    },
    {
      question: "Quelle est la différence entre méthode US Navy et Jackson-Pollock plis cutanés ?",
      answer: "US Navy (Hodgdon & Beckett 1984) : Équations dérivées mesures circonférences (cou, taille, hanches) sur 1400+ militaires. Avantages : simple (mètre ruban), reproductible, accessible. Inconvénients : moins précis que plis cutanés (±3-5%), assume distribution graisseuse standard, erreur accrue obésité (graisse viscérale non mesurée). Jackson-Pollock (1978/1980) : Mesure épaisseur plis cutanés (adipomètre/caliper) à 3 sites spécifiques. Hommes : pectoral, abdomen, cuisse. Femmes : triceps, suprailiac, cuisse. Équations calculent densité corporelle puis BF% via formule Siri. Avantages : plus précis (±3-4%), mesure directe graisse sous-cutanée. Inconvénients : technique-dépendant (opérateur entraîné essentiel, même site exact, pression standardisée), équipement nécessaire, ne mesure pas graisse viscérale. Recommandation : Navy pour suivi régulier accessible, Jackson-Pollock si accès adipomètre + technique maîtrisée."
    },
    {
      question: "Quels sont les standards ACE pour le body fat et comment interpréter mon résultat ?",
      answer: "American Council on Exercise (ACE) catégorise BF% selon santé/performance. HOMMES : Essentiel (<6%) = minimum vital survie, Athlète (6-13%) = sport élite, Fitness (14-17%) = forme optimale santé, Acceptable (18-24%) = moyenne population, Obésité (≥25%). FEMMES : Essentiel (<14%) = minimum vital, Athlète (14-20%) = sport élite, Fitness (21-24%) = forme optimale, Acceptable (25-31%), Obésité (≥32%). Zone OPTIMALE recommandée : H 14-17%, F 21-24% (ACE Fitness Standards). Rationale : Homme <10% : risques hormonaux (testostérone ↓, cortisol ↑), fatigue, immunité ↓. Femme <14% : aménorrhée hypothalamique (axe HPG perturbé), fertilité ↓, densité osseuse ↓. >25% H/>32% F : syndrome métabolique, inflammation chronique, résistance insuline, risque cardiovasculaire ↑. Athlètes compétition acceptent temporairement <10% H/<18% F en pic forme, non durable long terme. Distribution graisse importante : viscérale (abdominale, organes) > sous-cutanée pour risque santé."
    },
    {
      question: "Quelle est la précision réelle des formules et quand faut-il utiliser DEXA ?",
      answer: "Précision formules anthropométriques (Navy, Jackson-Pollock) : ±3-5% erreur standard population générale saine (BMI 18.5-30). Facteurs dégradant précision : (1) Obésité sévère (BMI>35) : sous-estimation jusqu'à ±7-10%, (2) Athlètes élite masse musculaire extrême : surestimation, (3) Âge >60 ans : redistribution graisseuse (viscéral ↑), (4) Ethnicité : équations calibrées populations caucasiennes majoritairement, (5) Opérateur-dépendance (plis cutanés) : ±2-3% variation inter-opérateur. DEXA (Dual-Energy X-ray Absorptiometry) gold standard clinique : ±1-2% erreur, mesure directe composition 3-compartiments (graisse, muscle, os), distribution régionale (tronc, membres), graisse viscérale vs sous-cutanée. Quand utiliser DEXA ? (1) Obésité sévère validation, (2) Suivi médical pathologies métaboliques, (3) Recherche/compétition haut niveau, (4) Baseline précise début transformation. Coût : 50-150€/scan. Alternatives : BIA multi-fréquence (±3-4%, 200-500€ appareil pro), plis cutanés 7-sites (±2-3%, opérateur expert). Formules simples suffisent suivi tendances population générale fitness/santé."
    },
    {
      question: "Comment faire évoluer mon body fat de manière saine et durable ?",
      answer: "Perte graisse saine : -0.5-1% BF/mois (max -0.5kg graisse/semaine) préserve masse maigre. Déficit calorique modéré : -300-500 kcal/j (15-20% TDEE). Protéines élevées : 2.0-2.4g/kg LBM maintiennent muscle en déficit (Helms et al., 2014). Entraînement résistance 3-4×/sem (signal anabolique anti-catabolisme). Cardio modéré : 2-3×/sem Zone 2 (oxydation lipides). Éviter : déficit agressif >25% (catabolisme musculaire, métabolisme adaptatif ↓, hormones perturbées). Rebonds diet breaks : 2 semaines maintenance tous 8-12 semaines (reverse T3 normalisé, leptine restaurée). Prise masse maigre : surplus +200-300 kcal/j, protéines 1.8-2.2g/kg, progression charges (hypertrophie). Gain BF inévitable mais limitable (bulk propre) : ratio gain muscle:graisse 2:1 à 3:1 optimal. Atteindre zones extrêmes (<8% H, <15% F) non durable : préparation compétition uniquement (8-16 semaines), puis reverse diet progressif. Long terme : maintenance zone santé optimale (14-17% H, 21-24% F) via habitudes alimentaires durables, activité physique régulière, sommeil adéquat (7-9h), stress géré."
    }
  ];

  // --- SCHEMA.ORG JSON-LD ---
  const jsonLdSoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Calculateur Body Fat % Pro STRYV LAB",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "description": "Calculateur scientifique body fat (masse grasse corporelle) via méthodes US Navy (1984) et Jackson-Pollock (1978). Catégorisation ACE Standards. Composition corporelle précise.",
    "featureList": [
      "Méthode US Navy (Hodgdon & Beckett 1984)",
      "Jackson-Pollock 3-Site skinfold (1978)",
      "Catégorisation ACE Standards",
      "Calcul masse grasse vs masse maigre (LBM)",
      "Zone optimale personnalisée genre",
      "Warnings IMC, âge, distribution graisseuse",
      "Précision ±3-5% population générale",
      "Alternative DEXA gold standard"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "ratingCount": "298"
    }
  };

  const jsonLdFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const optimalZone = result ? getOptimalZone(gender) : null;

  return (
    <>
      {/* SCHEMA.ORG STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />

      <main className="flex flex-col lg:flex-row min-h-screen font-outfit text-white">
        
        {/* ================= GAUCHE ================= */}
        <section className="w-full lg:w-5/12 lg:max-w-[500px] bg-[#1A1A1A] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] lg:min-h-screen lg:sticky lg:top-0 border-r border-white/5 shadow-2xl z-20">
          
          <div className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none select-none">
             <BarChart3 className="w-80 h-80 stroke-[0.5]" />
          </div>

          <div className="relative z-10">
            <Link href="/outils" className="group inline-flex items-center text-white/40 hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold mb-12 transition-colors">
              <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Retour au Hub
            </Link>
            
            <div className="flex flex-col items-start gap-6 mb-10">
              <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] flex items-center justify-center text-white">
                     <BarChart3 className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">Composition</span>
              </div>
            </div>
            
            <h1 className="text-white text-4xl md:text-5xl font-azonix uppercase tracking-tighter mb-8 leading-[0.9]">
  Body Fat
  <span className="text-white/40"> %</span>
</h1>
            
            {/* DESCRIPTION SCIENTIFIQUE */}
            <div className="space-y-6 border-t border-white/5 pt-6">
              <div>
                <h2 className="text-white/90 text-base font-bold mb-3 tracking-tight">La Vraie Métrique</h2>
                <p className="text-white/50 text-[13px] leading-relaxed font-light">
                  L'IMC ne distingue pas muscle et graisse. Le pourcentage de masse grasse (BF%) révèle votre composition corporelle réelle et prédit votre santé métabolique.
                </p>
              </div>

              <div className="text-white/50 text-[13px] leading-relaxed font-light space-y-3">
                <p>Deux méthodes scientifiques validées :</p>
                
                <div className="space-y-2 pl-4 border-l-2 border-emerald-500/30">
                  <p><strong className="text-white/70">• US Navy (1984)</strong> : Circonférences corporelles. Validation Hodgdon & Beckett sur 1,400+ militaires. Précision ±3-5%.</p>
                  <p><strong className="text-white/70">• Jackson-Pollock (1978)</strong> : Plis cutanés 3-sites. Équation densité corporelle → Siri formula. Précision ±3-4%.</p>
                </div>

                <p className="pt-2">
                  <strong className="text-white/90">Standards ACE</strong> (American Council on Exercise) : catégorisation Essentiel → Athlète → Fitness → Acceptable → Obésité selon genre.
                </p>

                <p className="text-[11px] text-white/40 pt-3 border-t border-white/5">
                  Références : Hodgdon & Beckett (1984) US Navy • Jackson & Pollock (1978) • ACE Fitness Standards
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 md:mt-0 flex justify-between items-end text-white/20">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold">STRYV Lab</p>
            <span className="font-azonix text-xs opacity-30">V4.0</span>
          </div>
        </section>

        {/* ================= DROITE ================= */}
        <section className="flex-1 relative overflow-y-auto py-8 px-4 md:px-8 lg:py-16 bg-[#303030]">
            <div className="max-w-3xl mx-auto space-y-12">
                
                <div className="border-b border-white/10 pb-6">
                    <h3 className="text-lg font-bold text-white mb-1">Calcul masse grasse</h3>
                    <p className="text-sm text-white/40 font-medium">Navy ou Jackson-Pollock 3-Site</p>
                </div>

                <div className="space-y-8">
                    
                    {/* MÉTHODE */}
                    <div className="space-y-3">
                        <label className="text-[13px] font-medium text-white/60">Méthode de mesure</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'navy', label: 'US Navy', desc: 'Mètre ruban', precision: '±3-5%' },
                                { id: 'skinfold', label: 'Plis Cutanés', desc: 'Adipomètre', precision: '±3-4%' }
                            ].map(m => (
                                <button 
                                key={m.id}
                                onClick={() => { setMethod(m.id as Method); setResult(null); }}
                                className={`p-4 rounded-xl border flex flex-col gap-1 transition-all ${method === m.id ? 'border-white/40 bg-[#404040] text-white' : 'border-white/5 bg-[#252525] text-white/40 hover:border-white/20'}`}
                                >
                                    <span className="text-sm font-bold">{m.label}</span>
                                    <span className="text-[10px] text-white/40">{m.desc} • {m.precision}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* GENRE */}
                    <div className="space-y-3">
                        <label className="text-[13px] font-medium text-white/60">Genre (formules différenciées)</label>
                        <div className="flex gap-2 p-1 bg-[#252525] rounded-xl border border-white/5">
                            {(['male', 'female'] as Gender[]).map(g => (
                                <button 
                                key={g} 
                                onClick={() => { setGender(g); setResult(null); }}
                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${gender === g ? 'bg-[#404040] text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                                >
                                    {g === 'male' ? 'Homme' : 'Femme'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* INPUTS BASE */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
                        {[
                            { label: 'Âge', val: age, set: setAge, ph: '30' },
                            { label: 'Poids (kg)', val: weight, set: setWeight, ph: '75' },
                            { label: 'Taille (cm)', val: height, set: setHeight, ph: '180' },
                        ].map((field, i) => (
                            <div key={i} className="space-y-3">
                                <label className="text-[13px] font-medium text-white/60">{field.label}</label>
                                <input 
                                type="number" 
                                value={field.val} 
                                onChange={(e) => field.set(e.target.value)} 
                                placeholder={field.ph}
                                className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all"
                                />
                            </div>
                        ))}
                    </div>

                    {/* INPUTS US NAVY */}
                    {method === 'navy' && (
                        <div className="pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in">
                            <div className="space-y-3">
                                <label className="text-[13px] font-medium text-white/60">Tour cou (cm)</label>
                                <input type="number" value={neck} onChange={(e) => setNeck(e.target.value)} placeholder="38" className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[13px] font-medium text-white/60">Tour taille (cm)</label>
                                <input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="80" className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30" />
                            </div>
                            {gender === 'female' && (
                                <div className="space-y-3">
                                    <label className="text-[13px] font-medium text-white/60">Tour hanches (cm)</label>
                                    <input type="number" value={hips} onChange={(e) => setHips(e.target.value)} placeholder="95" className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30" />
                                </div>
                            )}
                        </div>
                    )}

                    {/* INPUTS SKINFOLD */}
                    {method === 'skinfold' && (
                        <div className="pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in">
                            {gender === 'male' ? (
                                <>
                                <div className="space-y-3">
                                    <label className="text-[13px] font-medium text-white/60">Pectoral (mm)</label>
                                    <input type="number" value={chest} onChange={(e) => setChest(e.target.value)} className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white outline-none focus:border-white/30" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[13px] font-medium text-white/60">Abdomen (mm)</label>
                                    <input type="number" value={abdominal} onChange={(e) => setAbdominal(e.target.value)} className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white outline-none focus:border-white/30" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[13px] font-medium text-white/60">Cuisse (mm)</label>
                                    <input type="number" value={thigh} onChange={(e) => setThigh(e.target.value)} className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white outline-none focus:border-white/30" />
                                </div>
                                </>
                            ) : (
                                <>
                                <div className="space-y-3">
                                    <label className="text-[13px] font-medium text-white/60">Triceps (mm)</label>
                                    <input type="number" value={triceps} onChange={(e) => setTriceps(e.target.value)} className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white outline-none focus:border-white/30" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[13px] font-medium text-white/60">Suprailiac (mm)</label>
                                    <input type="number" value={suprailiac} onChange={(e) => setSuprailiac(e.target.value)} className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white outline-none focus:border-white/30" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[13px] font-medium text-white/60">Cuisse (mm)</label>
                                    <input type="number" value={thigh} onChange={(e) => setThigh(e.target.value)} className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white outline-none focus:border-white/30" />
                                </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="pt-8 border-t border-white/5 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Méthodologie scientifique</h3>
                            <p className="text-sm text-white/40">Formules & équations</p>
                        </div>
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-[11px] font-medium text-white/40 hover:text-white underline-offset-2 hover:underline">
                            {showAdvanced ? 'Masquer détails' : 'Voir formules'}
                        </button>
                    </div>

                    {showAdvanced && (
                        <div className="bg-[#252525] border border-white/5 rounded-xl p-5 space-y-3 animate-in fade-in">
                            <div className="text-xs text-white/60 space-y-2">
                                {method === 'navy' ? (
                                    <>
                                    <p><strong className="text-white/80">US Navy Homme (1984):</strong> BF% = 86.010 × log10(Taille - Cou) - 70.041 × log10(Hauteur) + 36.76</p>
                                    <p><strong className="text-white/80">US Navy Femme (1984):</strong> BF% = 163.205 × log10(Taille + Hanches - Cou) - 97.684 × log10(Hauteur) - 78.387</p>
                                    </>
                                ) : (
                                    <>
                                    <p><strong className="text-white/80">Jackson-Pollock (1978):</strong> Densité corporelle = Équation 3-sites (pectoral/abdomen/cuisse H, triceps/suprailiac/cuisse F)</p>
                                    <p><strong className="text-white/80">Siri (1961):</strong> BF% = ((4.95 / Densité) - 4.50) × 100</p>
                                    </>
                                )}
                                <p className="pt-2 border-t border-white/5"><strong className="text-white/80">Catégorisation:</strong> Standards ACE (American Council on Exercise)</p>
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    onClick={calculateBodyFat}
                    disabled={!weight || !height || !age}
                    className="w-full py-5 bg-white hover:bg-gray-200 text-[#1A1A1A] rounded-xl font-bold text-sm transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    Calculer le body fat
                </button>

            </div>

            <div ref={resultsRef}>
            {result && optimalZone && (
                <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 space-y-6 mt-16 max-w-3xl mx-auto">
                    
                    {result.warnings.length > 0 && (
                        <div className="bg-[#404040] border border-white/10 rounded-xl p-5 space-y-2">
                            {result.warnings.map((w, i) => (
                                <div key={i} className="text-sm text-white/90 font-medium">• {w}</div>
                            ))}
                        </div>
                    )}

                    <div className="bg-[#252525] p-6 rounded-xl border border-white/5 text-center">
                        <div className="text-[11px] font-medium text-white/40 mb-2">Body Fat Percentage</div>
                        <div className="text-5xl md:text-6xl font-bold text-white">{result.bodyFat} <span className="text-2xl text-white/40">%</span></div>
                        <div className="text-xs text-white/50 mt-2">{result.category} • {result.categoryDesc}</div>
                        <div className="text-[10px] text-white/40 mt-1">{result.methodUsed} • {result.marginOfError}</div>
                    </div>

                    <div className="pt-8">
                        <h3 className="text-lg font-bold text-white mb-6">Composition corporelle détaillée</h3>
                        
                        <div className="space-y-3">
                            {/* MASSE GRASSE */}
                            <div className={`bg-gradient-to-br ${result.color} p-6 rounded-2xl border border-white/10`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-[#1A1A1A] shadow-sm">1</div>
                                        <div>
                                            <div className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wide">Masse Grasse</div>
                                            <div className="text-[10px] text-[#1A1A1A]/60">Adipocytes + Tissu adipeux</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-2xl text-[#1A1A1A]">{result.fatMass} kg</div>
                                        <div className="text-[9px] text-[#1A1A1A]/50 uppercase">{result.bodyFat}%</div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-[#1A1A1A]/10">
                                    <div className="text-[10px] text-[#1A1A1A]/70 font-medium">Variable ajustable (déficit calorique + training)</div>
                                </div>
                            </div>

                            {/* MASSE MAIGRE */}
                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/50 p-6 rounded-2xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-[#1A1A1A] shadow-sm">2</div>
                                        <div>
                                            <div className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wide">Masse Maigre (LBM)</div>
                                            <div className="text-[10px] text-[#1A1A1A]/60">Muscle + Os + Organes + Eau</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-2xl text-[#1A1A1A]">{result.leanMass} kg</div>
                                        <div className="text-[9px] text-[#1A1A1A]/50 uppercase">{(100 - result.bodyFat).toFixed(1)}%</div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-[#1A1A1A]/10">
                                    <div className="text-[10px] text-[#1A1A1A]/70 font-medium">Base métabolique active (À PRÉSERVER)</div>
                                </div>
                            </div>

                            {/* ZONE OPTIMALE */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 p-6 rounded-2xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-[#1A1A1A] shadow-sm">3</div>
                                        <div>
                                            <div className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wide">Zone Optimale {gender === 'male' ? 'Homme' : 'Femme'}</div>
                                            <div className="text-[10px] text-[#1A1A1A]/60">{optimalZone.desc} (ACE Standards)</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-2xl text-[#1A1A1A]">{optimalZone.range}</div>
                                        <div className="text-[9px] text-[#1A1A1A]/50 uppercase">
                                            {result.bodyFat < parseFloat(optimalZone.range.split('-')[0]) 
                                              ? '↓ Déficit' 
                                              : result.bodyFat > parseFloat(optimalZone.range.split('-')[1])
                                              ? '↑ Excès'
                                              : '✓ Optimal'}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-[#1A1A1A]/10">
                                    <div className="text-[10px] text-[#1A1A1A]/70 font-medium">{optimalZone.rationale}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleCopy}
                        className={`w-full py-5 border-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${copied ? 'bg-emerald-400 border-emerald-400 text-white' : 'border-white/10 text-white/60 hover:bg-white/5'}`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copié !' : 'Copier mon bilan composition corporelle'}
                    </button>

                    <div className="p-5 bg-[#252525] rounded-xl border border-white/5">
                        <p className="text-sm text-white/60 leading-relaxed font-medium">
                            <strong className="text-white/90">Méthodologie :</strong> {result.methodUsed}. Précision {result.marginOfError} (population générale). Catégorisation ACE (American Council on Exercise). Gold standard : DEXA (±1-2%). Pour obésité sévère (BMI{'>'}35) ou validation médicale, scan DEXA recommandé.
                        </p>
                    </div>
                </div>
            )}
            </div>

            <div className="mt-24 max-w-3xl mx-auto pb-24">
                <h2 className="text-lg font-bold text-white mb-6">Questions fréquentes sur le body fat</h2>
                <div className="space-y-3">
                    {faqItems.map((item, i) => (
                        <div key={i} className="bg-[#252525] border border-white/5 rounded-xl overflow-hidden">
                            <button 
                                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)} 
                                className="w-full flex justify-between items-center p-5 text-left font-medium text-sm text-white hover:bg-white/5 transition-colors"
                            >
                                <span className="pr-4">{item.question}</span>
                                <ChevronDown className={`flex-shrink-0 w-4 h-4 text-white/40 transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                            </button>
                            {openFaqIndex === i && (
                                <div className="px-5 pb-5 text-xs text-white/60 leading-relaxed border-t border-white/5 pt-4">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </section>
      </main>

      <GenesisAssistant />
    </>
  );
}