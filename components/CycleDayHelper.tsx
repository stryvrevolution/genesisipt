'use client';

import { useState } from 'react';
import { Calendar, X } from 'lucide-react';

interface CycleDayHelperProps {
  onDayCalculated: (day: number) => void;
  currentCycleLength: number;
}

export default function CycleDayHelper({ onDayCalculated, currentCycleLength }: CycleDayHelperProps) {
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [calculatedDay, setCalculatedDay] = useState<number | null>(null);
  const [showHelper, setShowHelper] = useState(false);

  const calculateCurrentDay = () => {
    if (!lastPeriodDate) return;

    const lastPeriod = new Date(lastPeriodDate);
    const today = new Date();
    
    lastPeriod.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    let currentDay = (daysDiff % currentCycleLength) + 1;
    
    if (daysDiff < 0) {
      alert('❌ La date des dernières règles ne peut pas être dans le futur');
      return;
    }
    
    if (daysDiff > 60) {
      const confirm = window.confirm(`⚠️ Attention: ${daysDiff} jours depuis vos dernières règles. Êtes-vous sûre ?`);
      if (!confirm) return;
    }
    
    setCalculatedDay(currentDay);
    onDayCalculated(currentDay);
  };

  const resetHelper = () => {
    setLastPeriodDate('');
    setCalculatedDay(null);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-3">
      
      {!showHelper && (
        <button
          onClick={() => setShowHelper(true)}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-[#F0F6FF] border border-blue-100 text-[#1E3A8A] hover:bg-blue-100 transition-all group"
        >
          {/* Icône forcée en couleur sombre pour visibilité totale */}
          <Calendar className="w-4 h-4 text-[#1E3A8A] group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
            Calculer mon jour de cycle actuel
          </span>
        </button>
      )}

      {showHelper && (
        <div className="p-6 rounded-[24px] bg-[#F0F6FF] border border-blue-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#1E3A8A] flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[#1E3A8A] font-bold text-sm uppercase tracking-wide">
                  Calculateur de jour
                </h4>
                <p className="text-[#1E3A8A]/60 text-[10px] font-medium">
                  Basé sur votre cycle de {currentCycleLength} jours
                </p>
              </div>
            </div>
            
            <button onClick={() => setShowHelper(false)} className="text-[#1E3A8A]/40 hover:text-[#1E3A8A]">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-[#1E3A8A] text-[9px] uppercase tracking-widest font-extrabold opacity-60">
              Début des dernières règles
            </label>
            <input
              type="date"
              value={lastPeriodDate}
              onChange={(e) => {
                setLastPeriodDate(e.target.value);
                setCalculatedDay(null);
              }}
              max={todayStr}
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-[#303030] text-sm font-medium outline-none focus:border-[#1E3A8A] transition-all"
            />
          </div>

          <button
            onClick={calculateCurrentDay}
            disabled={!lastPeriodDate}
            className="w-full py-4 rounded-xl bg-[#1E3A8A] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-900 transition-all disabled:opacity-30 shadow-lg"
          >
            Calculer mon jour actuel
          </button>

          {calculatedDay !== null && (
            <div className="p-5 rounded-xl bg-[#10B981] text-white animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">✅ Vous êtes au jour</p>
                  <p className="text-5xl font-light tracking-tighter">J{calculatedDay}</p>
                </div>
                <button onClick={resetHelper} className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-[9px] font-bold uppercase tracking-wider transition-all">
                  Recalculer
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}