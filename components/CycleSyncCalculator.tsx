'use client';

import React, { useState, useRef } from 'react';
import { calculateCycleOptimizedNutrition } from '@/utils/cycleSyncCalculator';
import PhaseCard from './PhaseCard';
import PhaseTimeline from './PhaseTimeline';
import CycleDayHelper from './CycleDayHelper';
import { Check, Info, Flame, Droplets, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

export default function CycleSyncCalculator() {
  const [formData, setFormData] = useState({
    cycleLength: '28',
    cycleDay: '',
    goal: 'deficit',
    weight: '', height: '', age: '',
    bodyFat: '',
    steps: '5000',
    workouts: '3'
  });

  const [result, setResult] = useState<any>(null);
  const userClickedSubmit = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userClickedSubmit.current) {
      return;
    }
    
    if (!formData.weight || !formData.height || !formData.age || !formData.cycleDay) {
      return;
    }
    
    const data = calculateCycleOptimizedNutrition({ ...formData, lang: 'fr' });
    setResult(data);
    userClickedSubmit.current = false;
  };

  const handleDayCalculated = (day: number) => {
    setFormData(prev => ({ ...prev, cycleDay: day.toString() }));
  };

  const handleGoalChange = (goal: string) => {
    setFormData(prev => ({ ...prev, goal }));
  };

  const handleButtonClick = () => {
    userClickedSubmit.current = true;
  };

  const isFormComplete = formData.weight && formData.height && formData.age && formData.cycleDay;

  // Styles partagés
  const labelStyle = "block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#DAFA72] transition-all duration-300";
  const inputContainerStyle = "group relative border-b border-black/5 focus-within:border-[#DAFA72] transition-colors duration-300 pb-2";
  const inputStyle = "w-full bg-transparent text-2xl text-[#303030] font-light outline-none placeholder:text-black/5 tabular-nums";

  return (
    <div className="w-full max-w-3xl mx-auto bg-white font-sans text-[#303030]">
      
      {/* --- SECTION FORMULAIRE --- */}
      <form onSubmit={handleSubmit} className={`space-y-16 transition-all duration-700 ${result ? 'opacity-50 blur-[2px] pointer-events-none' : 'opacity-100'}`}>
        
        {/* BLOC 1 : CYCLE */}
        <div className="space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">01. Synchronisation Hormonale</h3>
            <div className="grid grid-cols-2 gap-8">
                <div className={inputContainerStyle}>
                    <label className={labelStyle}>Durée Moyenne</label>
                    <div className="flex items-baseline gap-2">
                        <input type="number" name="cycleLength" value={formData.cycleLength} onChange={handleChange} className={inputStyle} placeholder="28" />
                        <span className="text-xs text-black/20 font-medium">Jours</span>
                    </div>
                </div>
                <div className={inputContainerStyle}>
                    <label className={labelStyle}>Jour Actuel</label>
                    <div className="flex items-baseline gap-2">
                        <input type="number" name="cycleDay" value={formData.cycleDay} onChange={handleChange} className={inputStyle} placeholder="14" />
                        <span className="text-xs text-black/20 font-medium">/ {formData.cycleLength || 28}</span>
                    </div>
                </div>
            </div>
            <CycleDayHelper 
                onDayCalculated={handleDayCalculated}
                currentCycleLength={parseInt(formData.cycleLength) || 28}
            />
        </div>

        {/* BLOC 2 : OBJECTIF */}
        <div className="space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">02. Objectif Transformation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                { val: 'deficit', label: 'Perte de Gras', desc: 'Déficit cyclique' },
                { val: 'maintenance', label: 'Maintien', desc: 'Performance' },
                { val: 'surplus', label: 'Prise de Masse', desc: 'Construction' }
                ].map((opt) => (
                <button 
                    key={opt.val}
                    type="button"
                    onClick={() => handleGoalChange(opt.val)}
                    className={`relative p-5 rounded-[20px] text-left transition-all duration-300 border ${
                    formData.goal === opt.val
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xl' 
                    : 'bg-[#FAFAFA] text-black/40 border-transparent hover:border-black/5 hover:bg-[#F5F5F5]'
                    }`}
                >
                    <div className="text-[11px] font-bold uppercase tracking-widest mb-1">{opt.label}</div>
                    <div className={`text-[10px] ${formData.goal === opt.val ? 'opacity-60' : 'opacity-40'}`}>{opt.desc}</div>
                    {formData.goal === opt.val && (
                        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#DAFA72] shadow-[0_0_10px_rgba(218,250,114,0.5)]"></div>
                    )}
                </button>
                ))}
            </div>
        </div>

        {/* BLOC 3 : PROFIL */}
        <div className="space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">03. Profil Métabolique</h3>
            <div className="grid grid-cols-3 gap-8">
            <div className={inputContainerStyle}>
                <label className={labelStyle}>Poids (kg)</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className={inputStyle} placeholder="60" />
            </div>
            <div className={inputContainerStyle}>
                <label className={labelStyle}>Taille (cm)</label>
                <input type="number" name="height" value={formData.height} onChange={handleChange} className={inputStyle} placeholder="165" />
            </div>
            <div className={inputContainerStyle}>
                <label className={labelStyle}>Âge</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputStyle} placeholder="30" />
            </div>
            </div>
        </div>

        {/* BLOC 4 : ACTIVITÉ */}
        <div className="space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">04. Niveau d'Activité</h3>
            <div className="grid grid-cols-2 gap-8">
                 <div className={inputContainerStyle}>
                    <label className={labelStyle}>Pas / Jour</label>
                    <input type="number" name="steps" value={formData.steps} onChange={handleChange} className={inputStyle} placeholder="8000" />
                </div>
                <div className={inputContainerStyle}>
                    <label className={labelStyle}>Séances / Semaine</label>
                    <input type="number" name="workouts" value={formData.workouts} onChange={handleChange} className={inputStyle} placeholder="3" />
                </div>
            </div>
        </div>

        {!result && (
            <button 
                type="submit" 
                onClick={handleButtonClick}
                disabled={!isFormComplete}
                className={`group w-full flex items-center justify-center gap-3 py-6 rounded-full transition-all ${
                    isFormComplete
                    ? 'bg-[#1A1A1A] text-white hover:bg-[#DAFA72] hover:text-[#1A1A1A] hover:shadow-[0_0_30px_-10px_rgba(218,250,114,0.3)] cursor-pointer'
                    : 'bg-black/5 text-black/20 cursor-not-allowed'
                }`}
            >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Générer ma synchronisation</span>
                <ArrowRight size={14} className={isFormComplete ? 'group-hover:translate-x-1 transition-transform' : ''} />
            </button>
        )}
      </form>

      {/* --- SECTION RÉSULTATS --- */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12 border-t border-black/5 pt-16 mt-8">
          
          {/* Header Résultats */}
          <div className="flex flex-col md:flex-row items-stretch gap-6">
             
             {/* Carte Phase (Gauche) */}
             <div className="flex-1">
                 <PhaseCard phase={result.currentPhase} daysUntilNext={result.daysUntilNextPhase} />
                 <div className="mt-6 hidden md:block">
                    <PhaseTimeline currentDay={parseInt(formData.cycleDay) || 1} cycleLength={parseInt(formData.cycleLength) || 28} />
                 </div>
             </div>

             {/* Carte Calories - DESIGN "DARK MODE" PREMIUM */}
             <div className="w-full md:w-5/12 p-8 rounded-[24px] bg-[#1A1A1A] text-white shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                
                {/* Effet Glow discret au survol */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-[#DAFA72]/10 transition-colors duration-500"></div>
                
                {/* Contenu */}
                <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Cible Journalière</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-light tracking-tighter text-white tabular-nums">{result.nutrition.calories}</span>
                        <span className="text-lg text-[#DAFA72] font-medium">kcal</span>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-xs">
                   <div className="flex items-center gap-2 text-white/50">
                       <Info size={12} />
                       <span>Ajustement Phase</span>
                   </div>
                   <span className="font-bold text-[#1A1A1A] bg-[#DAFA72] px-2 py-1 rounded text-[10px] uppercase tracking-wider">
                     {result.nutrition.adjustment > 0 ? '+' : ''}{result.nutrition.adjustment} kcal
                   </span>
                </div>
             </div>
          </div>

          {/* MACROS */}
          <div>
            <h3 className="text-[#303030] text-[10px] font-bold uppercase tracking-[0.2em] mb-6 opacity-30 ml-2">Distribution Macro-Nutriments</h3>
            <div className="grid grid-cols-1 gap-4">

              {/* PROTÉINES */}
              <div className="rounded-[24px] bg-[#F4F9FF] border border-blue-50/50 p-1 pr-6 flex items-center justify-between group hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-500">
                   <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-[20px] bg-white text-[#1E3A8A] flex flex-col items-center justify-center shadow-sm group-hover:scale-95 transition-transform duration-500">
                          <span className="text-2xl font-bold">P</span>
                          <span className="text-[9px] opacity-40 uppercase tracking-widest mt-1">Prot</span>
                      </div>
                      <div>
                         <h4 className="text-[#1E3A8A] font-bold uppercase tracking-wide text-xs mb-1">Construction</h4>
                         <p className="text-[#1E3A8A]/50 text-[10px] font-medium uppercase tracking-wider">{result.nutrition.macros.ratios.p} g/kg de poids</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-3xl font-light text-[#1E3A8A] tabular-nums">{result.nutrition.macros.p}<span className="text-sm opacity-50 ml-1">g</span></div>
                   </div>
              </div>

              {/* LIPIDES */}
              <div className="rounded-[24px] bg-[#FFF9F4] border border-orange-50/50 p-1 pr-6 flex items-center justify-between group hover:shadow-lg hover:shadow-orange-100/50 transition-all duration-500">
                   <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-[20px] bg-white text-[#9A3412] flex flex-col items-center justify-center shadow-sm group-hover:scale-95 transition-transform duration-500">
                          <span className="text-2xl font-bold">L</span>
                          <span className="text-[9px] opacity-40 uppercase tracking-widest mt-1">Lip</span>
                      </div>
                      <div>
                         <h4 className="text-[#9A3412] font-bold uppercase tracking-wide text-xs mb-1">Hormones</h4>
                         <p className="text-[#9A3412]/50 text-[10px] font-medium uppercase tracking-wider">{result.nutrition.macros.ratios.f} g/kg de poids</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-3xl font-light text-[#9A3412] tabular-nums">{result.nutrition.macros.f}<span className="text-sm opacity-50 ml-1">g</span></div>
                   </div>
              </div>

              {/* GLUCIDES */}
              <div className="rounded-[24px] bg-[#F8F8F8] border border-gray-50/50 p-1 pr-6 flex items-center justify-between group hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-500">
                   <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-[20px] bg-white text-[#303030] flex flex-col items-center justify-center shadow-sm group-hover:scale-95 transition-transform duration-500">
                          <span className="text-2xl font-bold">G</span>
                          <span className="text-[9px] opacity-40 uppercase tracking-widest mt-1">Glu</span>
                      </div>
                      <div>
                         <h4 className="text-[#303030] font-bold uppercase tracking-wide text-xs mb-1">Énergie</h4>
                         <p className="text-[#303030]/50 text-[10px] font-medium uppercase tracking-wider">{result.nutrition.macros.ratios.c} g/kg de poids</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-3xl font-light text-[#303030] tabular-nums">{result.nutrition.macros.c}<span className="text-sm opacity-50 ml-1">g</span></div>
                   </div>
              </div>

            </div>
          </div>

          {/* INTELLIGENCE */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* TRAINING */}
            <div className="rounded-[24px] bg-[#ECFDF5] p-8 flex flex-col justify-between">
                <div>
                    <h4 className="text-[#065F46] text-[10px] font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#065F46]"></span>
                        Focus Entraînement
                    </h4>
                    <div className="space-y-4">
                        {result.training.recommendations.map((rec: string, i: number) => {
                            const isWarning = rec.toLowerCase().includes('réduit') || rec.toLowerCase().includes('attention');
                            return (
                                <div key={i} className="flex items-start gap-3">
                                    {isWarning ? <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" /> : <Check size={14} className="text-emerald-600 mt-0.5 shrink-0" />}
                                    <p className={`text-xs font-bold leading-relaxed ${isWarning ? 'text-emerald-800/70' : 'text-emerald-900'}`}>{rec}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* INSIGHTS */}
            <div className="rounded-[24px] bg-[#F5F3FF] p-8 flex flex-col justify-between">
                <div>
                     <h4 className="text-purple-900 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-900"></span>
                        Métabolisme
                    </h4>
                    <div className="space-y-4">
                        {result.insights.map((insight: any, i: number) => {
                            const isMeta = insight.text.toLowerCase().includes('métabolisme');
                            const isWater = insight.text.toLowerCase().includes('eau') || insight.text.toLowerCase().includes('rétention');
                            
                            return (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-0.5 shrink-0">
                                        {isMeta ? <Flame size={14} className="text-purple-500" /> : 
                                         isWater ? <Droplets size={14} className="text-blue-500" /> : 
                                         <TrendingUp size={14} className="text-purple-400" />}
                                    </div>
                                    <p className="text-xs font-bold text-purple-900 leading-relaxed">{insight.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

          </div>

          <button 
             onClick={() => {
               setResult(null);
               userClickedSubmit.current = false;
             }} 
             className="w-full py-6 rounded-full border border-black/5 text-[#303030]/40 hover:text-[#303030] hover:border-black/20 transition-colors text-[10px] font-bold uppercase tracking-[0.2em]"
          >
             Recalculer une nouvelle phase
          </button>

        </div>
      )}
    </div>
  );
}