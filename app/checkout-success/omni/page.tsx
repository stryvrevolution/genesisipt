'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 👈 INDISPENSABLE POUR REDIRIGER
import { Check } from 'lucide-react';

export default function OmniSuccessPage() {
  const router = useRouter(); // 👈 Initialisation du routeur

  useEffect(() => {
    // 1. Chargement du script Calendly (Code existant)
    const scriptId = 'calendly-script';
    if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        document.body.appendChild(script);
    }

    // 2. ÉCOUTEUR D'ÉVÉNEMENT CALENDLY (C'est ici que la magie opère)
    const handleCalendlyEvent = (e: MessageEvent) => {
      // On vérifie si le message vient de Calendly et si c'est une confirmation
      if (
        e.data.event && 
        e.data.event === 'calendly.event_scheduled'
      ) {
        // 👇 REDIRECTION IMMÉDIATE APRÈS RÉSERVATION
        router.push('/omni/pre-analyse'); 
      }
    };

    // On active l'écouteur
    window.addEventListener('message', handleCalendlyEvent);

    // Nettoyage quand on quitte la page
    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-[#303030] text-white flex items-center justify-center px-4 py-12 font-outfit">
      
      <div className="max-w-4xl w-full bg-[#252525] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl">

        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#DAFA72]/10 flex items-center justify-center mb-6">
                <Check className="w-6 h-6 text-[#DAFA72]" />
            </div>

            <h1 className="text-2xl md:text-3xl font-medium mb-4 text-white">
                Initialisation validée.
            </h1>

            <p className="text-white/60 text-sm leading-relaxed max-w-lg">
                Vos données ont bien été reçues. 
                <br/>
                Dernière étape : <strong className="text-white">Sélectionnez votre créneau de Kick-off Stratégique.</strong>
            </p>
        </div>

        {/* WIDGET CALENDLY */}
        <div className="w-full bg-[#303030] rounded-xl overflow-hidden border border-white/5 relative min-h-[700px]">
            <div 
                className="calendly-inline-widget" 
                data-url="https://calendly.com/stryv-revolution/appel-d-information-30min-clone?hide_event_type_details=1&hide_gdpr_banner=1&background_color=303030&text_color=ffffff&primary_color=dafa72" 
                style={{ minWidth: '320px', height: '100%', position: 'absolute', top: 0, left: 0, width: '100%' }} 
            />
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-center space-y-4">
             <p className="text-[11px] text-white/30">
                Une fois le rendez-vous confirmé, vous serez automatiquement redirigé vers la Pré-analyse.
            </p>
        </div>

      </div>
    </main>
  );
}