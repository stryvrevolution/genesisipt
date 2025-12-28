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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

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
  // VALIDATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const canProceed =
    responses[currentQuestion.id] !== undefined &&
    responses[currentQuestion.id] !== null &&
    responses[currentQuestion.id] !== '';

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // HANDLERS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const handleChange = (value: any) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleBack = () => {
    if (currentIndex > 0 && !isSubmitting) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleConfirm = async () => {
    if (currentIndex < questions.length - 1) {
      // Passer à la question suivante
      setCurrentIndex((i) => i + 1);
    } else {
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // FIN DU QUESTIONNAIRE — Soumission IPT
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      setIsSubmitting(true);
      
      try {
        console.log('✅ IPT ANALYSIS COMPLETED', {
          totalQuestions: questions.length,
          answeredQuestions: Object.keys(responses).length,
          completionRate: `${Object.keys(responses).length}/${questions.length}`,
          responses,
        });

        // TODO: Appeler API
        // const result = await fetch('/api/genesis/submit', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ responses }),
        // });
        // const data = await result.json();
        // router.push(`/results/${data.submissionId}`);

        // Simulation temporaire
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('✅ Analyse IPT terminée!\n\nScore: En cours de calcul...');
        
      } catch (error) {
        console.error('❌ Erreur soumission IPT:', error);
        alert('❌ Erreur lors de la soumission. Veuillez réessayer.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER — CLINICAL BIO-BRUTALISM
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  return (
    <main className="min-h-screen relative">
      
      {/* Progress Bar - Technical Grid */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-obsidian)]/95 backdrop-blur-sm">
        <div className="h-1 bg-[var(--surface-elevated)]">
          <div 
            className="h-full bg-[#4DEEEA] transition-all duration-300 ease-out shadow-[0_0_8px_rgba(77,238,234,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Progress Stats */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4DEEEA] animate-pulse" />
            <span className="text-micro text-[var(--text-muted)]">
              GENESIS IPT ANALYSIS
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-micro text-[var(--text-muted)]">
              PROGRESSION
            </span>
            <span className="text-sm font-mono font-semibold text-[#4DEEEA]">
              {currentIndex + 1} / {questions.length}
            </span>
            <div className="w-10 h-10 rounded-full border-2 border-[var(--stroke-medium)] flex items-center justify-center">
              <span className="text-xs font-bold text-[#4DEEEA]">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Questionnaire */}
      <div className="pt-24">
        <IPTQuestionnaire
          question={currentQuestion}
          value={responses[currentQuestion.id]}
          onChange={handleChange}
          onConfirm={handleConfirm}
          onBack={handleBack}
          canProceed={canProceed && !isSubmitting}
          canGoBack={currentIndex > 0 && !isSubmitting}
        />
      </div>

      {/* Loading Overlay pendant soumission */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] bg-[var(--bg-obsidian)]/90 backdrop-blur-md flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-[#4DEEEA] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-micro text-[#4DEEEA] mb-2">
              ANALYSE EN COURS
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Calcul de votre Indice de Potentiel de Transformation...
            </p>
          </div>
        </div>
      )}
    </main>
  );
}