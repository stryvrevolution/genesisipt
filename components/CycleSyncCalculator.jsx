'use client';

import React, { useState } from 'react';
import { calculateCycleOptimizedNutrition } from '@/utils/cycleSyncCalculator';
import PhaseCircle from './PhaseCircle';
import PhaseTimeline from './PhaseTimeline';
import PhaseCard from './PhaseCard';
import PerformanceGauge from './PerformanceGauge';
import PhaseFocusCard from './PhaseFocusCard';
import CycleDayHelper from './CycleDayHelper';

export default function CycleSyncCalculator() {
  const [formData, setFormData] = useState({
    weight: '', height: '', age: '',
    bodyFat: '',
    cycleLength: '28',
    cycleDay: '',
    steps: '5000',
    workouts: '3',
    goal: 'deficit'
  });

  const [result, setResult] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.weight || !formData.height || !formData.age || !formData.cycleDay) return;
    
    // Langue française hardcodée
    const data = calculateCycleOptimizedNutrition({ ...formData, lang: 'fr' });
    setResult(data);
  };

  // Callback pour CycleDayHelper
  const handleDayCalculated = (day: number) => {
    setFormData(prev => ({ ...prev, cycleDay: day.toString() }));
  };

  const labelStyle = "block text-[#303030] text-[10px] uppercase tracking-widest mb-3 font-bold opacity-40";
  const inputStyle = "w-full bg-transparent border-b border-black/10 py-3 text-2xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5 appearance-none";

  return (
    <div className="w-full max-w-2xl mx-auto bg-white font-sans">
      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* INPUTS - Inchangé */}
        <div className="grid grid-cols-3 gap-8">
          <div>
            <label className={labelStyle}>Poids (kg)</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} className={inputStyle} placeholder="60" required />
          </div>
          <div>
            <label className={labelStyle}>Taille (cm)</label>
            <input type="number" name="height" value={formData.height} onChange={handleChange} className={inputStyle} placeholder="165" required />
          </div>
          <div>
            <label className={labelStyle}>Âge</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputStyle} placeholder="30" required />
          </div>
        </div>

        <div>
          <label className={labelStyle}>Body Fat % (Optionnel)</label>
          <input type="number" name="bodyFat" value={formData.bodyFat} onChange={handleChange} className={inputStyle} placeholder="22" />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className={labelStyle}>Durée Cycle (jours)</label>
            <input type="number" name="cycleLength" value={formData.cycleLength} onChange={handleChange} className={inputStyle} placeholder="28" required />
            <p className="text-[9px] text-black/30 mt-2 italic">21-35 jours (moyenne: 28)</p>
          </div>
          <div>
            <label className={labelStyle}>Jour Actuel du Cycle</label>
            <input type="number" name="cycleDay" value={formData.cycleDay} onChange={handleChange} className={inputStyle} placeholder="14" required />
            <p className="text-[9px] text-black/30 mt-2 italic">J1 = 1er jour règles</p>
          </div>
        </div>

        {/* NOUVEAU: Helper Jour Cycle */}
        <CycleDayHelper 
          onDayCalculated={handleDayCalculated}
          currentCycleLength={parseInt(formData.cycleLength) || 28}
        />

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className={labelStyle}>Pas Quotidiens</label>
            <input type="number" name="steps" value={formData.steps} onChange={handleChange} className={inputStyle} placeholder="7000" />
          </div>
          <div>
            <label className={labelStyle}>Séances / semaine</label>
            <input type="number" name="workouts" value={formData.workouts} onChange={handleChange} className={inputStyle} placeholder="3" />
          </div>
        </div>

        <div>
          <label className={labelStyle}>Objectif</label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { val: 'deficit', label: 'Fat Loss', desc: 'Déficit adapté au cycle' },
              { val: 'maintenance', label: 'Maintenance', desc: 'Équilibre métabolique' },
              { val: 'surplus', label: 'Muscle Gain', desc: 'Surplus optimisé' }
            ].map((opt) => (
              <button 
                key={opt.val}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, goal: opt.val }))}
                className={`py-4 px-5 rounded-2xl text-left transition-all flex justify-between items-center ${
                  formData.goal === opt.val
                  ? 'bg-[#303030] text-white border-2 border-[#303030]' 
                  : 'bg-white text-black/40 border-2 border-black/10 hover:border-black/20'
                }`}
              >
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider mb-0.5">{opt.label}</div>
                  <div className={`text-[10px] ${formData.goal === opt.val ? 'opacity-60' : 'opacity-40'}`}>{opt.desc}</div>
                </div>
                {formData.goal === opt.val && (
                  <div className="w-5 h-5 rounded-full bg-[#DAFA72] flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#303030]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="group w-full relative inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#1A1A1A] text-white text-[13px] font-medium tracking-wide transition-all duration-300 hover:bg-[#DAFA72] hover:text-[#1A1A1A] cursor-pointer mt-8">
          <span className="relative z-10">Générer mon plan personnalisé</span>
        </button>
      </form>

      {/* RÉSULTATS */}
      {result && (
        <div className="mt-16 pt-12 border-t border-black/5 animate-in fade-in duration-700 space-y-8">
          
          <PhaseCard phase={result.currentPhase} daysUntilNext={result.daysUntilNextPhase} />

          {/* NOUVEAU: Focus Priorités */}
          <PhaseFocusCard 
  focuses={result.phaseFocus || []} 
  phaseName={result.currentPhase?.name || 'Inconnue'}
  goal={formData.goal}
/>

          {/* NOUVEAU: Jauges Performance */}
          <PerformanceGauge 
            potentials={result.performancePotential}
            phaseName={result.currentPhase.name}
            goal={formData.goal}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <PhaseCircle 
                currentDay={parseInt(formData.cycleDay) || 1} 
                cycleLength={parseInt(formData.cycleLength) || 28} 
            />
            <PhaseTimeline 
                currentDay={parseInt(formData.cycleDay) || 1} 
                cycleLength={parseInt(formData.cycleLength) || 28} 
            />
          </div>

          <div className="p-8 rounded-2xl bg-[#1A1A1A] text-white">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Nutrition Optimisée - {result.currentPhase.name}</h3>
            <div className="text-5xl font-light tracking-tighter mb-2">
              {result.nutrition.calories} <span className="text-xl text-white/30 uppercase">Kcal</span>
            </div>
            <p className="text-sm text-white/60">
              {result.nutrition.adjustment > 0 ? `+${result.nutrition.adjustment}` : result.nutrition.adjustment} kcal vs baseline
            </p>
          </div>

          {/* MACROS */}
          <div className="space-y-4">
            <h3 className="text-[#303030] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-40">Répartition Macro-Nutriments</h3>

            {/* 1. PROTÉINES */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 transition-all hover:shadow-md">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-sm font-bold text-[#303030] shadow-sm">
                            1
                        </div>
                        <div>
                            <div className="font-bold text-sm uppercase tracking-wide text-blue-900">PROTÉINES</div>
                            <div className="text-[10px] text-blue-800/70 font-medium">Construction & Récupération</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-lg text-blue-900">{result.nutrition.macros.p}g</div>
                        <div className="text-[9px] text-blue-800/60 uppercase font-bold tracking-wider">Cible</div>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-blue-200/50">
                    <div className="text-[10px] text-blue-800/80">Essentiel pour la masse maigre</div>
                    <div className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded text-blue-900">
                        {result.nutrition.macros.ratios.p} g/kg
                    </div>
                </div>
            </div>

            {/* 2. LIPIDES */}
            <div className="p-4 rounded-xl border border-orange-200 bg-orange-50 transition-all hover:shadow-md">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-sm font-bold text-[#303030] shadow-sm">
                            2
                        </div>
                        <div>
                            <div className="font-bold text-sm uppercase tracking-wide text-orange-900">LIPIDES</div>
                            <div className="text-[10px] text-orange-800/70 font-medium">Santé Hormonale</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-lg text-orange-900">{result.nutrition.macros.f}g</div>
                        <div className="text-[9px] text-orange-800/60 uppercase font-bold tracking-wider">Cible</div>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-orange-200/50">
                    <div className="text-[10px] text-orange-800/80">Régulation du cycle</div>
                    <div className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded text-orange-900">
                        {result.nutrition.macros.ratios.f} g/kg
                    </div>
                </div>
            </div>

            {/* 3. GLUCIDES */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 transition-all hover:shadow-md">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-sm font-bold text-[#303030] shadow-sm">
                            3
                        </div>
                        <div>
                            <div className="font-bold text-sm uppercase tracking-wide text-slate-800">GLUCIDES</div>
                            <div className="text-[10px] text-slate-600/70 font-medium">Carburant & Performance</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-lg text-slate-800">{result.nutrition.macros.c}g</div>
                        <div className="text-[9px] text-slate-600/60 uppercase font-bold tracking-wider">Cible</div>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                    <div className="text-[10px] text-slate-600/80">Ajusté selon l'activité</div>
                    <div className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded text-slate-800">
                        {result.nutrition.macros.ratios.c} g/kg
                    </div>
                </div>
            </div>

          </div>

          {/* RECOMMANDATIONS TRAINING */}
          <div className="p-6 rounded-xl bg-emerald-50 border-2 border-emerald-200">
            <h4 className="text-emerald-700 text-sm font-bold uppercase tracking-wide mb-4">Recommandations Training - {result.currentPhase.name}</h4>
            <div className="space-y-2">
              {result.training.recommendations.map((rec: string, i: number) => (
                <p key={i} className="text-[11px] text-emerald-800 font-medium">{rec}</p>
              ))}
            </div>
          </div>

          {result.insights && result.insights.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[#303030] text-sm font-bold uppercase tracking-widest">Insights Phase</h4>
              {result.insights.map((insight: any, i: number) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-purple-50 border border-purple-200">
                  <span className="text-2xl">{insight.icon}</span>
                  <p className="text-[11px] text-purple-800 font-medium flex-1">{insight.text}</p>
                </div>
              ))}
            </div>
          )}

          {result.warnings && result.warnings.length > 0 && (
            <div className="space-y-2">
              {result.warnings.map((warning: string, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-[11px] text-amber-800 font-bold">{warning}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}