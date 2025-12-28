'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IPTQuestionnaire } from '@/app/components/genesis/IPTQuestionnaire';
import { IPTResponses } from '@/types/genesis';

export default function GenesisPage() {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = async (responses: IPTResponses) => {
    setIsCompleted(true);
    // Ici, vous pourrez rediriger vers une page de résultats
    // Pour l'instant, on affiche un message de succès
    console.log("Questionnaire terminé !", responses);
    
    // Exemple de redirection future :
    // router.push('/genesis/results');
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyse terminée !</h2>
          <p className="text-gray-600 mb-8">
            Vos réponses ont été enregistrées avec succès. Notre moteur GENESIS est en train de calculer votre profil métabolique.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            Recommencer un test
          </button>
        </div>
      </div>
    );
  }

  return (
    <main>
      <IPTQuestionnaire onComplete={handleComplete} />
    </main>
  );
}