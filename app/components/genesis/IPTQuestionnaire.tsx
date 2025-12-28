'use client';

import { GenesisQuestion, QuestionResponse } from '@/types/genesis';

interface IPTQuestionnaireProps {
  question: GenesisQuestion;
  value: QuestionResponse;
  onChange: (value: QuestionResponse) => void;
  onConfirm: () => void;
  canProceed: boolean;
}

export function IPTQuestionnaire({
  question,
  value,
  onChange,
  onConfirm,
  canProceed,
}: IPTQuestionnaireProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <span className="text-sm font-medium text-emerald-600">
              Question {question.id}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">
              {question.question}
            </h2>
          </div>

          {/* Input basé sur le type */}
          {question.type === 'Numérique' && (
            <input
              type="number"
              value={value || ''}
              onChange={(e) => onChange(parseFloat(e.target.value) || '')}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-lg"
              placeholder="Entrez un nombre..."
            />
          )}

          {question.type === 'Choix unique' && (
            <div className="space-y-2">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => onChange(option)}
                  className={`
                    w-full px-4 py-3 rounded-lg border-2 text-left transition
                    ${value === option 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900' 
                      : 'border-gray-300 bg-white hover:border-emerald-300'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                      ${value === option ? 'border-emerald-500 bg-emerald-500' : 'border-gray-400'}
                    `}>
                      {value === option && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {question.type === 'Échelle 1-10' && (
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="10"
                value={value || 5}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-4xl font-bold text-emerald-600">
                  {value || 5}
                </span>
                <span className="text-gray-500 ml-2">/ 10</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            disabled={!canProceed}
            className="px-8 py-3 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
}