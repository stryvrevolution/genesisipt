'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BarChart3, ArrowLeft } from 'lucide-react';

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
      bodyDensity = 1.10938 - (0.0008267 * sum3) + (0.0000016 * (sum3 ** 2)) - (0.0002574 * a);
    } else {
      bodyDensity = 1.0994921 - (0.0009929 * sum3) + (0.0000023 * (sum3 ** 2)) - (0.0001392 * a);
    }
    const bf = ((4.95 / bodyDensity) - 4.50) * 100;
    return bf;
  };

  // ========================================
  // CATÉGORISATION ACE STANDARDS
  // ========================================
  const getCategory = (bf: number, sex: Gender): { category: string; desc: string } => {
    if (sex === 'male') {
      if (bf < 6) return { category: 'ESSENTIEL', desc: 'Graisse corporelle essentielle (dangereux <3%)' };
      if (bf < 14) return { category: 'ATHLÈTE', desc: 'Niveau athlète d\'élite' };
      if (bf < 18) return { category: 'FITNESS', desc: 'Forme physique optimale' };
      if (bf < 25) return { category: 'ACCEPTABLE', desc: 'Santé générale acceptable' };
      return { category: 'OBÉSITÉ', desc: 'Risques cardiométaboliques élevés' };
    } else {
      if (bf < 14) return { category: 'ESSENTIEL', desc: 'Graisse essentielle (dangereux <10%)' };
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

    const minBF = gender === 'male' ? 3 : 10;
    const maxBF = 60;
    if (bf < minBF) bf = minBF;
    if (bf > maxBF) bf = maxBF;

    const { category, desc } = getCategory(bf, gender);
    const fm = (w * bf) / 100;
    const lm = w - fm;

    const warnings: string[] = [];
    const bmi = w / ((h / 100) ** 2);
    
    if (bmi < 18.5) warnings.push('IMC <18.5: Formule moins précise pour profils sous-poids');
    else if (bmi > 35) warnings.push('IMC >35: Formule sous-estime BF%. DEXA recommandé');
    
    if (method === 'navy') {
      const wa = parseFloat(waist);
      const whr = wa / h;
      if (whr > 0.6) warnings.push('Ratio Taille/Hauteur >0.6: Risque cardiométabolique élevé');
    }
    
    if (a > 60) warnings.push('Âge >60 ans: Redistribution graisseuse possible. Marge d\'erreur accrue');

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
    <main className="flex flex-col md:flex-row min-h-screen bg-white font-outfit text-[#303030]">
      
      {/* SECTION GAUCHE : DESIGN CARTE HUB "ÉTENDUE" */}
      <section className="w-full md:w-5/12 lg:w-1/3 bg-[#1A1A1A] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] md:min-h-screen border-r border-white/5 shadow-[20px_0_40px_-10px_rgba(0,0,0,0.2)] z-20">
        
        {/* Filigrane d'arrière-plan */}
        <div className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none select-none">
           <BarChart3 className="w-80 h-80 stroke-[0.5]" />
        </div>

        <div className="relative z-10">
          {/* Back Link */}
          <Link 
            href="/outils" 
            className="group inline-flex items-center text-white/40 hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold mb-12 transition-colors"
          >
            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour au Hub
          </Link>
          
          {/* Header identique à la carte Hub */}
          <div className="flex flex-col items-start gap-6 mb-10">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] flex items-center justify-center text-white">
                   <BarChart3 className="w-7 h-7 stroke-[1.5]" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">
                   Composition
                </span>
            </div>
            
            <div className="font-mono text-[10px] text-white/10 font-bold">
              ID: 02
            </div>
          </div>
          
          {/* Titre */}
          <h1 className="text-white text-4xl md:text-5xl font-azonix italic uppercase tracking-tighter mb-8 leading-[0.9]">
            Body Fat %
          </h1>
          
          <div className="space-y-8">
            <p className="text-white/50 text-[13px] leading-relaxed font-light border-t border-white/5 pt-6">
              Estimation précise de votre taux de masse grasse via les méthodes US Navy (mètre ruban) ou Jackson-Pollock (plis cutanés).
            </p>

            {/* Info Box */}
            <div className="bg-[#0E0E0E] border border-white/5 rounded-xl p-5">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[#DAFA72] text-[10px] uppercase tracking-widest font-bold">Méthode Navy</span>
                    <span className="text-white/60 font-mono text-[10px]">±3-5%</span>
                 </div>
                 <div className="w-full h-px bg-white/5 mb-3"></div>
                 <p className="text-white/40 text-[11px] leading-relaxed">
                   Recommandée pour la majorité des profils. Nécessite uniquement un mètre ruban.
                 </p>
            </div>
          </div>
        </div>

        {/* Footer Sidebar */}
        <div className="relative z-10 mt-12 md:mt-0 flex justify-between items-end text-white/20">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-white transition-colors cursor-default">
            Initialiser
          </p>
          <span className="font-azonix text-xs opacity-30">V3.0</span>
        </div>
      </section>

      {/* SECTION DROITE (CONTENU) */}
      <section className="flex-1 bg-white relative overflow-y-auto">
        <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-center p-8 md:p-16 lg:p-24">
          
          <div className="w-full space-y-12">
            
            {/* CONFIGURATION */}
            <div className="space-y-8">
              
              {/* MÉTHODE */}
              <div>
                <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-4 font-bold opacity-40">
                  Méthode de Calcul
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => { setMethod('navy'); setResult(null); }}
                    className={`p-4 rounded-xl text-left transition-all border-2 ${
                      method === 'navy'
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-lg' // COULEUR #1A1A1A
                      : 'border-black/5 text-black/60 hover:border-black/20 bg-white'
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
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-lg' // COULEUR #1A1A1A
                      : 'border-black/5 text-black/60 hover:border-black/20 bg-white'
                    }`}
                  >
                    <div className="text-sm font-bold uppercase tracking-wider mb-1">Plis Cutanés</div>
                    <div className="text-[10px] opacity-70">Pince adipomètre • ±3-4%</div>
                    <div className="text-[9px] opacity-50 mt-2">Avancé (+Précis)</div>
                  </button>
                </div>
              </div>

              {/* GENRE */}
              <div>
                <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-4 font-bold opacity-40">
                  Sexe Biologique
                </label>
                <div className="grid grid-cols-2 gap-4 border-b border-black/5 pb-8">
                  <button 
                    onClick={() => { setGender('male'); setResult(null); }}
                    className={`flex items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                      gender === 'male' 
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg' // COULEUR #1A1A1A
                      : 'bg-white text-black/40 border-black/10 hover:border-black/30 hover:text-black/60'
                    }`}
                  >
                    <span className="text-[12px] uppercase tracking-[0.2em] font-bold">Homme</span>
                  </button>
                  <button 
                    onClick={() => { setGender('female'); setResult(null); }}
                    className={`flex items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                      gender === 'female' 
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg' // COULEUR #1A1A1A
                      : 'bg-white text-black/40 border-black/10 hover:border-black/30 hover:text-black/60'
                    }`}
                  >
                    <span className="text-[12px] uppercase tracking-[0.2em] font-bold">Femme</span>
                  </button>
                </div>
              </div>

              {/* INPUTS DE BASE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="relative group">
                    <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#DAFA72] transition-all">Âge</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="30" className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#DAFA72] transition-all placeholder:text-black/5" />
                 </div>
                 <div className="relative group">
                    <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#DAFA72] transition-all">Poids (kg)</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="75" className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#DAFA72] transition-all placeholder:text-black/5" />
                 </div>
                 <div className="relative group">
                    <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#DAFA72] transition-all">Taille (cm)</label>
                    <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="180" className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#DAFA72] transition-all placeholder:text-black/5" />
                 </div>
              </div>

              {/* INPUTS SPÉCIFIQUES US NAVY */}
              {method === 'navy' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4">
                  <div className="relative group">
                    <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#DAFA72] transition-all">Cou (cm)</label>
                    <input type="number" value={neck} onChange={(e) => setNeck(e.target.value)} placeholder="38" className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#DAFA72] transition-all placeholder:text-black/5" />
                  </div>
                  <div className="relative group">
                    <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#DAFA72] transition-all">Taille (cm)</label>
                    <input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="80" className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#DAFA72] transition-all placeholder:text-black/5" />
                  </div>
                  {gender === 'female' && (
                    <div className="relative group">
                      <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#DAFA72] transition-all">Hanches (cm)</label>
                      <input type="number" value={hips} onChange={(e) => setHips(e.target.value)} placeholder="95" className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#DAFA72] transition-all placeholder:text-black/5" />
                    </div>
                  )}
                </div>
              )}

              {/* INPUTS SKINFOLD */}
              {method === 'skinfold' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-4">
                   {gender === 'male' ? (
                     <>
                       <div className="relative group">
                         <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#DAFA72] transition-all">Pectoral (mm)</label>
                         <input type="number" value={chest} onChange={(e) => setChest(e.target.value)} className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#DAFA72] transition-all" />
                       </div>
                       <div className="relative group">
                         <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#DAFA72] transition-all">Abdo (mm)</label>
                         <input type="number" value={abdominal} onChange={(e) => setAbdominal(e.target.value)} className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#DAFA72] transition-all" />
                       </div>
                       <div className="relative group">
                         <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#DAFA72] transition-all">Cuisse (mm)</label>
                         <input type="number" value={thigh} onChange={(e) => setThigh(e.target.value)} className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#DAFA72] transition-all" />
                       </div>
                     </>
                   ) : (
                     <>
                        <div className="relative group">
                         <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#DAFA72] transition-all">Triceps (mm)</label>
                         <input type="number" value={triceps} onChange={(e) => setTriceps(e.target.value)} className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#DAFA72] transition-all" />
                       </div>
                       <div className="relative group">
                         <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#DAFA72] transition-all">Supra (mm)</label>
                         <input type="number" value={suprailiac} onChange={(e) => setSuprailiac(e.target.value)} className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#DAFA72] transition-all" />
                       </div>
                       <div className="relative group">
                         <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#DAFA72] transition-all">Cuisse (mm)</label>
                         <input type="number" value={thigh} onChange={(e) => setThigh(e.target.value)} className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#DAFA72] transition-all" />
                       </div>
                     </>
                   )}
                </div>
              )}

              {/* ACTION BUTTON (Corrigé: #1A1A1A) */}
              <button 
                onClick={calculateBodyFat} 
                className="w-full group relative overflow-hidden rounded-full bg-[#1A1A1A] p-5 transition-all duration-300 hover:bg-[#DAFA72] hover:shadow-[0_0_30px_-5px_rgba(218,250,114,0.4)]"
              >
                <span className="relative z-10 text-white text-[13px] font-bold uppercase tracking-[0.15em] group-hover:text-[#1A1A1A] transition-colors">
                  Calculer
                </span>
              </button>
            </div>

            {/* RÉSULTATS */}
            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="w-full h-px bg-black/5 mb-12" />

                <div className="relative overflow-hidden rounded-[32px] bg-[#1A1A1A] p-10 text-center shadow-2xl mb-12">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-50" />
                  
                  <h3 className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-[#DAFA72] mb-6">
                    Résultat ({result.category})
                  </h3>
                  
                  <div className="relative flex items-baseline justify-center gap-2">
                    <span className="text-8xl md:text-9xl font-light tracking-tighter text-white">
                      {result.bodyFat}
                    </span>
                    <span className="text-4xl font-medium text-white/30 uppercase tracking-widest">%</span>
                  </div>

                  <div className="relative mt-8 grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <div className="bg-white/5 rounded-xl p-3">
                        <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Masse Grasse</div>
                        <div className="text-xl text-white font-light">{result.fatMass} kg</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                        <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Masse Maigre</div>
                        <div className="text-xl text-white font-light">{result.leanMass} kg</div>
                    </div>
                  </div>
                </div>

                {result.warnings.length > 0 && (
                  <div className="mt-8 bg-orange-50 border border-orange-100 p-4 rounded-xl">
                    {result.warnings.map((w, i) => (
                      <p key={i} className="text-[11px] text-orange-600 font-medium flex items-center gap-2 mb-1 last:mb-0">
                        • <span dangerouslySetInnerHTML={{ __html: w }} />
                      </p>
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