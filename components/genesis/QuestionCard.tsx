interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    response_type: string;
    options?: string[];
    min?: number;
    max?: number;
  };
  value: any;
  onAnswer: (questionId: string, value: any) => void;
}

export function QuestionCard({ question, value, onAnswer }: QuestionCardProps) {
  
  const renderInput = () => {
    switch (question.response_type) {
      
      // Échelle 1-10
      case 'Échelle 1-10':
        return (
          <div className="space-y-5">
            <div className="flex justify-between items-center text-xs font-medium text-slate-500">
              <span>1 - Très faible</span>
              <span className="font-bold text-3xl text-slate-900 tabular-nums">{value || 5}</span>
              <span>10 - Très élevé</span>
            </div>
            <input
              type="range"
              value={value || 5}
              onChange={(e) => onAnswer(question.id, parseInt(e.target.value))}
              min={1}
              max={10}
              step={1}
              className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-900"
              style={{
                backgroundImage: `linear-gradient(to right, #0f172a 0%, #0f172a ${((value || 5) - 1) * 11.11}%, #e2e8f0 ${((value || 5) - 1) * 11.11}%, #e2e8f0 100%)`
              }}
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium tabular-nums">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <span key={n} className={value === n ? 'text-slate-900 font-bold' : ''}>{n}</span>
              ))}
            </div>
          </div>
        );

      // Choix unique
      case 'Choix unique':
        return (
          <div className="space-y-2.5">
            {question.options?.map((option, idx) => (
              <div
                key={idx}
                className={`group p-4 rounded-xl border transition-all cursor-pointer ${
                  value === option 
                    ? 'bg-slate-900 border-slate-900 shadow-lg shadow-slate-900/20' 
                    : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
                onClick={() => onAnswer(question.id, option)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    value === option 
                      ? 'border-white' 
                      : 'border-slate-300 group-hover:border-slate-400'
                  }`}>
                    {value === option && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <label className={`cursor-pointer flex-1 text-sm font-medium transition-colors ${
                    value === option 
                      ? 'text-white' 
                      : 'text-slate-700'
                  }`}>
                    {option}
                  </label>
                </div>
              </div>
            ))}
          </div>
        );

      // Input numérique
      case 'Numérique':
        return (
          <div className="space-y-2">
            <input
              type="number"
              value={value || ''}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              placeholder="Entrez une valeur"
              className="w-full text-xl font-semibold p-5 text-center bg-white/80 border-2 border-slate-200 rounded-xl focus:border-slate-900 focus:outline-none transition-colors tabular-nums"
              min={question.min}
              max={question.max}
            />
            {question.id.includes('POIDS') && (
              <p className="text-xs text-slate-500 text-center font-medium">En kilogrammes (kg)</p>
            )}
            {question.id.includes('TAILLE') && (
              <p className="text-xs text-slate-500 text-center font-medium">En centimètres (cm)</p>
            )}
          </div>
        );

      // Texte libre
      case 'Texte libre':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            placeholder="Votre réponse..."
            className="w-full p-4 bg-white/80 border-2 border-slate-200 rounded-xl focus:border-slate-900 focus:outline-none min-h-[120px] text-sm text-slate-700 resize-none transition-colors"
          />
        );

      default:
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600 font-medium">
              Type de question non supporté: {question.response_type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-slate-200/50">
      {/* Question text */}
      <div className="mb-8">
        <h2 className="text-lg md:text-xl font-semibold leading-relaxed text-slate-900">
          {question.text}
        </h2>
      </div>

      {/* Input based on type */}
      <div>
        {renderInput()}
      </div>
    </div>
  );
}