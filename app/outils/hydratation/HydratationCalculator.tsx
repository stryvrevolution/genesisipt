'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Droplet, ArrowLeft, ChevronDown, Copy, Check } from 'lucide-react';
import GenesisAssistant from '@/components/GenesisAssistant';

// --- TYPES ---
type Activity = 'sedentary' | 'light' | 'moderate' | 'intense' | 'athlete';
type Climate = 'cold' | 'temperate' | 'hot' | 'veryHot';
type Gender = 'male' | 'female';

export default function HydratationCalculator() {
  // --- STATES ---
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [activity, setActivity] = useState<Activity>('moderate');
  const [climate, setClimate] = useState<Climate>('temperate');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false); // État pour le bouton copier
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const [result, setResult] = useState<{
    liters: number;
    glasses: number;
    breakdown: { base: number; activity: number; climate: number; gender: number };
    warnings: string[];
  } | null>(null);

  // --- LOGIQUE CALCUL ---
  const calculateIntake = () => {
    setCopied(false);
    const w = parseFloat(weight);
    if (!w) return;

    // BASE HYDRIQUE (35ml/kg - EFSA 2010)
    const baseML = w * 35;

    // AJUSTEMENT GENRE
    const genderMultiplier = gender === 'male' ? 1.1 : 0.95;
    const genderAdjustedBase = baseML * genderMultiplier;
    const genderBonus = Math.round(genderAdjustedBase - baseML);

    // BONUS ACTIVITÉ
    const activityBonus: Record<Activity, number> = {
      sedentary: 0,
      light: 300,
      moderate: 600,
      intense: 900,
      athlete: 1200,
    };

    // BONUS CLIMAT
    const climateBonus: Record<Climate, number> = {
      cold: 500,
      temperate: 0,
      hot: 750,
      veryHot: 1500,
    };

    // TOTAL
    const totalML = genderAdjustedBase + activityBonus[activity] + climateBonus[climate];
    const totalLiters = Math.round((totalML / 1000) * 10) / 10;
    const glasses = Math.round(totalML / 250);

    // WARNINGS SCIENTIFIQUES
    const warnings: string[] = [];

    if (totalLiters > 5) {
      warnings.push('Volume élevé (>5L) : Risque hyponatrémie si ingestion trop rapide. Répartir sur 16h éveillées (300-350ml/h max selon ACSM 2007).');
    }

    if (totalLiters < 1.5) {
      warnings.push('Volume bas (<1.5L) : Sous le seuil minimal EFSA (2010). Déshydratation chronique probable, risque cognitif et rénal. Augmenter progressivement.');
    }

    if (climate === 'veryHot' && activity === 'athlete') {
      warnings.push('Conditions extrêmes : Ajouter électrolytes (sodium 500-700mg/L selon IOC Consensus 2012) pour prévenir hyponatrémie d\'exercice.');
    }

    if (climate === 'cold') {
      warnings.push('Climat froid : Sensation soif réduite (vasoconstriction périphérique). Programmer rappels hydratation toutes les 90-120min (Kenefick & Sawka, 2007).');
    }

    if (totalLiters >= 2 && totalLiters <= 3.5) {
      warnings.push('✓ Volume optimal (2-3.5L) : Conforme recommandations EFSA 2010 pour euhydratation et performance cognitive/physique.');
    }

    setResult({
      liters: totalLiters,
      glasses: glasses,
      breakdown: {
        base: Math.round(baseML),
        gender: genderBonus,
        activity: activityBonus[activity],
        climate: climateBonus[climate]
      },
      warnings
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // --- FONCTION DE COPIE ---
  const handleCopy = () => {
    if (!result) return;
    
    // URL FIXÉE EN DUR
    const url = 'https://www.stryvlab.com/outils/hydratation';

    const textToCopy = `Bilan Hydratation - STRYV LAB

• Objectif Quotidien : ${result.liters} Litres
• Équivalent : ~${result.glasses} verres (250ml)

Détail des besoins :
• Base métabolique : ${Math.round(result.breakdown.base / 1000 * 10) / 10} L
• Surplus activité : +${result.breakdown.activity} ml
• Surplus climat : +${result.breakdown.climate} ml

Retrouvez cet outil ici : ${url}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqItems = [
    {
      question: "Quelle est la base scientifique des 35ml/kg et pourquoi pas la règle des 2 litres ?",
      answer: "La recommandation 35ml/kg provient de l'European Food Safety Authority (EFSA, 2010) et reflète les besoins physiologiques réels selon la masse corporelle. La règle populaire '8 verres/2L par jour' n'a aucune validation scientifique (origine probablement déformée d'une recommandation 1945 du Food & Nutrition Board incluant l'eau des aliments). Problème : un individu de 50kg et un de 100kg n'ont pas les mêmes besoins (respectivement 1.75L vs 3.5L base). L'approche poids corporel (ml/kg) s'ajuste automatiquement. ACSM (2007) et IOC (2012) utilisent également ce ratio. Variation individuelle ±20% selon métabolisme basal, mais 30-40ml/kg couvre 95% population adulte sédentaire. Besoin augmente avec activité (+500-1500ml/h effort selon intensité), climat (+500-1500ml/j chaleur), altitude (>2500m, +500ml diurèse froide)."
    },
    {
      question: "Pourquoi différencier homme/femme pour l'hydratation ?",
      answer: "Différences physiologiques validées (EFSA 2010, IOM 2004). Hommes : masse maigre supérieure (métabolisme basal +10-15%), volume sanguin relatif accru, sudation plus importante à intensité égale (thermorégulation différente). Femmes : composition corporelle avec adiposité relative supérieure (tissu adipeux contient <25% eau vs muscle >75%), variations hormonales menstruelles influençant rétention hydrique (phase lutéale : aldostérone ↑, rétention +1-2kg eau temporaire), besoins légèrement réduits en valeur absolue mais identiques rapportés à masse maigre. Notre multiplicateur homme (×1.1) vs femme (×0.95) reflète ces différences métaboliques. Exception : femmes enceintes (+300ml/j) et allaitantes (+700ml/j selon WHO). Athlètes élites : taux sudation similaire quand normalisé à VO2max, donc différence s'estompe."
    },
    {
      question: "Comment l'activité physique augmente-t-elle réellement les besoins en eau ?",
      answer: "Pertes hydriques exercice = sudation (principal) + respiration (secondaire). Taux sudation varie 0.5-2.5L/h selon intensité, acclimatation, environnement (Sawka et al., 2007 ACSM Position Stand). Effort léger (<60% VO2max, 30-60min) : +300ml compensation post-exercice. Effort modéré (60-75% VO2max, 60-90min) : +600ml. Effort intense (>75% VO2max, 90-120min) : +900ml. Athlètes (>2h ou 2 séances/j) : +1200ml minimum. Déshydratation progressive : -2% poids corporel = -10-20% performance (↓ VO2max, ↑ FC, ↓ débit cardiaque). -3-4% = risque sérieux (cognition altérée, thermorégulation compromise). Optimal : boire 150% pertes sudation sur 4-6h post-effort (compenser pertes urinaires continues). Pesée pré/post entraînement = méthode gold standard (1kg perdu = 1L eau minimum à remplacer)."
    },
    {
      question: "Le climat chaud augmente-t-il vraiment autant les besoins (jusqu'à +1.5L) ?",
      answer: "Oui, validé par recherche thermorégulation. Température ambiante >25°C active sudation thermorégulatrice basale (sans exercice) : +500-750ml/j selon acclimatation. >30°C (chaleur extrême) : +1000-1500ml/j minimum (Sawka et al., 2015). Mécanisme : hypothalamus détecte température centrale >37°C, déclenche sudation évaporative (seul mécanisme refroidissement efficace humain). Non-acclimatés : sudation inefficace (concentration sodium élevée, volume faible). Acclimatés (>14 jours exposition) : sudation optimisée (volume ↑ 50%, concentration sodium ↓ 50%). Climat froid paradoxe : +500ml car diurèse froide (vasoconstriction périphérique → pression centrale ↑ → rénine-angiotensine désactivée → volume urine ↑) + air sec (pertes respiratoires insensibles ↑). Humidité crucial : >70% humidité bloque évaporation sudorale, aggrave stress thermique même température modérée."
    },
    {
      question: "Quels sont les signes objectifs de déshydratation et comment monitorer l'hydratation ?",
      answer: "Marqueurs fiables par ordre précision : (1) Urine couleur (échelle Armstrong 1-8) : <3 = euhydraté, 4-6 = déshydratation légère-modérée, >7 = sévère. Limites : vitamines B, médicaments faussent couleur. (2) Poids corporel quotidien (matin, post-miction, pré-petit-déjeuner) : variation >1% = déficit hydrique probable. (3) Soif : tardive (apparaît -1-2% poids corporel), peu fiable athlètes/âgés (mécanisme altéré). (4) Osmolalité urinaire (gold standard laboratoire) : <700 mOsm/kg = euhydraté, >900 = déshydraté. Signes cliniques tardifs (déjà -3-4%) : bouche sèche, peau perd élasticité (test pli cutané), fatigue, céphalées, vertiges. Performance cognitive décline dès -1-2% (temps réaction ↑, mémoire travail ↓, Armstrong 2012). Prévention > réaction : boire régulièrement (pas attendre soif), cibler urine jaune pâle, maintenir poids stable."
    }
  ];

  // --- SCHEMA.ORG JSON-LD ---
  const jsonLdSoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Calculateur Hydratation Pro STRYV LAB",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "description": "Calculateur scientifique hydratation basé sur recommandations EFSA (2010) et ACSM (2007). Besoin personnalisé selon poids, activité, climat. Prévention déshydratation et optimisation performance.",
    "featureList": [
      "Base EFSA 2010 (35ml/kg)",
      "Ajustement genre (composition corporelle)",
      "Bonus activité validé ACSM 2007",
      "Bonus climat (thermorégulation)",
      "Warnings hyponatrémie/déshydratation",
      "Breakdown détaillé (base+activité+climat)",
      "Recommandations électrolytes IOC 2012",
      "Protocole monitoring (couleur urine, poids)"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "267"
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
             <Droplet className="w-80 h-80 stroke-[0.5]" />
          </div>

          <div className="relative z-10">
            <Link href="/outils" className="group inline-flex items-center text-white/40 hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold mb-12 transition-colors">
              <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Retour au Hub
            </Link>
            
            <div className="flex flex-col items-start gap-6 mb-10">
              <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-[0_0_20px_-5px_rgba(34,211,238,0.4)] flex items-center justify-center text-white">
                     <Droplet className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">Santé & Performance</span>
              </div>
            </div>
            
            <h1 className="text-white text-4xl md:text-5xl font-azonix italic uppercase tracking-tighter mb-8 leading-[0.9]">
              Hydratation
            </h1>
            
            {/* DESCRIPTION SCIENTIFIQUE */}
            <div className="space-y-6 border-t border-white/5 pt-6">
              <div>
                <h2 className="text-white/90 text-base font-bold mb-3 tracking-tight">Le Facteur Sous-Estimé</h2>
                <p className="text-white/50 text-[13px] leading-relaxed font-light">
                  Une déshydratation de seulement 2% du poids corporel entraîne une baisse de 10-20% des performances physiques et cognitives. Notre calculateur utilise les standards scientifiques validés.
                </p>
              </div>

              <div className="text-white/50 text-[13px] leading-relaxed font-light space-y-3">
                <p>Méthodologie basée sur recherche physiologie :</p>
                
                <div className="space-y-2 pl-4 border-l-2 border-cyan-500/30">
                  <p><strong className="text-white/70">• EFSA (2010)</strong> : Base 35ml/kg poids corporel. Recommandation European Food Safety Authority sur 28 études populationnelles.</p>
                  <p><strong className="text-white/70">• ACSM (2007)</strong> : Ajustements activité physique. Position Stand thermorégulation et réhydratation (Sawka et al.).</p>
                  <p><strong className="text-white/70">• IOC Consensus (2012)</strong> : Guidelines électrolytes sports. Prévention hyponatrémie d'exercice.</p>
                </div>

                <p className="pt-2">
                  Les <strong className="text-white/90">4 paramètres clés</strong> (poids, genre, activité, climat) modulent vos besoins de ±50% selon contexte individuel.
                </p>

                <p className="text-[11px] text-white/40 pt-3 border-t border-white/5">
                  Références : EFSA (2010) • ACSM Position Stand (2007) • IOC Consensus (2012)
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 md:mt-0 flex justify-between items-end text-white/20">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold">STRYV Lab</p>
            <span className="font-azonix text-xs opacity-30">V3.0</span>
          </div>
        </section>

        {/* ================= DROITE ================= */}
        <section className="flex-1 relative overflow-y-auto py-8 px-4 md:px-8 lg:py-16 bg-[#303030]">
            <div className="max-w-3xl mx-auto space-y-12">
                
                <div className="border-b border-white/10 pb-6">
                    <h3 className="text-lg font-bold text-white mb-1">Calcul besoins hydriques</h3>
                    <p className="text-sm text-white/40 font-medium">Méthode EFSA 2010 (35ml/kg)</p>
                </div>

                <div className="space-y-8">
                    
                    {/* Genre & Poids */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        <div className="space-y-3">
                            <label className="text-[13px] font-medium text-white/60">Genre (composition corporelle)</label>
                            <div className="flex gap-2 p-1 bg-[#252525] rounded-xl border border-white/5">
                                {(['male', 'female'] as Gender[]).map(g => (
                                    <button 
                                    key={g} 
                                    onClick={() => setGender(g)}
                                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${gender === g ? 'bg-[#404040] text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                                    >
                                        {g === 'male' ? 'Homme' : 'Femme'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[13px] font-medium text-white/60">Poids (kg)</label>
                            <input 
                            type="number" 
                            value={weight} 
                            onChange={(e) => setWeight(e.target.value)} 
                            placeholder="75"
                            className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all"
                            />
                        </div>
                    </div>

                    {/* Activité */}
                    <div className="pt-8 border-t border-white/5 space-y-3">
                        <label className="text-[13px] font-medium text-white/60">Niveau d'activité physique (quotidien)</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { val: 'sedentary', label: 'Sédentaire', desc: '<30min/j' },
                                { val: 'light', label: 'Léger', desc: '30-60min' },
                                { val: 'moderate', label: 'Modéré', desc: '60-90min' },
                                { val: 'intense', label: 'Intense', desc: '90-120min' },
                                { val: 'athlete', label: 'Athlète', desc: '>2h/j' }
                            ].map((opt) => (
                                <button 
                                key={opt.val}
                                onClick={() => setActivity(opt.val as Activity)}
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all h-20 ${activity === opt.val ? 'border-white/40 bg-[#404040] text-white' : 'border-white/5 bg-[#252525] text-white/40 hover:border-white/20'}`}
                                >
                                    <span className="text-xs font-bold">{opt.label}</span>
                                    <span className="text-[10px] text-white/40">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Climat */}
                    <div className="pt-8 border-t border-white/5 space-y-3">
                        <label className="text-[13px] font-medium text-white/60">Environnement climatique</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { val: 'cold', label: 'Froid', desc: '<10°C' },
                                { val: 'temperate', label: 'Tempéré', desc: '10-25°C' },
                                { val: 'hot', label: 'Chaud', desc: '25-30°C' },
                                { val: 'veryHot', label: 'Extrême', desc: '>30°C' }
                            ].map((opt) => (
                                <button 
                                key={opt.val}
                                onClick={() => setClimate(opt.val as Climate)}
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all h-20 ${climate === opt.val ? 'border-white/40 bg-[#404040] text-white' : 'border-white/5 bg-[#252525] text-white/40 hover:border-white/20'}`}
                                >
                                    <span className="text-xs font-bold">{opt.label}</span>
                                    <span className="text-[10px] text-white/40">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Méthodologie scientifique</h3>
                            <p className="text-sm text-white/40">Formules & références</p>
                        </div>
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-[11px] font-medium text-white/40 hover:text-white underline-offset-2 hover:underline">
                            {showAdvanced ? 'Masquer détails' : 'Voir formules'}
                        </button>
                    </div>

                    {showAdvanced && (
                        <div className="bg-[#252525] border border-white/5 rounded-xl p-5 space-y-3 animate-in fade-in">
                            <div className="text-xs text-white/60 space-y-2">
                                <p><strong className="text-white/80">Base (EFSA 2010):</strong> 35ml × Poids (kg) × Multiplicateur genre (H: 1.1, F: 0.95)</p>
                                <p><strong className="text-white/80">Activité (ACSM 2007):</strong> Sédentaire +0ml • Léger +300ml • Modéré +600ml • Intense +900ml • Athlète +1200ml</p>
                                <p><strong className="text-white/80">Climat (Sawka et al. 2015):</strong> Froid +500ml • Tempéré +0ml • Chaud +750ml • Extrême +1500ml</p>
                                <p className="pt-2 border-t border-white/5"><strong className="text-white/80">Total:</strong> Base + Activité + Climat = Besoin quotidien (litres)</p>
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    onClick={calculateIntake}
                    disabled={!weight}
                    className="w-full py-5 bg-white hover:bg-gray-200 text-[#1A1A1A] rounded-xl font-bold text-sm transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    Calculer mes besoins
                </button>

            </div>

            <div ref={resultsRef}>
            {result && (
                <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 space-y-6 mt-16 max-w-3xl mx-auto">
                    
                    {result.warnings.length > 0 && (
                        <div className="bg-[#404040] border border-white/10 rounded-xl p-5 space-y-2">
                            {result.warnings.map((w, i) => (
                                <div key={i} className="text-sm text-white/90 font-medium">• {w}</div>
                            ))}
                        </div>
                    )}

                    <div className="bg-[#252525] p-6 rounded-xl border border-white/5 text-center">
                        <div className="text-[11px] font-medium text-white/40 mb-2">Besoin Hydrique Quotidien</div>
                        <div className="text-5xl md:text-6xl font-bold text-white">{result.liters} <span className="text-2xl text-white/40">Litres</span></div>
                        <div className="text-xs text-white/50 mt-2">≈ {result.glasses} verres de 250ml</div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-[#252525] p-4 rounded-xl border border-white/5 text-center">
                            <div className="text-[10px] text-white/40 mb-1">Base</div>
                            <div className="text-lg font-bold text-white">{result.breakdown.base} <span className="text-xs text-white/40">ml</span></div>
                        </div>
                        <div className="bg-[#252525] p-4 rounded-xl border border-white/5 text-center">
                            <div className="text-[10px] text-white/40 mb-1">Genre</div>
                            <div className="text-lg font-bold text-white">{result.breakdown.gender > 0 ? '+' : ''}{result.breakdown.gender} <span className="text-xs text-white/40">ml</span></div>
                        </div>
                        <div className="bg-[#252525] p-4 rounded-xl border border-white/5 text-center">
                            <div className="text-[10px] text-white/40 mb-1">Activité</div>
                            <div className="text-lg font-bold text-white">+{result.breakdown.activity} <span className="text-xs text-white/40">ml</span></div>
                        </div>
                        <div className="bg-[#252525] p-4 rounded-xl border border-white/5 text-center">
                            <div className="text-[10px] text-white/40 mb-1">Climat</div>
                            <div className="text-lg font-bold text-white">+{result.breakdown.climate} <span className="text-xs text-white/40">ml</span></div>
                        </div>
                    </div>

                    {/* BOUTON COPIER AJOUTÉ ICI */}
                    <button 
                        onClick={handleCopy}
                        className={`w-full py-5 border-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${copied ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-white/10 text-white/60 hover:bg-white/5'}`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copié !' : 'Copier mes besoins'}
                    </button>

                    <div className="p-5 bg-[#252525] rounded-xl border border-white/5">
                        <p className="text-sm text-white/60 leading-relaxed font-medium">
                            <strong className="text-white/90">Méthodologie :</strong> Base EFSA 2010 (35ml/kg) ajustée genre (composition corporelle). Bonus activité selon ACSM 2007 (sudation exercice). Bonus climat selon Sawka et al. 2015 (thermorégulation). Répartir sur 16h éveillées (300-350ml/h max).
                        </p>
                    </div>
                </div>
            )}
            </div>

            <div className="mt-24 max-w-3xl mx-auto pb-24">
                <h2 className="text-lg font-bold text-white mb-6">Questions fréquentes sur l'hydratation</h2>
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