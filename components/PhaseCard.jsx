export default function PhaseCard({ phase, daysUntilNext }) {
  const phaseColors = {
    menstrual: 'from-red-500 to-pink-500',
    follicular: 'from-green-500 to-emerald-500',
    ovulatory: 'from-yellow-500 to-orange-500',
    luteal_early: 'from-purple-500 to-violet-500',
    luteal_late: 'from-indigo-500 to-purple-500'
  };

  return (
    <div className={`p-8 rounded-2xl bg-gradient-to-br ${phaseColors[phase.id]} text-white shadow-xl`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-80 mb-2">Phase Actuelle</p>
          <h2 className="text-4xl font-bold uppercase tracking-tight">{phase.name}</h2>
          <p className="text-sm opacity-90 mt-2">{phase.days} • {phase.description}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest opacity-80 mb-1">Prochaine phase dans</p>
          <p className="text-5xl font-bold">{daysUntilNext}</p>
          <p className="text-sm opacity-90">jour{daysUntilNext > 1 ? 's' : ''}</p>
        </div>
      </div>
      
      <div className="pt-4 border-t border-white/20">
        <p className="text-xs opacity-90">{phase.hormones}</p>
      </div>
    </div>
  );
}