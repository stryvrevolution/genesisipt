'use client';

import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentModule: number;
  totalModules: number;
  currentQuestion: number;
  totalQuestions: number;
  timeElapsed: number;
  timeEstimatedRemaining: number;
}

export function ProgressIndicator({
  currentModule,
  totalModules,
  currentQuestion,
  totalQuestions,
  timeElapsed,
  timeEstimatedRemaining,
}: ProgressIndicatorProps) {
  const moduleProgress = ((currentModule + 1) / totalModules) * 100;
  const questionProgress = (currentQuestion / totalQuestions) * 100;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">

      {/* ================= MODULE ================= */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="label">Module</span>
          <span className="data-muted">
            {currentModule + 1} / {totalModules}
          </span>
        </div>

        <div className="relative h-px bg-[var(--divider)]">
          <motion.div
            className="absolute left-0 top-0 h-px bg-[var(--text-main)]"
            initial={{ width: 0 }}
            animate={{ width: `${moduleProgress}%` }}
            transition={{ duration: 0.25, ease: 'linear' }}
          />
        </div>
      </div>

      {/* ================= QUESTION ================= */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <span className="label">Question</span>
          <span className="data-muted">
            {currentQuestion} / {totalQuestions}
          </span>
        </div>

        <div className="relative h-px bg-[var(--divider)]">
          <motion.div
            className="absolute left-0 top-0 h-px bg-[var(--text-main)]"
            initial={{ width: 0 }}
            animate={{ width: `${questionProgress}%` }}
            transition={{ duration: 0.2, ease: 'linear' }}
          />
        </div>
      </div>

      {/* ================= TEMPS ================= */}
      <div className="grid grid-cols-2 gap-8 border-t border-[var(--divider)] pt-6">

        <div>
          <div className="label mb-1">Temps écoulé</div>
          <div className="data">
            {formatTime(timeElapsed)}
          </div>
        </div>

        <div className="text-right">
          <div className="label mb-1">Temps restant estimé</div>
          <div className="data">
            {formatTime(timeEstimatedRemaining)}
          </div>
        </div>

      </div>
    </div>
  );
}
