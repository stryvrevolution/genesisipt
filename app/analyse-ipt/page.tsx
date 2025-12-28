'use client';

import { useState } from 'react';
import { IPTQuestionnaire } from '@/app/components/genesis/IPTQuestionnaire';
import genesisQuestions from '@/data/genesis_questions.json';
import { GenesisQuestion, IPTResponses } from '@/types/genesis';

export default function AnalyseIPTPage() {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // DATA — GENESIS QUESTIONS (273)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const questions = genesisQuestions.questions as GenesisQuestion[];

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STATE — IPT RESPONSES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<IPTResponses>({});

  const currentQuestion = questions[currentIndex];

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SAFETY CHECK
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  if (!currentQuestion) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4DEEEA] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-micro text-[var(--text-secondary)]">
            CHARGEMENT ANALYSE IPT
          </p>
        </div>
      </main>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // HANDLERS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const handleChange = (value: any) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleConfirm = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // FIN DU QUESTIONNAIRE — Calcul IPT
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      console.log('✅ IPT ANALYSIS COMPLETED', {
        totalQuestions: questions.length,
        responses,
        completionRate: `${Object.keys(responses).length}/${questions.length}`,
      });
      
      // TODO: Appeler API /api/genesis/submit
      // TODO: Rediriger vers page résultats
    }
  };

  const canProceed =
    responses[currentQuestion.id] !== undefined &&
    responses[currentQuestion.id] !== null &&
    responses[currentQuestion.id] !== '';

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PROGRESS INDICATOR
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER — CLINICAL BIO-BRUTALISM
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  return (
    <main className="min-h-screen relative">
      
      {/* Progress Bar - Technical Grid */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-[var(--surface-elevated)]">
          <div 
            className="h-full bg-[#4DEEEA] transition-all duration-300 ease-out shadow-[0_0_8px_rgba(77,238,234,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Progress Stats */}
        <div className="absolute top-4 right-6 flex items-center gap-3">
          <span className="text-micro text-[var(--text-muted)]">
            PROGRESSION
          </span>
          <span className="text-sm font-mono font-semibold text-[#4DEEEA]">
            {currentIndex + 1} / {questions.length}
          </span>
          <div className="w-12 h-12 rounded-full border-2 border-[var(--stroke-medium)] flex items-center justify-center">
            <span className="text-xs font-bold text-[#4DEEEA]">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Questionnaire */}
      <IPTQuestionnaire
        question={currentQuestion}
        value={responses[currentQuestion.id]}
        onChange={handleChange}
        onConfirm={handleConfirm}
        canProceed={canProceed}
      />

      {/* HUD Footer - Optional */}
      <div className="fixed bottom-6 left-6">
        <div className="flex items-center gap-2 text-micro text-[var(--text-muted)]">
          <div className="w-2 h-2 rounded-full bg-[#4DEEEA] animate-pulse" />
          <span>GENESIS IPT ANALYSIS</span>
        </div>
      </div>
    </main>
  );
}