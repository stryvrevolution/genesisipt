export default function PhaseTimeline({ currentDay, cycleLength }) {
  const getPhaseForDay = (day) => {
    if (day >= 1 && day <= 5) return { name: 'Menstruelle', color: 'bg-red-400' };
    if (day >= 6 && day <= 14) return { name: 'Folliculaire', color: 'bg-green-400' };
    if (day >= 15 && day <= 17) return { name: 'Ovulation', color: 'bg-yellow-400' };
    if (day >= 18 && day <= 23) return { name: 'Lutéale Précoce', color: 'bg-purple-400' };
    return { name: 'Lutéale Tardive', color: 'bg-indigo-400' };
  };

  return (
    <div className="flex flex-col p-6 rounded-xl bg-black/[0.02] border border-black/5">
      <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-4">Timeline {cycleLength} Jours</p>
      
      <div className="relative h-12 rounded-lg overflow-hidden bg-gradient-to-r from-red-100 via-green-100 via-yellow-100 via-purple-100 to-indigo-100 mb-4">
        {/* Indicateur jour actuel */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-[#303030]"
          style={{ left: `${(currentDay / cycleLength) * 100}%` }}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#303030] text-white text-[9px] px-2 py-1 rounded whitespace-nowrap">
            VOUS ÊTES ICI
          </div>
        </div>
      </div>

      {/* Légende */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { name: 'Menstruelle', range: 'J1-5', color: 'bg-red-400' },
          { name: 'Folliculaire', range: 'J6-14', color: 'bg-green-400' },
          { name: 'Ovulation', range: 'J15-17', color: 'bg-yellow-400' },
          { name: 'Lutéale', range: 'J18-28', color: 'bg-purple-400' }
        ].map((phase, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${phase.color}`} />
            <div>
              <p className="text-[9px] font-bold text-[#303030]">{phase.name}</p>
              <p className="text-[8px] text-black/40">{phase.range}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}