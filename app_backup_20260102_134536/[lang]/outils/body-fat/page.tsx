'use client';

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';

type Gender = 'male' | 'female';
type Method = 'navy' | 'skinfold';

export default function BodyFatPage() {
  const [method, setMethod] = useState<Method>('navy');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  
  // US Navy inputs
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  
  // Skinfold inputs
  const [chest, setChest] = useState('');
  const [abdominal, setAbdominal] = useState('');
  const [thigh, setThigh] = useState('');
  const [triceps, setTriceps] = useState('');
  const [suprailiac, setSuprailiac] = useState('');
  
  const [result, setResult] = useState<{
    bodyFat: number;
    fatMass: number;
    leanMass: number;
    category: string;
    categoryDesc: string;
    marginOfError: string;
    methodUsed: string;
    warnings: string[];
  } | null>(null);

  // ========================================
  // US NAVY METHOD
  // ========================================
  
  const calculateNavy = (w: number, h: number, n: number, wa: number, hi: number, a: number): number => {
    let bf: number;

    if (gender === 'male') {
      bf = 86.010 * Math.log10(wa - n) - 70.041 * Math.log10(h) + 36.76;
    } else {
      bf = 163.205 * Math.log10(wa + hi - n) - 97.684 * Math.log10(h) - 78.387;
    }

    return bf;
  };

  // ========================================
  // JACKSON-POLLOCK 3-SITE SKINFOLD METHOD
  // ========================================
  
  const calculateSkinfold = (sum3: number, a: number): number => {
    let bodyDensity: number;

    if (gender === 'male') {
      // Jackson-Pollock 3-Site (Chest, Abdomen, Thigh)
      bodyDensity = 1.10938 - (0.0008267 * sum3) + (0.0000016 * (sum3 ** 2)) - (0.0002574 * a);
    } else {
      // Jackson-Pollock 3-Site (Triceps, Suprailiac, Thigh)
      bodyDensity = 1.0994921 - (0.0009929 * sum3) + (0.0000023 * (sum3 ** 2)) - (0.0001392 * a);
    }

    // Siri Equation
    const bf = ((4.95 / bodyDensity) - 4.50) * 100;
    return bf;
  };

  // ========================================
  // CATÉGORISATION ACE STANDARDS
  // ========================================
  
  const getCategory = (bf: number, sex: Gender): { category: string; desc: string } => {
    if (sex === 'male') {
      if (bf < 6) return { category: 'ESSENTIEL', desc: 'Graisse corporelle essentielle (dangereux &lt;3%)' };
      if (bf < 14) return { category: 'ATHLÈTE', desc: 'Niveau athlète d\'élite' };
      if (bf < 18) return { category: 'FITNESS', desc: 'Forme physique optimale' };
      if (bf < 25) return { category: 'ACCEPTABLE', desc: 'Santé générale acceptable' };
      return { category: 'OBÉSITÉ', desc: 'Risques cardiométaboliques élevés' };
    } else {
      if (bf < 14) return { category: 'ESSENTIEL', desc: 'Graisse essentielle (dangereux &lt;10%)' };
      if (bf < 21) return { category: 'ATHLÈTE', desc: 'Niveau athlète d\'élite' };
      if (bf < 25) return { category: 'FITNESS', desc: 'Forme physique optimale' };
      if (bf < 32) return { category: 'ACCEPTABLE', desc: 'Santé générale acceptable' };
      return { category: 'OBÉSITÉ', desc: 'Risques cardiométaboliques élevés' };
    }
  };

  // ========================================
  // FONCTION PRINCIPALE DE CALCUL
  // ========================================
  
  const calculateBodyFat = () => {
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
      methodName = 'US Navy Method';
      marginError = '±3-5%';

    } else {
      // Skinfold Method
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
      methodName = 'Jackson-Pollock 3-Site';
      marginError = '±3-4%';
    }

    // Limites physiologiques
    const minBF = gender === 'male' ? 3 : 10;
    const maxBF = 60;
    
    if (bf < minBF) bf = minBF;
    if (bf > maxBF) bf = maxBF;

    // Catégorisation
    const { category, desc } = getCategory(bf, gender);

    // Masses
    const fm = (w * bf) / 100;
    const lm = w - fm;

    // ========================================
    // WARNINGS
    // ========================================
    
    const warnings: string[] = [];
    const bmi = w / ((h / 100) ** 2);
    
    // Warning 1: IMC extrêmes
    if (bmi < 18.5) {
      warnings.push('IMC &lt;18.5: Formule moins précise pour profils sous-poids');
    } else if (bmi > 35) {
      warnings.push('IMC &gt;35: Formule sous-estime BF%. DEXA recommandé');
    }
    
    // Warning 2: Navy-specific
    if (method === 'navy') {
      const n = parseFloat(neck);
      const wa = parseFloat(waist);
      const whr = wa / h;
      
      if (whr > 0.6) {
        warnings.push('Ratio Taille/Hauteur &gt;0.6: Risque cardiométabolique élevé');
      }
      
      if (gender === 'male' && n > 42 && bf < 12) {
        warnings.push('Profil athlétique (cou &gt;42cm): Formule peut sous-estimer. Essayez la méthode plis cutanés');
      }
      
      if (gender === 'female' && n > 36 && bf < 18) {
        warnings.push('Profil athlétique: Formule peut sous-estimer. Essayez la méthode plis cutanés');
      }
    }
    
    // Warning 3: Skinfold-specific
    if (method === 'skinfold') {
      let sum3: number;
      
      if (gender === 'male') {
        sum3 = parseFloat(chest) + parseFloat(abdominal) + parseFloat(thigh);
      } else {
        sum3 = parseFloat(triceps) + parseFloat(suprailiac) + parseFloat(thigh);
      }
      
      if (sum3 > 130) {
        warnings.push('Somme des plis &gt;130mm: Précision réduite. Envisagez DEXA pour obésité sévère');
      }
      
      warnings.push('ℹ️ Précision dépend de la technique de mesure. Même opérateur recommandé pour suivi');
    }
    
    // Warning 4: Âge
    if (a > 60) {
      warnings.push('Âge &gt;60 ans: Redistribution graisseuse possible. Marge d\'erreur accrue');
    }
    
    // Warning 5: BF% critique
    if (gender === 'male' && bf < 6) {
      warnings.push('⚠️ BF% &lt;6%: Niveau dangereux. Risque hormonal et immunitaire');
    }
    
    if (gender === 'female' && bf < 13) {
      warnings.push('⚠️ BF% &lt;13%: Risque aménorrhée et déminéralisation osseuse');
    }

    setResult({
      bodyFat: Math.round(bf * 10) / 10,
      fatMass: Math.round(fm * 10) / 10,
      leanMass: Math.round(lm * 10) / 10,
      category: category,
      categoryDesc: desc,
      marginOfError: marginError,
      methodUsed: methodName,
      warnings
    });
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-white font-sans" style={{ fontFamily: 'var(--font-outfit)' }}>
      
      {/* SECTION GAUCHE */}
      <section className="w-full md:w-1/3 bg-[#0E0E0E] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] md:min-h-screen">
        
        <div className="relative z-10">
          <Link href="/outils" className="inline-flex items-center text-white/40 hover:text-white text-xs mb-12 transition-colors uppercase tracking-widest font-bold">
            ← Retour aux outils
          </Link>
          
          <div className="text-[#DAFA72] text-[11px] font-bold tracking-widest uppercase mb-4">
            Analyse Composition Corporelle
          </div>
          
          <h1 className="text-white text-5xl md:text-6xl leading-[0.9] mb-8" style={{ fontFamily: 'var(--font-azonix)' }}>
            BODY<br />FAT
          </h1>
          
          <div className="space-y-6">
            <p className="text-white/80 text-sm font-medium leading-relaxed max-w-sm">
              Deux méthodes scientifiquement validées pour estimer votre composition corporelle sans équipement médical.
            </p>

            {/* Méthodologie US Navy */}
            <div className="space-y-3">
              <h3 className="text-white text-[10px] uppercase tracking-widest font-bold opacity-40">US Navy Method</h3>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Matériel</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Mètre ruban uniquement (~5€). Accessible à tous.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Précision</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  ±3-5% vs DEXA. Validée sur 6000+ militaires US (Hodgdon & Beckett 1984).
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Limites</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Précision réduite pour : athlètes (cou &gt;42cm), obésité morbide (IMC &gt;35), personnes &gt;60 ans.
                </p>
              </div>
            </div>

            {/* Méthodologie Plis Cutanés */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="text-white text-[10px] uppercase tracking-widest font-bold opacity-40">Jackson-Pollock 3-Site</h3>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Matériel</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Pince adipomètre (~20€). Mesure directe du tissu adipeux sous-cutané.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Précision</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  ±3-4% vs DEXA. Légèrement plus précise que US Navy. Validée sur 10,000+ sujets.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Technique</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Mesures en millimètres. Courbe d'apprentissage. Même opérateur pour suivi optimal.
                </p>
              </div>
            </div>

            {/* Références */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/40 text-[10px] leading-relaxed">
                <span className="font-bold uppercase tracking-wider">Références:</span>
                <br />US Navy: Hodgdon & Beckett (1984)
                <br />Jackson-Pollock: J&P (1978, 1980)
                <br />Catégories: ACE Standards (2021)
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 md:mt-0">
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
            GENESIS LAB — BODY FAT V3.0
          </p>
        </div>

        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#DAFA72] rounded-full blur-[120px] opacity-10 pointer-events-none" />
      </section>

      {/* SECTION DROITE */}
      <section className="flex-1 p-8 md:p-16 lg:p-24 flex items-center justify-center bg-white relative">
        <div className="w-full max-w-2xl">
          
          <div className="space-y-10">
            
            {/* SÉLECTION MÉTHODE */}
            <div>
              <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-4 font-bold opacity-40">
                Méthode de Calcul
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => { setMethod('navy'); setResult(null); }}
                  className={`p-4 rounded-xl text-left transition-all border-2 ${
                    method === 'navy'
                    ? 'border-[#303030] bg-[#303030] text-white' 
                    : 'border-black/10 text-black/60 hover:border-black/30 bg-white'
                  }`}
                >
                  <div className="text-sm font-bold uppercase tracking-wider mb-1">US Navy</div>
                  <div className="text-[10px] opacity-70">Mètre ruban • ±3-5%</div>
                  <div className="text-[9px] opacity-50 mt-2">Recommandé (Simple)</div>
                </button>
                
                <button 
                  onClick={() => { setMethod('skinfold'); setResult(null); }}
                  className={`p-4 rounded-xl text-left transition-all border-2 ${
                    method === 'skinfold'
                    ? 'border-[#303030] bg-[#303030] text-white' 
                    : 'border-black/10 text-black/60 hover:border-black/30 bg-white'
                  }`}
                >
                  <div className="text-sm font-bold uppercase tracking-wider mb-1">Plis Cutanés</div>
                  <div className="text-[10px] opacity-70">Pince adipomètre • ±3-4%</div>
                  <div className="text-[9px] opacity-50 mt-2">Avancé (+Précis)</div>
                </button>
              </div>
            </div>

            {/* GENRE */}
            <div className="flex gap-8 mb-8 border-b border-black/5 pb-4">
              <button 
                onClick={() => { setGender('male'); setResult(null); }}
                className={`text-sm uppercase tracking-widest transition-colors ${gender === 'male' ? 'text-[#303030] font-bold border-b-2 border-[#DAFA72]' : 'text-black/30 hover:text-black/60'}`}
              >
                Homme
              </button>
              <button 
                onClick={() => { setGender('female'); setResult(null); }}
                className={`text-sm uppercase tracking-widest transition-colors ${gender === 'female' ? 'text-[#303030] font-bold border-b-2 border-[#DAFA72]' : 'text-black/30 hover:text-black/60'}`}
              >
                Femme
              </button>
            </div>

            {/* INPUTS COMMUNS */}
            <div className="grid grid-cols-3 gap-6">
              <div className="relative group">
                <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                  Âge
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="30"
                  className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                />
              </div>
              
              <div className="relative group">
                <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                  Poids (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="75"
                  className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                />
              </div>
              
              <div className="relative group">
                <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                  Taille (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="180"
                  className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                />
              </div>
            </div>

            {/* INPUTS SPÉCIFIQUES US NAVY */}
            {method === 'navy' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative group">
                    <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                      Tour de Cou (cm)
                      <span className="block text-[9px] text-black/30 font-normal mt-1">Sous pomme d'Adam</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={neck}
                      onChange={(e) => setNeck(e.target.value)}
                      placeholder="38"
                      className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                      Tour de Taille (cm)
                      <span className="block text-[9px] text-black/30 font-normal mt-1">Au nombril, expiré</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      placeholder="80"
                      className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                    />
                  </div>
                </div>

                {gender === 'female' && (
                  <div className="relative group animate-in fade-in slide-in-from-top-2">
                    <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                      Tour de Hanches (cm)
                      <span className="block text-[9px] text-black/30 font-normal mt-1">Point le plus large</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={hips}
                      onChange={(e) => setHips(e.target.value)}
                      placeholder="95"
                      className="w-full bg-transparent border-b border-black/10 py-3 text-3xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                    />
                  </div>
                )}
              </div>
            )}

            {/* INPUTS SPÉCIFIQUES PLIS CUTANÉS */}
            {method === 'skinfold' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-[10px] text-amber-800 font-medium">
                    📏 Mesures en millimètres avec pince adipomètre. Pincer le pli vertical, mesurer à mi-distance entre crête et base.
                  </p>
                </div>

                {gender === 'male' ? (
                  // Homme: Pectoraux, Abdomen, Cuisse
                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative group">
                      <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                        Pectoral (mm)
                        <span className="block text-[9px] text-black/30 font-normal mt-1">Pli diagonal</span>
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={chest}
                        onChange={(e) => setChest(e.target.value)}
                        placeholder="12"
                        className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                      />
                    </div>

                    <div className="relative group">
                      <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                        Abdominal (mm)
                        <span className="block text-[9px] text-black/30 font-normal mt-1">2cm à droite nombril</span>
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={abdominal}
                        onChange={(e) => setAbdominal(e.target.value)}
                        placeholder="18"
                        className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                      />
                    </div>

                    <div className="relative group">
                      <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                        Cuisse (mm)
                        <span className="block text-[9px] text-black/30 font-normal mt-1">Mi-distance aine-rotule</span>
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={thigh}
                        onChange={(e) => setThigh(e.target.value)}
                        placeholder="15"
                        className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                      />
                    </div>
                  </div>
                ) : (
                  // Femme: Triceps, Suprailliaque, Cuisse
                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative group">
                      <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                        Triceps (mm)
                        <span className="block text-[9px] text-black/30 font-normal mt-1">Arrière bras</span>
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={triceps}
                        onChange={(e) => setTriceps(e.target.value)}
                        placeholder="18"
                        className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                      />
                    </div>

                    <div className="relative group">
                      <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                        Suprailliaque (mm)
                        <span className="block text-[9px] text-black/30 font-normal mt-1">Au-dessus crête iliaque</span>
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={suprailiac}
                        onChange={(e) => setSuprailiac(e.target.value)}
                        placeholder="20"
                        className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                      />
                    </div>

                    <div className="relative group">
                      <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                        Cuisse (mm)
                        <span className="block text-[9px] text-black/30 font-normal mt-1">Mi-distance aine-rotule</span>
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={thigh}
                        onChange={(e) => setThigh(e.target.value)}
                        placeholder="22"
                        className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={calculateBodyFat}
              className="group w-full relative inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#1A1A1A] text-white text-[13px] font-medium tracking-wide transition-all duration-300 hover:bg-[#DAFA72] hover:text-[#1A1A1A] cursor-pointer mt-8"
            >
              <span className="relative z-10">Calculer BF%</span>
            </button>

            {/* RÉSULTATS */}
            {result && (
              <div className="mt-16 pt-12 border-t border-black/5 animate-in fade-in duration-700">
                
                {/* Principal */}
                <div className="flex flex-col items-center mb-12">
                  <span className="text-black/40 text-[10px] uppercase tracking-[0.2em] mb-4">
                    Masse Grasse Estimée
                  </span>
                  <div className="flex items-baseline justify-center gap-2 text-[#303030]">
                    <span className="text-[clamp(4rem,8vw,6rem)] leading-none" style={{ fontFamily: 'var(--font-azonix)' }}>
                      {result.bodyFat}
                    </span>
                    <span className="text-3xl text-[#DAFA72]" style={{ fontFamily: 'var(--font-azonix)' }}>%</span>
                  </div>
                  
                  <div className="mt-4 px-4 py-2 bg-black/5 rounded-full">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#303030]">{result.category}</span>
                  </div>
                  
                  <p className="mt-2 text-[10px] text-black/40 text-center" dangerouslySetInnerHTML={{ __html: result.categoryDesc }} />
                  
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                      <span className="text-[9px] font-medium text-blue-700">Méthode: {result.methodUsed}</span>
                    </div>
                    <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">
                      <span className="text-[9px] font-medium text-amber-700">Marge d'erreur: {result.marginOfError}</span>
                    </div>
                  </div>
                </div>

                {/* Masses */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-[#FAFAFA] border border-black/5 rounded-2xl text-center">
                    <span className="block text-[10px] uppercase tracking-widest text-black/30 mb-2">Masse Grasse</span>
                    <span className="text-2xl text-[#303030] font-light">{result.fatMass} kg</span>
                  </div>
                  <div className="p-6 bg-[#FAFAFA] border border-black/5 rounded-2xl text-center">
                    <span className="block text-[10px] uppercase tracking-widest text-black/30 mb-2">Masse Maigre</span>
                    <span className="text-2xl text-[#303030] font-light">{result.leanMass} kg</span>
                  </div>
                </div>

                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <div className="space-y-2">
                    {result.warnings.map((warning, i) => (
                      <div key={i} className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                        <p className="text-[11px] text-amber-800 font-medium" dangerouslySetInnerHTML={{ __html: warning }} />
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}