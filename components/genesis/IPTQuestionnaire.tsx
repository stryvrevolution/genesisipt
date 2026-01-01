'use client';

import { useState } from 'react';

type Question = {
  id: string;
  label: string;
  type: 'single' | 'number';
  options?: string[];
  unit?: string;
};

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    label:
      'Depuis combien de temps tentez-vous de modifier votre composition corporelle ?',
    type: 'number',
    unit: 'années',
  },
  {
    id: 'q2',
    label:
      'Quel est actuellement votre principal frein perçu ?',
    type: 'single',
    options: ['Énergie', 'Résultats instables', 'Motivation', 'Structure'],
  },
];

export function IPTQuestionnaire({
  onComplete,
}: {
  onComplete: (data: Record<string, any>) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const q = QUESTIONS[index];

  const handleNext = (value: any) => {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);

    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete(next);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-8 md:px-16 lg:px-24 bg-bg text-text">

      <div className="w-full max-w-4xl">

        {/* ================= PROGRESSION ================= */}
        <div className="mb-16 label">
          Évaluation IPT — {index + 1} / {QUESTIONS.length}
        </div>

        {/* ================= QUESTION ================= */}
        <h1 className="h1">
          {q.label}
        </h1>

        {/* ================= INPUT ================= */}
        <div className="mt-20">

          {/* ---- CHOIX UNIQUE ---- */}
          {q.type === 'single' && (
            <div className="space-y-6">
              {q.options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleNext(opt)}
                  className="
                    block w-full text-left
                    text-small
                    uppercase
                    tracking-[0.25em]
                    pb-4
                    border-b
                    border-divider
                    text-textMuted
                    hover:text-text
                    transition-colors
                  "
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* ---- NUMÉRIQUE ---- */}
          {q.type === 'number' && (
            <div className="flex items-baseline gap-6">
              <input
                type="number"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNext(
                      (e.target as HTMLInputElement).value
                    );
                  }
                }}
                className="
                  bg-transparent
                  data-xl
                  outline-none
                  border-b
                  border-divider
                  w-40
                "
              />
              <span className="label">
                {q.unit}
              </span>
            </div>
          )}

        </div>

      </div>
    </main>
  );
}
