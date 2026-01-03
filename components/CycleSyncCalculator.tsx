'use client';

import React, { useState, useRef } from 'react';
import { calculateCycleOptimizedNutrition } from '@/utils/cycleSyncCalculator';
import PhaseCard from './PhaseCard';
import PhaseTimeline from './PhaseTimeline';
import CycleDayHelper from './CycleDayHelper';
import { Check, Flame, Droplets, TrendingUp, AlertTriangle } from 'lucide-react';

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

  return (
    <div className="w-full">
      
      {/* --- SECTION FORMULAIRE --- */}
      <form onSubmit={handleSubmit} className={`space-y-12 transition-all duration-700 ${result ? 'opacity-50 blur-[2px] pointer-events-none' : 'opacity-100'}`}>
        
        {/* BLOC 1 : CYCLE */}
        <div>
           <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-4 font-bold opacity-40">
              01. Synchronisation Hormonale
           </label>
           {/* Mobile: 1 col / Desktop: 2 cols */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                    <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">Durée Cycle (Jours)</label>
                    <input type="number" name="cycleLength" value={formData.cycleLength} onChange={handleChange} className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5" placeholder="28" />
                </div>
                <div className="relative group">
                    <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">Jour Actuel</label>
                    <input type="number" name="cycleDay" value={formData.cycleDay} onChange={handleChange} className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5" placeholder="14" />
                </div>
            </div>
            
            {/* Helper Component - On garde son style interne s'il est complexe, ou on suppose qu'il s'intègre bien */}
            <div className="mt-6">
                <CycleDayHelper 
                    onDayCalculated={handleDayCalculated}
                    currentCycleLength={parseInt(formData.cycleLength) || 28}
                />
            </div>
        </div>

        {/* BLOC 2 : OBJECTIF */}
        <div>
            <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-4 font-bold opacity-40">
              02. Objectif Transformation
            </label>
            <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
                {[
                { val: 'deficit', label: 'Perte de Gras', desc: 'Déficit cyclique' },
                { val: 'maintenance', label: 'Maintien', desc: 'Performance' },
                { val: 'surplus', label: 'Prise de Masse', desc: 'Construction' }
                ].map((opt) => (
                <button 
                    key={opt.val}
                    type="button"
                    onClick={() => handleGoalChange(opt.val)}
                    className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                    formData.goal === opt.val
                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-lg' 
                    : 'border-black/5 text-black/60 hover:border-black/20 bg-white'
                    }`}
                >
                    <div className="flex justify-between items-center md:block">
                        <div>
                            <div className="text-sm font-bold uppercase tracking-wider mb-1">{opt.label}</div>
                            <div className="text-[10px] opacity-70">{opt.desc}</div>
                        </div>
                        {formData.goal === opt.val && <div className="w-2 h-2 rounded-full bg-[#DAFA72] md:mt-2 md:w-full md:h-1 md:rounded-sm"></div>}
                    </div>
                </button>
                ))}
            </div>
        </div>

        {/* BLOC 3 : PROFIL */}
        <div>
            <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-4 font-bold opacity-40">
              03. Profil Métabolique
            </label>
            {/* Mobile: 1 col / Desktop: 3 cols */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="relative group">
                    <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">Poids (kg)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5" placeholder="60" />
                </div>
                <div className="relative group">
                    <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">Taille (cm)</label>
                    <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5" placeholder="165" />
                </div>
                <div className="relative group">
                    <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">Âge</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5" placeholder="30" />
                </div>
            </div>
        </div>

        {/* BLOC 4 : ACTIVITÉ */}
        <div>
            <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-4 font-bold opacity-40">
              04. Niveau d'Activité
            </label>
            {/* Mobile: 1 col / Desktop: 2 cols */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="relative group">
                    <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">Pas / Jour</label>
                    <input type="number" name="steps" value={formData.steps} onChange={handleChange} className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5" placeholder="8000" />
                </div>
                <div className="relative group">
                    <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">Séances / Semaine</label>
                    <input type="number" name="workouts" value={formData.workouts} onChange={handleChange} className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5" placeholder="3" />
                </div>
            </div>
        </div>

        {!result && (
            <button 
                type="submit" 
                onClick={handleButtonClick}
                disabled={!isFormComplete}
                className="w-full group relative overflow-hidden rounded-full bg-[#1A1A1A] p-5 transition-all duration-300 hover:bg-[#DAFA72] hover:shadow-[0_0_30px_-5px_rgba(218,250,114,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="relative z-10 text-white text-[13px] font-bold uppercase tracking-[0.15em] group-hover:text-[#1A1A1A] transition-colors">
                    Générer ma synchronisation
                </span>
            </button>
        )}
      </form>

      {/* --- SECTION RÉSULTATS --- */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-12">
          <div className="w-full h-px bg-black/5 mb-12" />
          
          {/* 1. Black Card : CIBLE CALORIQUE */}
          <div className="relative overflow-hidden rounded-[32px] bg-[#1A1A1A] p-10 text-center shadow-2xl mb-12 group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-50" />
            
            <h3 className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-[#DAFA72] mb-6">
              Cible Quotidienne
            </h3>
            
            <div className="relative flex items-baseline justify-center gap-2 mb-4">
              <span className="text-8xl md:text-9xl font-light tracking-tighter text-white">
                {result.nutrition.calories}
              </span>
              <span className="text-2xl font-medium text-white/30 uppercase tracking-widest">
                Kcal
              </span>
            </div>
            
            <p className="relative text-[11px] text-white/40 uppercase tracking-widest font-medium">
               Ajustement: {result.nutrition.adjustment > 0 ? '+' : ''}{result.nutrition.adjustment} kcal vs baseline
            </p>
          </div>

          {/* 2. PHASE & TIMELINE */}
          <div className="mb-12">
             <div className="mb-6">
                 <PhaseCard phase={result.currentPhase} daysUntilNext={result.daysUntilNextPhase} />
             </div>
             <div className="hidden md:block">
                <PhaseTimeline currentDay={parseInt(formData.cycleDay) || 1} cycleLength={parseInt(formData.cycleLength) || 28} />
             </div>
          </div>

          {/* 3. MACROS */}
          <div className="mb-12">
            <h3 className="text-[#303030] text-[10px] font-bold uppercase tracking-[0.2em] mb-6 opacity-40 pl-2">Distribution Macro-Nutriments</h3>
            <div className="space-y-3">

              {/* PROTÉINES */}
              <div className="p-5 rounded-2xl border transition-all hover:shadow-lg bg-blue-50/50 text-blue-800 border-blue-100">
                   <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold shadow-sm">P</div>
                          <div>
                             <h4 className="font-bold text-sm uppercase tracking-wide">Protéines</h4>
                             <p className="text-[10px] opacity-70">Construction</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <div className="text-2xl font-bold tracking-tight">{result.nutrition.macros.p}g</div>
                          <div className="text-[10px] font-bold bg-white px-2 py-1 rounded-md shadow-sm mt-1 inline-block">{result.nutrition.macros.ratios.p} g/kg</div>
                      </div>
                   </div>
              </div>

              {/* LIPIDES */}
              <div className="p-5 rounded-2xl border transition-all hover:shadow-lg bg-orange-50/50 text-orange-800 border-orange-100">
                   <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold shadow-sm">L</div>
                          <div>
                             <h4 className="font-bold text-sm uppercase tracking-wide">Lipides</h4>
                             <p className="text-[10px] opacity-70">Hormones</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <div className="text-2xl font-bold tracking-tight">{result.nutrition.macros.f}g</div>
                          <div className="text-[10px] font-bold bg-white px-2 py-1 rounded-md shadow-sm mt-1 inline-block">{result.nutrition.macros.ratios.f} g/kg</div>
                      </div>
                   </div>
              </div>

              {/* GLUCIDES */}
              <div className="p-5 rounded-2xl border transition-all hover:shadow-lg bg-gray-50 text-gray-700 border-gray-200">
                   <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold shadow-sm">G</div>
                          <div>
                             <h4 className="font-bold text-sm uppercase tracking-wide">Glucides</h4>
                             <p className="text-[10px] opacity-70">Énergie</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <div className="text-2xl font-bold tracking-tight">{result.nutrition.macros.c}g</div>
                          <div className="text-[10px] font-bold bg-white px-2 py-1 rounded-md shadow-sm mt-1 inline-block">{result.nutrition.macros.ratios.c} g/kg</div>
                      </div>
                   </div>
              </div>

            </div>
          </div>

          {/* 4. INTELLIGENCE & INSIGHTS */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* TRAINING */}
            <div className="rounded-[24px] border border-emerald-100 bg-[#ECFDF5]/50 p-6">
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

            {/* METABOLISM */}
            <div className="rounded-[24px] border border-purple-100 bg-[#F5F3FF]/50 p-6">
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

          <button 
             onClick={() => {
               setResult(null);
               userClickedSubmit.current = false;
             }} 
             className="w-full mt-12 py-6 rounded-full border border-black/5 text-[#303030]/40 hover:text-[#303030] hover:border-black/20 transition-all text-[10px] font-bold uppercase tracking-[0.2em]"
          >
             Recalculer une nouvelle phase
          </button>

        </div>
      )}
    </div>
  );
}