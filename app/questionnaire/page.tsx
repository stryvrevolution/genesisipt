'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QuestionCard } from '@/components/genesis/QuestionCard';
import { ProgressBar } from '@/components/genesis/ProgressBar';
import localFont from 'next/font/local';

const michroma = localFont({
  src: '../fonts/Michroma-Regular.ttf',
  display: 'swap',
});

export default function QuestionnairePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch('/api/genesis/questions');
        const data = await res.json();
        setQuestions(data.questions);
        setLoading(false);
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    }
    loadQuestions();
  }, []);

  useEffect(() => {
    if (currentIndex > 0 && currentIndex % 5 === 0) {
      saveProgress();
    }
  }, [currentIndex]);

  const saveProgress = async () => {
    try {
      await fetch('/api/genesis/save-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          responses,
          currentIndex,
        }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleAnswer = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      const res = await fetch('/api/genesis/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses,
          sessionId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/results?session=${sessionId}`);
      }
    } catch (error) {
      console.error('Error submitting analysis:', error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 pointer-events-none opacity-40 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        
        <div className="text-center relative z-10">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-slate-600">Chargement du questionnaire...</p>
        </div>
      </main>
    );
  }

  if (submitting) {
    return (
      <main className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 pointer-events-none opacity-40 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-slate-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
        </div>

        <div className="w-full max-w-[500px] relative z-10">
          <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 text-center space-y-6">
            <div className="animate-pulse text-6xl">🧬</div>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900">Analyse en cours...</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Le système GENESIS analyse vos {questions.length} réponses.<br/>
                Calcul IPT, détection Root Causes, profiling Neurotype.
              </p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div className="bg-slate-900 h-1.5 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-slate-400">~10 secondes restantes</p>
          </div>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900 flex items-center justify-center p-4 font-sans">
      
      {/* Texture de fond */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      
      {/* Dégradés d'arrière-plan */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-slate-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
      </div>

      <div className="w-full max-w-[500px] flex flex-col gap-4 relative z-10">

        {/* Header card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white p-4 md:p-5 rounded-[24px] shadow-lg shadow-slate-200/40">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className={`${michroma.className} text-lg font-bold uppercase tracking-[0.1em] text-slate-900`}>
                GENESIS
              </span>
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-400">
                Analyse IPT™
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-900">
                Question {currentIndex + 1} / {questions.length}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {Math.round(progress)}% complété
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <ProgressBar progress={progress} />
          </div>
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          value={responses[currentQuestion.id]}
          onAnswer={handleAnswer}
        />

        {/* Navigation */}
        <div className="bg-white/60 backdrop-blur-md border border-white/60 p-4 md:p-5 rounded-[24px] shadow-lg shadow-slate-200/40">
          <div className="flex justify-between gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-5 py-3 text-sm font-semibold text-slate-600 bg-white/80 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ← Précédent
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!responses[currentQuestion.id]}
                className="flex-1 px-6 py-3 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/20"
              >
                Générer mon rapport →
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!responses[currentQuestion.id]}
                className="flex-1 px-6 py-3 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/20"
              >
                Suivant →
              </button>
            )}
          </div>
        </div>

        {/* Save indicator */}
        {currentIndex > 0 && currentIndex % 5 === 0 && (
          <div className="text-center">
            <p className="text-xs font-medium text-emerald-600 bg-emerald-50 inline-block px-3 py-1.5 rounded-lg border border-emerald-100">
              ✓ Progression sauvegardée
            </p>
          </div>
        )}
      </div>
    </main>
  );
}