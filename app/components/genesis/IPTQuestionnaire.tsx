'use client';

import { useState } from 'react';
import { IPTResponses, GenesisQuestion } from '@/types/genesis';

interface IPTQuestionnaireProps {
  onComplete: (responses: IPTResponses) => void;
}

export function IPTQuestionnaire({ onComplete }: IPTQuestionnaireProps) {
  const [responses, setResponses] = useState<IPTResponses>({});
  const [currentStep, setCurrentStep] = useState(0);

  // Questions test pour MVP
  const testQuestions: GenesisQuestion[] = [
    {
      id: 'Q_PROFIL_01',
      dimension: 'Profil',
      patterns: [],
      role: 'TRIGGER',
      question: 'Quel est votre âge ?',
      type: 'Numérique',
      options: [],
      triggerCondition: 'ALWAYS',
      skipCondition: 'NEVER',
      rootCauseLink: 'AGE_STRATIFICATION',
      impactScore: 0.95,
      scientificRef: 'ACSM (2018)'
    },
    {
      id: 'Q_PROFIL_02',
      dimension: 'Profil',
      patterns: [],
      role: 'TRIGGER',
      question: 'Quel est votre sexe biologique ?',
      type: 'Choix unique',
      options: ['Homme', 'Femme'],
      triggerCondition: 'ALWAYS',
      skipCondition: 'NEVER',
      rootCauseLink: 'SEX_HORMONAL_CONTEXT',
      impactScore: 0.95,
      scientificRef: 'Sex differences in metabolism'
    },
    {
      id: 'Q_PROFIL_04',
      dimension: 'Profil',
      patterns: [],
      role: 'TRIGGER',
      question: 'Quel est votre objectif principal avec GENESIS ?',
      type: 'Choix unique',
      options: [
        'Perte de poids/graisse',
        'Prise de masse musculaire',
        'Recomposition (muscle + perte graisse)',
        'Performance sportive',
        'Optimisation santé/bien-être'
      ],
      triggerCondition: 'ALWAYS',
      skipCondition: 'NEVER',
      rootCauseLink: 'GOAL_ORIENTATION',
      impactScore: 0.95,
      scientificRef: 'Self-Determination Theory'
    }
  ];

  const currentQuestion = testQuestions[currentStep];

  const handleAnswer = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < testQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Questionnaire terminé
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentResponse = responses[currentQuestion.id];
  const canProceed = currentResponse !== undefined && currentResponse !== null && currentResponse !== '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              GENESIS IPT - Test MVP
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / testQuestions.length) * 100)}% complété
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / testQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 pt-32 pb-20">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <span className="text-sm font-medium text-emerald-600">
              Question {currentStep + 1} / {testQuestions.length}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Question Input */}
          {currentQuestion.type === 'Numérique' && (
            <input
              type="number"
              value={currentResponse || ''}
              onChange={(e) => handleAnswer(parseFloat(e.target.value) || '')}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-lg"
              placeholder="Entrez un nombre..."
            />
          )}

          {currentQuestion.type === 'Choix unique' && (
            <div className="space-y-2">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className={`
                    w-full px-4 py-3 rounded-lg border-2 text-left transition
                    ${currentResponse === option 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900' 
                      : 'border-gray-300 bg-white hover:border-emerald-300'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                      ${currentResponse === option ? 'border-emerald-500 bg-emerald-500' : 'border-gray-400'}
                    `}>
                      {currentResponse === option && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Précédent
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="px-6 py-3 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {currentStep === testQuestions.length - 1 ? 'Terminer →' : 'Suivant →'}
          </button>
        </div>
      </div>
    </div>
  );
}