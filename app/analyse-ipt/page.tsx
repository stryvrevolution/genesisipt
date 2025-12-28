'use client';

import { useState } from 'react';
import { IPTQuestionnaire } from '@/app/components/genesis/IPTQuestionnaire';
import genesisQuestions from '@/data/genesis_questions.json';
import { GenesisQuestion, IPTResponses } from '@/types/genesis';

export default function AnalyseIPTPage() {
  // -----------------------------
  // DATA
  // -----------------------------
  const questions = genesisQuestions.questions as GenesisQuestion[];

  // -----------------------------
  // STATE
  // -----------------------------
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<IPTResponses>({});

  const currentQuestion = questions[currentIndex];

  // -----------------------------
  // SAFETY (CRITICAL)
  // -----------------------------
  if (!currentQuestion) {
    return null; // ou loader plus tard
  }

  // -----------------------------
  // HANDLERS
  // -----------------------------
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
      // FIN DU QUESTIONNAIRE
      console.log('IPT COMPLETED', responses);
    }
  };

  const canProceed =
    responses[currentQuestion.id] !== undefined &&
    responses[currentQuestion.id] !== null &&
    responses[currentQuestion.id] !== '';

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <main className="min-h-screen">
      <IPTQuestionnaire
        question={currentQuestion}
        value={responses[currentQuestion.id]}
        onChange={handleChange}
        onConfirm={handleConfirm}
        canProceed={canProceed}
      />
    </main>
  );
}
