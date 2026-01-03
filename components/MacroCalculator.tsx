'use client'; 

import { useState } from 'react';
import { calculateOptimalMacros } from '../utils/macroCalculator';

// 1. DÉFINITION DU TYPE DE DONNÉES (Basé sur vos erreurs)
type ResultData = {
  calories: number;
  tdee: number;
  leanMass: number;
  estimatedBF: number;
  macros: { p: number; f: number; c: number };
  ratios: { p: number; f: number; c: number };
  percents: { p: number; f: number; c: number };
  breakdown: { [key: string]: number }; // Permet l'accès dynamique par clé string
  adjustment: number;
  warnings: string[];
};

export default function MacroCalculator() {
  const [formData, setFormData] = useState({
    gender: 'male',
    weight: '', height: '', age: '',
    bodyFat: '',
    steps: '5000', workouts: '3',
    goal: 'deficit'
  });

  // 2. TYPAGE DU STATE (On dit que ça peut être ResultData OU null)
  const [result, setResult] = useState<ResultData | null>(null);
  
  const [showTdeeDetails, setShowTdeeDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  // 3. TYPAGE DE L'ÉVÉNEMENT INPUT
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 4. TYPAGE DE L'ÉVÉNEMENT FORM
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.weight || !formData.height || !formData.age) return;
    
    // On force le typage du retour de la fonction utilitaire si nécessaire
    const data = calculateOptimalMacros(formData) as ResultData;
    setResult(data);
  };

  const placeholders = {
    weight: formData.gender === 'male' ? '75' : '60',
    height: formData.gender === 'male' ? '180' : '165',
    bodyFat: formData.gender === 'male' ? '15' : '22'
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* SÉLECTEUR GENRE */}
        <div>
          <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-4 font-bold opacity-40">
            Genre (Calcul LBM)
          </label>
          <div className="grid grid-cols-2 gap-4 border-b border-black/5 pb-8">
            {[
              { val: 'male', label: 'Homme' },
              { val: 'female', label: 'Femme' }
            ].map((opt) => (
              <button 
                key={opt.val}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, gender: opt.val }))}
                className={`flex items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                  formData.gender === opt.val
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg' 
                  : 'bg-white text-black/40 border-black/10 hover:border-black/30 hover:text-black/60'
                }`}
              >
                <span className="text-[12px] uppercase tracking-[0.2em] font-bold">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* INPUTS BIOMÉTRIQUES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative group">
            <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">
              Poids (kg)
            </label>
            <input 
              type="number" 
              name="weight" 
              value={formData.weight} 
              onChange={handleChange} 
              className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5" 
              placeholder={placeholders.weight} 
              required 
            />
          </div>
          <div className="relative group">
            <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">
              Taille (cm)
            </label>
            <input 
              type="number" 
              name="height" 
              value={formData.height} 
              onChange={handleChange} 
              className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5" 
              placeholder={placeholders.height} 
              required 
            />
          </div>
          <div className="relative group">
            <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">
              Âge
            </label>
            <input 
              type="number" 
              name="age" 
              value={formData.age} 
              onChange={handleChange} 
              className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5" 
              placeholder="30" 
              required 
            />
          </div>
        </div>

        {/* ACTIVITÉ & OBJECTIF */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative group">
            <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">
              Pas / Jour 
              <span className="ml-2 text-[8px] opacity-50 normal-case tracking-normal">(NEAT)</span>
            </label>
            <input 
              type="number" 
              name="steps" 
              value={formData.steps} 
              onChange={handleChange} 
              className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5" 
              placeholder="7000" 
            />
          </div>
          <div className="relative group">
            <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">
              Séances / Semaine
              <span className="ml-2 text-[8px] opacity-50 normal-case tracking-normal">(EAT)</span>
            </label>
            <input 
              type="number" 
              name="workouts" 
              value={formData.workouts} 
              onChange={handleChange} 
              className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5" 
              placeholder="3" 
            />
          </div>
        </div>

        {/* OBJECTIF */}
        <div>
          <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-4 font-bold opacity-40">
            Objectif métabolique
          </label>
          <div className="space-y-3">
            {[
              { val: 'deficit', label: 'Perte de Gras', desc: 'Déficit Stratifié' },
              { val: 'maintenance', label: 'Maintenance', desc: 'Homéostasie' },
              { val: 'surplus', label: 'Prise de Muscle', desc: 'Lean Bulk' }
            ].map((opt) => (
              <button 
                key={opt.val}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, goal: opt.val }))}
                className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                  formData.goal === opt.val
                  ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-lg' 
                  : 'border-black/5 text-black/60 hover:border-black/20 bg-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-bold uppercase tracking-wider mb-1">{opt.label}</div>
                    <div className="text-[10px] opacity-70">{opt.desc}</div>
                  </div>
                  {formData.goal === opt.val && <div className="w-2 h-2 rounded-full bg-[#DAFA72]" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full group relative overflow-hidden rounded-full bg-[#1A1A1A] p-5 transition-all duration-300 hover:bg-[#DAFA72] hover:shadow-[0_0_30px_-5px_rgba(218,250,114,0.4)] mt-8"
        >
          <span className="relative z-10 text-white text-[13px] font-bold uppercase tracking-[0.15em] group-hover:text-[#1A1A1A] transition-colors">
            Générer mon plan nutritionnel
          </span>
        </button>
      </form>

      {/* RÉSULTATS */}
      {result && (
        <div className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-full h-px bg-black/5 mb-12" />
          
          {/* Black Card Principale */}
          <div className="relative overflow-hidden rounded-[32px] bg-[#1A1A1A] p-10 text-center shadow-2xl mb-12 group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-50" />
            
            <h3 className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-[#DAFA72] mb-6">
              Cible Calorique
            </h3>
            
            <div className="relative flex items-baseline justify-center gap-2 mb-4">
              <span className="text-8xl md:text-9xl font-light tracking-tighter text-white">
                {result.calories}
              </span>
              <span className="text-2xl font-medium text-white/30 uppercase tracking-widest">
                Kcal
              </span>
            </div>
            
            <p className="relative text-[10px] text-white/40 uppercase tracking-widest font-medium mb-8">
              TDEE estimé : {result.tdee} kcal
            </p>
            
            {/* Toggle TDEE Details */}
            <div className="relative border-t border-white/5 pt-6">
                <button 
                  type="button"
                  onClick={() => setShowTdeeDetails(!showTdeeDetails)} 
                  className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#DAFA72] hover:opacity-80 transition-all"
                >
                    {showTdeeDetails ? '− Masquer le breakdown' : '+ Voir détails métaboliques'}
                </button>
                {showTdeeDetails && (
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
                        {['bmr', 'neat', 'eat', 'tef'].map((key) => (
                            <div key={key} className="space-y-1 bg-white/5 p-2 rounded-lg">
                                <p className="text-[8px] text-white/30 uppercase tracking-widest font-bold">{key}</p>
                                <p className="text-sm font-mono text-white">{result.breakdown[key]} <span className="text-[9px] opacity-30 italic">kcal</span></p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>

          <h3 className="text-[#303030] text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-6 pl-2">
            Répartition des Macronutriments
          </h3>

          {/* Cartes Macros */}
          <div className="space-y-3">
            {/* 1. PROTÉINES */}
            <div className="p-5 rounded-2xl border transition-all hover:shadow-lg bg-blue-50/50 text-blue-800 border-blue-100 hover:border-blue-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold shadow-sm">1</div>
                  <div>
                    <div className="font-bold text-sm uppercase tracking-wide">Protéines</div>
                    <div className="text-[10px] opacity-70">Synthèse musculaire optimisée</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-2xl tracking-tight">{result.macros.p}g</div>
                  <div className="text-[9px] opacity-60 uppercase">grammes</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 mt-1 border-t border-blue-900/5">
                <div className="text-[10px] opacity-70 font-medium">Priorité structurelle</div>
                <div className="text-[10px] font-bold bg-white px-2 py-1 rounded-md shadow-sm">{result.ratios.p}g/kg LBM</div>
              </div>
            </div>

            {/* 2. LIPIDES */}
            <div className="p-5 rounded-2xl border transition-all hover:shadow-lg bg-pink-50/50 text-pink-800 border-pink-100 hover:border-pink-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold shadow-sm">2</div>
                  <div>
                    <div className="font-bold text-sm uppercase tracking-wide">Lipides</div>
                    <div className="text-[10px] opacity-70">Santé hormonale & métabolique</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-2xl tracking-tight">{result.macros.f}g</div>
                  <div className="text-[9px] opacity-60 uppercase">grammes</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 mt-1 border-t border-pink-900/5">
                <div className="text-[10px] opacity-70 font-medium">Seuil de sécurité</div>
                <div className="text-[10px] font-bold bg-white px-2 py-1 rounded-md shadow-sm">{result.ratios.f}g/kg</div>
              </div>
            </div>

            {/* 3. GLUCIDES */}
            <div className="p-5 rounded-2xl border transition-all hover:shadow-lg bg-slate-50 text-slate-700 border-slate-100 hover:border-slate-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold shadow-sm">3</div>
                  <div>
                    <div className="font-bold text-sm uppercase tracking-wide">Glucides</div>
                    <div className="text-[10px] opacity-70">Carburant pour l'effort</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-2xl tracking-tight">{result.macros.c}g</div>
                  <div className="text-[9px] opacity-60 uppercase">grammes</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-900/5">
                <div className="text-[10px] opacity-70 font-medium">Variable d'ajustement</div>
                <div className="text-[10px] font-bold bg-white px-2 py-1 rounded-md shadow-sm">{result.ratios.c}g/kg</div>
              </div>
            </div>

            {/* BOUTON COPIER */}
            <button 
                type="button"
                onClick={() => {
                    const text = `STRYV LAB - BILAN BIOMÉTRIQUE\n\n🎯 Cible : ${result.calories} kcal\n\n1. PROTÉINES : ${result.macros.p}g\n2. LIPIDES : ${result.macros.f}g\n3. GLUCIDES : ${result.macros.c}g\n\nCalculé via GENESIS V2.0`;
                    navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000);
                }}
                className={`mt-8 w-full py-5 border-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 cursor-pointer ${
                  copied 
                  ? "bg-[#DAFA72] border-[#DAFA72] text-[#1A1A1A] shadow-[0_0_20px_-5px_rgba(218,250,114,0.4)]" 
                  : "border-[#1A1A1A]/5 text-[#1A1A1A]/40 hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A]"
                }`}
            >
                {copied ? "✓ Copié dans le presse-papier" : "Copier mon bilan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}