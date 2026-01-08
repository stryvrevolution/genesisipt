import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import FaqOmniSchema from '@/components/seo/FaqOmniSchema';
import OmniCheckoutButton from '@/app/api/stripe/OmniCheckoutButton';


export const metadata = {
  title: 'OMNI — admission & conditions | STRYV lab',
  description:
    'OMNI est un protocole d’optimisation avancée à admission stratégique. Découvrez les conditions d’accès, le processus de validation et le cadre méthodologique.',
};

export default function OmniAdmissionPage() {
  return (
    <main className="bg-[#303030] text-white min-h-screen px-6 sm:px-10 md:px-16 lg:px-24 py-24">

      <div className="max-w-4xl mx-auto space-y-16">

        {/* retour */}
        <Link
          href="/omni"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Retour
        </Link>

        {/* header */}
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#DAFA72]/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#DAFA72]" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">
              Protocole à admission
            </span>
          </div>

          <h1 className="font-outfit text-4xl md:text-5xl font-medium leading-[0.95] tracking-[-0.02em]">
            OMNI<br />
            <span className="text-white/30">Admission & conditions</span>
          </h1>

          <p className="text-white/60 text-lg leading-relaxed max-w-3xl border-l border-[#DAFA72]/30 pl-4">
            OMNI est un protocole d’optimisation avancée.
            Il n’est ni automatique, ni standardisé.
            Son accès repose sur une admission stratégique.
          </p>
        </header>

        {/* contenu */}
        <section className="space-y-12 text-white/70 leading-relaxed max-w-3xl">

          <h2 className="text-white text-2xl font-medium">
            OMNI n’est pas un programme standard
          </h2>

          <p>
            OMNI est conçu pour des profils capables de soutenir un travail
            profond, continu et évolutif sur leur potentiel de transformation.
            Il ne force jamais un système instable.
          </p>

          <p>
            L’accès à OMNI n’est pas automatique.
            Il repose sur un processus d’admission destiné à garantir
            la cohérence, la sécurité et l’efficacité du protocole.
          </p>

          <h2 className="text-white text-2xl font-medium">
            Pourquoi un processus d’admission est indispensable
          </h2>

          <p>
            La majorité des échecs en transformation ne sont pas liés
            au manque d’effort, mais à un système non prêt.
          </p>

          <p>
            OMNI s’active uniquement lorsque les conditions biologiques,
            comportementales et contextuelles sont réunies.
            Cette exigence protège votre physiologie et garantit
            un cadre de travail durable.
          </p>

          <h2 className="text-white text-2xl font-medium">
            Ce que déclenche le paiement omni
          </h2>

          <p>
            Le paiement OMNI ne correspond pas à une entrée automatique
            dans le protocole.
          </p>

          <ul className="space-y-3 pl-4 border-l border-white/10">
            <li>• Sécurisation de votre place dans le processus d’admission</li>
            <li>• Kick-off stratégique individuel avec un coach STRYV lab</li>
            <li>• Analyse approfondie de votre situation (IPT™ + entretien)</li>
            <li>• Mobilisation de ressources humaines et méthodologiques dédiées</li>
          </ul>

          <p>
            Le paiement active l’ingénierie de votre dossier,
            pas une promesse de transformation.
          </p>

          <h2 className="text-white text-2xl font-medium">
            Le kick-off stratégique (obligatoire)
          </h2>

          <p>
            Après confirmation du paiement, un appel stratégique
            doit impérativement être réservé.
          </p>

          <p>
            Sans ce rendez-vous, OMNI ne peut pas être activé.
          </p>

          <h2 className="text-white text-2xl font-medium">
            En cas de non-admission
          </h2>

          <p>
            Si OMNI n’est pas validé,
            la valeur engagée est automatiquement réaffectée
            vers la solution la plus cohérente
            (G+, IPT ciblée ou crédit interne STRYV lab).
          </p>

        </section>

        {/* CTA STRIPE */}
        <section className="pt-12 border-t border-white/10 space-y-4 max-w-3xl">

        <OmniCheckoutButton />


          <p className="text-[10px] text-white/30 leading-relaxed text-center">
            Le paiement déclenche une évaluation stratégique,
            pas une entrée automatique dans le protocole.
          </p>

        </section>

        {/* FAQ SEO */}
        <FaqOmniSchema />

      </div>
    </main>
  );
}
