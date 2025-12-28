'use client';

import { IPTQuestionnaire } from '@/app/components/genesis/IPTQuestionnaire';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GenesisPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (responses: any) => {
    setIsSubmitting(true);
    
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Submit questionnaire
      const response = await fetch('/api/genesis/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          responses,
          email: 'test@genesis.com', // TODO: Récupérer email user
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ GENESIS IPT Calculé!\n\nScore: ${data.iptScore}/100\nCatégorie: ${data.iptCategory}`);
        // TODO: Rediriger vers page résultats
        // router.push(`/genesis/results/${data.submissionId}`);
      } else {
        alert('❌ Erreur lors du calcul IPT');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {isSubmitting ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4" />
            <p className="text-gray-600">Calcul de votre IPT en cours...</p>
          </div>
        </div>
      ) : (
        <IPTQuestionnaire onComplete={handleComplete} />
      )}
    </div>
  );
}