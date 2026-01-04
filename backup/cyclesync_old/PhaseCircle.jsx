export default function PhaseCircle({ currentDay, cycleLength }) {
  const percentage = (currentDay / cycleLength) * 100;
  const rotation = (percentage / 100) * 360;

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-black/[0.02] border border-black/5">
      <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-4">Progression Cycle</p>
      
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="12"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="#DAFA72"
            strokeWidth="12"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Centre */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[10px] uppercase tracking-widest text-black/40">Jour</p>
          <p className="text-4xl font-bold text-[#303030]">{currentDay}</p>
          <p className="text-xs text-black/40">/ {cycleLength}</p>
        </div>
      </div>
      
      <p className="text-xs text-black/50 mt-4">{Math.round(percentage)}% du cycle</p>
    </div>
  );
}