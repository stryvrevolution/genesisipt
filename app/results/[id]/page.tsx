'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ResultsDisplay } from '@/components/mini-scan/ResultsDisplay';
import type { MiniIPTResult } from '@/lib/types/ipt';

export default function ResultsPage() {
  const params = useParams();
  const assessmentId = params.id as string;
  const [result, setResult] = useState<MiniIPTResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const response = await fetch(`/api/mini-scan/${assessmentId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        const a = data.assessment;
        
        setResult({
          assessmentId: a.id,
          email: a.client_email,
          rawAnswers: a.raw_inputs_mini,
          scores: {
            metabolic: a.metabolic_score_mini,
            psychology: a.psychology_score_mini,
            infrastructure: a.infra_score_mini,
            physique: a.physique_score_mini,
            adherence: a.adherence_score_mini,
          },
          iptMini: a.ipt_mini,
          category: a.ipt_mini_category,
          recommendedOffer: a.recommended_offer,
          redirectUrl: getRedirectUrl(a.recommended_offer),
          calculatedAt: new Date(a.mini_scan_completed_at),
        });
        setLoading(false);
      } catch (err) {
        setError('Impossible de charger les résultats');
        setLoading(false);
      }
    }
    fetchResults();
  }, [assessmentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#11202E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#19D4FF]/20 border-t-[#19D4FF] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-[#11202E] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Erreur</h1>
          <p className="text-white/70 mb-6">{error}</p>
          <a href="/ipt-choice" className="inline-block bg-[#19D4FF] text-[#11202E] font-bold py-3 px-6 rounded-lg hover:bg-[#0FA8CC] transition-colors">
            Recommencer
          </a>
        </div>
      </div>
    );
  }

  return <main className="min-h-screen bg-[#11202E]"><ResultsDisplay result={result} /></main>;
}

function getRedirectUrl(offer: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://stryvlab.com';
  switch (offer) {
    case 'rapport_ipt': return `${base}/checkout?product=rapport_ipt`;
    case 'protocol_g': return `${base}/checkout?product=protocol_g`;
    case 'elite': return `${base}/booking`;
    default: return base;
  }
}





