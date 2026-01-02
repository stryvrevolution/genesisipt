interface PhaseFocusCardProps {
  focuses: Array<{
    priority: number;
    action: string;
    icon: string;
  }>;
  phaseName: string;
  goal: string;
}

export default function PhaseFocusCard({ focuses, phaseName, goal }: PhaseFocusCardProps) {
  
  // Mapping couleurs selon objectif
  const goalColors = {
    deficit: {
      gradient: 'from-orange-500 to-red-500',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      badge: 'bg-orange-500',
      icon: '🔥'
    },
    surplus: {
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      badge: 'bg-green-500',
      icon: '💪'
    },
    maintenance: {
      gradient: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      badge: 'bg-blue-500',
      icon: '⚖️'
    }
  };

  const colors = goalColors[goal as keyof typeof goalColors] || goalColors.maintenance;

  // Labels objectifs
  const goalLabels = {
    deficit: 'Fat Loss',
    surplus: 'Muscle Gain',
    maintenance: 'Maintenance'
  };

  return (
    <div className={`relative rounded-2xl border-2 ${colors.border} ${colors.bg} overflow-hidden`}>
      
      {/* Header Gradient */}
      <div className={`p-6 bg-gradient-to-r ${colors.gradient} text-white`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{colors.icon}</span>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wide">
                Focus {goalLabels[goal as keyof typeof goalLabels]}
              </h3>
              <p className="text-sm opacity-90 font-medium">
                Phase {phaseName}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`${colors.badge} text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
              {focuses.length} Priorités
            </div>
          </div>
        </div>
        
        <p className="text-sm opacity-90 mt-3">
          Actions à prioriser selon votre phase hormonale et objectif
        </p>
      </div>

      {/* Liste des Focus */}
      <div className="p-6 space-y-3">
        {focuses.map((focus, index) => (
          <div 
            key={index}
            className={`group relative flex items-start gap-4 p-4 rounded-xl bg-white border-2 ${colors.border} hover:shadow-md transition-all duration-300`}
          >
            {/* Numéro Priorité */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colors.badge} text-white flex items-center justify-center font-bold text-lg shadow-lg`}>
              {focus.priority}
            </div>

            {/* Contenu */}
            <div className="flex-1 pt-1">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{focus.icon}</span>
                <p className={`${colors.text} font-bold text-sm leading-relaxed`}>
                  {focus.action}
                </p>
              </div>
            </div>

            {/* Badge "TOP" pour priorité 1 */}
            {focus.priority === 1 && (
              <div className="absolute -top-2 -right-2 bg-[#DAFA72] text-[#1A1A1A] px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider shadow-lg animate-pulse">
                ⭐ TOP
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className={`p-4 ${colors.bg} border-t-2 ${colors.border}`}>
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0">💡</span>
          <p className={`text-[11px] ${colors.text} font-medium leading-relaxed`}>
            {goal === 'deficit' && 'En déficit calorique, respecter ces priorités maximise la perte de graisse tout en préservant la masse musculaire selon votre phase hormonale.'}
            {goal === 'surplus' && 'En surplus calorique, ces priorités optimisent la construction musculaire en exploitant les fenêtres anaboliques de votre cycle.'}
            {goal === 'maintenance' && 'En maintenance, ces priorités vous permettent de maximiser la performance tout en respectant les capacités de récupération de votre phase actuelle.'}
          </p>
        </div>
      </div>

      {/* Effet décoratif */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl`}></div>
    </div>
  );
}