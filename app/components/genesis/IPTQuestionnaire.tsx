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
    <div className="min-h-screen flex items-center justify-center p-6 md:p-8">
      <div className="max-w-3xl w-full">
        
        {/* Question Card - Clinical Bio-Brutalism */}
        <div className="panel-elevated p-8 md:p-10 mb-6">
          
          {/* Header */}
          <div className="mb-8">
            <span className="text-micro text-[#4DEEEA]">
              QUESTION {question.id}
            </span>
            <h2 className="heading-lg mt-3">
              {question.question}
            </h2>
          </div>

          {/* Divider */}
          <div className="divider-h mb-8" />

          {/* Input basé sur le type */}
          {question.type === 'Numérique' && (
            <input
              type="number"
              value={value || ''}
              onChange={(e) => onChange(parseFloat(e.target.value) || '')}
              className="input-field text-lg"
              placeholder="Entrez un nombre..."
            />
          )}

          {question.type === 'Choix unique' && (
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => onChange(option)}
                  className={`
                    w-full px-5 py-4 rounded-lg border-2 text-left transition-all duration-200
                    ${value === option 
                      ? 'border-[#4DEEEA] bg-[#4DEEEA]/10 shadow-[0_0_20px_rgba(77,238,234,0.15)]' 
                      : 'border-[var(--stroke-medium)] bg-[var(--surface-elevated)] hover:border-[#4DEEEA]/50 hover:bg-[var(--surface-hover)]'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    {/* Radio indicator */}
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${value === option 
                        ? 'border-[#4DEEEA] bg-[#4DEEEA] shadow-[0_0_8px_rgba(77,238,234,0.4)]' 
                        : 'border-[var(--text-secondary)]'
                      }
                    `}>
                      {value === option && (
                        <div className="w-2 h-2 bg-[#08090A] rounded-full" />
                      )}
                    </div>
                    
                    {/* Text */}
                    <span className={`
                      font-medium text-base
                      ${value === option ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}
                    `}>
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {question.type === 'Échelle 1-10' && (
            <div className="space-y-6">
              {/* Range input */}
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={value || 5}
                  onChange={(e) => onChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-[var(--surface-elevated)] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-6 
                    [&::-webkit-slider-thumb]:h-6 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-[#4DEEEA]
                    [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(77,238,234,0.4)]
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:transition-all
                    [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-moz-range-thumb]:w-6
                    [&::-moz-range-thumb]:h-6
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-[#4DEEEA]
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:shadow-[0_0_12px_rgba(77,238,234,0.4)]
                    [&::-moz-range-thumb]:cursor-pointer
                  "
                  style={{
                    background: `linear-gradient(to right, #4DEEEA 0%, #4DEEEA ${((value as number || 5) - 1) * 11.11}%, var(--surface-elevated) ${((value as number || 5) - 1) * 11.11}%, var(--surface-elevated) 100%)`
                  }}
                />
                
                {/* Scale markers */}
                <div className="flex justify-between mt-2 px-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <span 
                      key={num} 
                      className={`text-xs font-mono transition-colors ${
                        num === (value as number || 5) 
                          ? 'text-[#4DEEEA] font-semibold' 
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Score display */}
              <div className="text-center py-4">
                <div className="inline-flex items-baseline gap-2">
                  <span className="text-6xl font-bold text-[#4DEEEA] font-['var(--font-display)'] tracking-tight">
                    {value || 5}
                  </span>
                  <span className="text-2xl text-[var(--text-secondary)] font-mono">
                    / 10
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation - HUD style */}
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            disabled={!canProceed}
            className="btn-primary px-10 py-4 text-sm font-semibold tracking-wider uppercase
              disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none
              group
            "
          >
            <span className="flex items-center gap-3">
              SUIVANT
              <svg 
                className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}