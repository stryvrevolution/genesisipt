'use client'; 
import { useState } from 'react';
import { calculateOptimalMacros } from '../utils/macroCalculator';

export default function MacroCalculator() {
  const [formData, setFormData] = useState({
    gender: 'male',
    weight: '', height: '', age: '',
    bodyFat: '',
    steps: '5000', workouts: '3',
    goal: 'deficit'
  });

  const [result, setResult] = useState(null);
  const [showTdeeDetails, setShowTdeeDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.weight || !formData.height || !formData.age) return;
    const data = calculateOptimalMacros(formData);
    setResult(data);
  };

  const placeholders = {
    weight: formData.gender === 'male' ? '75' : '60',
    height: formData.gender === 'male' ? '180' : '165',
    bodyFat: formData.gender === 'male' ? '15' : '22'
  };

  const labelStyle = "block text-[#303030] text-[10px] uppercase tracking-widest mb-3 font-bold opacity-40";
  const inputStyle = "w-full bg-transparent border-b border-black/10 py-3 text-2xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5 appearance-none";

  return (
    <div className="w-full max-w-2xl mx-auto p-8 md:p-16 lg:p-24 bg-white font-sans">
      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* SÉLECTEUR GENRE (Inspiré de HR Zones) */}
        <div>
          <label className={labelStyle}>Genre (Calcul LBM)</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { val: 'male', label: 'Homme' },
              { val: 'female', label: 'Femme' }
            ].map((opt) => (
              <button 
                key={opt.val}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, gender: opt.val }))}
                className={`py-3 px-4 rounded-xl text-sm font-medium uppercase tracking-wide transition-all border ${
                  formData.gender === opt.val
                  ? 'border-[#303030] bg-[#303030] text-white' 
                  : 'border-black/10 text-black/40 hover:border-black/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* INPUTS BIOMÉTRIQUES */}
        <div className="grid grid-cols-3 gap-8">
          <div className="relative group">
            <label className={labelStyle}>Poids (kg)</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} className={inputStyle} placeholder={placeholders.weight} required />
          </div>
          <div className="relative group">
            <label className={labelStyle}>Taille (cm)</label>
            <input type="number" name="height" value={formData.height} onChange={handleChange} className={inputStyle} placeholder={placeholders.height} required />
          </div>
          <div className="relative group">
            <label className={labelStyle}>Âge</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputStyle} placeholder="30" required />
          </div>
        </div>

        {/* ACTIVITÉ & OBJECTIF */}
        <div className="grid grid-cols-2 gap-8">
          <div className="relative group">
            <label className={labelStyle}>Pas / Jour <span className="block text-[9px] text-black/30 font-normal mt-1">Moyenne NEAT</span></label>
            <input type="number" name="steps" value={formData.steps} onChange={handleChange} className={inputStyle} placeholder="7000" />
          </div>
          <div className="relative group">
            <label className={labelStyle}>Séances / Sem <span className="block text-[9px] text-black/30 font-normal mt-1">Dépense EAT</span></label>
            <input type="number" name="workouts" value={formData.workouts} onChange={handleChange} className={inputStyle} placeholder="3" />
          </div>
        </div>

        {/* OBJECTIF (Boutons listes) */}
        <div>
          <label className={labelStyle}>Objectif métabolique</label>
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
                className={`w-full py-4 px-5 rounded-2xl text-left transition-all border flex justify-between items-center ${
                  formData.goal === opt.val
                  ? 'border-[#303030] bg-[#303030] text-white' 
                  : 'border-black/10 text-black/40 hover:border-black/20'
                }`}
              >
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider">{opt.label}</div>
                  <div className={`text-[10px] ${formData.goal === opt.val ? 'opacity-60' : 'opacity-40'}`}>{opt.desc}</div>
                </div>
                {formData.goal === opt.val && <div className="w-2 h-2 rounded-full bg-[#DAFA72]" />}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="group w-full relative inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#1A1A1A] text-white text-[13px] font-medium tracking-wide transition-all duration-300 hover:bg-[#DAFA72] hover:text-[#1A1A1A] cursor-pointer mt-8">
          <span className="relative z-10">Générer mon plan nutritionnel</span>
        </button>
      </form>

      {/* RÉSULTATS - DESIGN ALIGNÉ SUR HR ZONES */}
      {result && (
        <div className="mt-16 pt-12 border-t border-black/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Métriques Globales (Sombre) */}
          <div className="relative p-10 rounded-[24px] bg-[#1A1A1A] text-white shadow-2xl mb-10 border border-white/5 overflow-hidden">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Cible Calorique</h3>
            <div className="text-6xl font-light tracking-tighter mb-2">{result.calories} <span className="text-xl text-white/30 uppercase tracking-normal">Kcal</span></div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium italic">TDEE estimé : {result.tdee} kcal</p>
            
            {/* Toggle TDEE (Inspiré du détail des zones) */}
            <div className="mt-6 pt-6 border-t border-white/5">
                <button onClick={() => setShowTdeeDetails(!showTdeeDetails)} className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#DAFA72] hover:opacity-80 transition-all">
                    {showTdeeDetails ? '− Masquer le breakdown' : '+ Voir détails métaboliques'}
                </button>
                {showTdeeDetails && (
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
                        {['bmr', 'neat', 'eat', 'tef'].map((key) => (
                            <div key={key} className="space-y-1">
                                <p className="text-[8px] text-white/30 uppercase tracking-widest font-bold">{key}</p>
                                <p className="text-sm font-mono">{result.breakdown[key]} <span className="text-[9px] opacity-30 italic">kcal</span></p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>

          <h3 className="text-[#303030] text-sm font-bold uppercase tracking-widest mb-6">Répartition des Macronutriments</h3>

          {/* Cartes Macros (Design strict HR Zones) */}
          <div className="space-y-3">
            {/* 1. PROTÉINES */}
            <div className="p-4 rounded-xl border transition-all hover:shadow-md bg-blue-50 text-blue-700 border-blue-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <div className="font-bold text-sm uppercase tracking-wide text-blue-800">Protéines</div>
                    <div className="text-[10px] opacity-70 italic">Synthèse musculaire optimisée</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-2xl text-blue-900">{result.macros.p}g</div>
                  <div className="text-[9px] opacity-60">grammes</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-blue-900/10">
                <div className="text-[10px] opacity-70">Priorité structurelle</div>
                <div className="text-[10px] font-medium bg-white/40 px-2 py-0.5 rounded">{result.ratios.p}g/kg LBM</div>
              </div>
            </div>

            {/* 2. LIPIDES */}
            <div className="p-4 rounded-xl border transition-all hover:shadow-md bg-pink-50 text-pink-700 border-pink-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <div className="font-bold text-sm uppercase tracking-wide text-pink-800">Lipides</div>
                    <div className="text-[10px] opacity-70 italic">Santé hormonale & métabolique</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-2xl text-pink-900">{result.macros.f}g</div>
                  <div className="text-[9px] opacity-60">grammes</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-pink-900/10">
                <div className="text-[10px] opacity-70">Seuil hormonal de sécurité</div>
                <div className="text-[10px] font-medium bg-white/40 px-2 py-0.5 rounded">{result.ratios.f}g/kg</div>
              </div>
            </div>

            {/* 3. GLUCIDES */}
            <div className="p-4 rounded-xl border transition-all hover:shadow-md bg-slate-50 text-slate-600 border-slate-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <div className="font-bold text-sm uppercase tracking-wide text-slate-800">Glucides</div>
                    <div className="text-[10px] opacity-70 italic">Carburant pour l'effort</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-2xl text-slate-900">{result.macros.c}g</div>
                  <div className="text-[9px] opacity-60">grammes</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-900/10">
                <div className="text-[10px] opacity-70">Variable d'ajustement énergétique</div>
                <div className="text-[10px] font-medium bg-white/40 px-2 py-0.5 rounded">{result.ratios.c}g/kg</div>
              </div>
            </div>

            {/* BOUTON COPIER MIS À JOUR */}
            <button 
                onClick={() => {
                    const text = `STRYV LAB - BILAN BIOMÉTRIQUE\n\n🎯 Cible : ${result.calories} kcal\n\n1. PROTÉINES : ${result.macros.p}g\n2. LIPIDES : ${result.macros.f}g\n3. GLUCIDES : ${result.macros.c}g\n\nCalculé via GENESIS V2.0`;
                    navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000);
                }}
                className={`mt-8 w-full py-5 border-2 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500 cursor-pointer ${
                  copied 
                  ? "bg-[#DAFA72] border-[#DAFA72] text-[#1A1A1A]" 
                  : "border-[#1A1A1A]/5 text-[#1A1A1A]/40 hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A]"
                }`}
            >
                {copied ? "✓ Bilan copié dans le presse-papier" : "Copier mon bilan biométrique"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}