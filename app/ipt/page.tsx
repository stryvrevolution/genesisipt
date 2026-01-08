'use client';

import Link from 'next/link';
import { ArrowUpRight, Activity } from 'lucide-react';
import FaqIPTSchema from '@/components/seo/FaqIPTSchema';

export default function IPTPage() {
  return (
    <main className="flex flex-col lg:flex-row min-h-screen font-outfit text-white">

      {/* ================= GAUCHE (BRANDING AZONIX H1 ONLY) ================= */}
      <section className="w-full lg:w-5/12 lg:max-w-[500px] bg-[#1A1A1A] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] lg:min-h-screen lg:sticky lg:top-0 border-r border-white/5 shadow-2xl z-20">
        
        {/* Décoration de fond */}
        <div className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none select-none">
           <Activity className="w-80 h-80 stroke-[0.5]" />
        </div>

        <div className="relative z-10">
          {/* BOUTON RETOUR SIMPLE */}
          <Link href="/" className="group inline-flex items-center text-white/40 hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold mb-12 transition-colors">
            ← RETOUR
          </Link>

          {/* Icone */}
          <div className="mb-10">
             <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#DAFA72]">
                <Activity className="w-7 h-7 stroke-[1.5]" />
             </div>
          </div>

          {/* H1 HERO (SEUL ÉLÉMENT EN AZONIX) */}
          <h1 className="text-white text-4xl md:text-5xl font-azonix uppercase tracking-tighter mb-8 leading-[0.9]">
            IPT
            <span className="text-[10px] md:text-xs text-white/20 font-sans font-medium align-top ml-1 select-none">TM</span>
            <br />
            <span className="text-white/40 text-2xl md:text-3xl tracking-normal font-sans font-medium block mt-2">
              Index de potentiel <br/> de transformation
            </span>
          </h1>

          <div className="space-y-6 border-t border-white/5 pt-6">
            <p className="text-white/60 text-lg leading-relaxed font-light border-l border-[#DAFA72]/30 pl-4">
               La transformation physique n’est pas une question d’effort. 
               <span className="block text-white">C’est une question de potentiel.</span>
            </p>
            
            <div className="pt-4">
               <Link
                href="/analyse-ipt"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-[#DAFA72] text-black font-bold rounded-xl text-sm transition-all duration-300"
              >
                Mesurer mon potentiel
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 md:mt-0 flex justify-between items-end text-white/20">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Stryv Lab</p>
          <span className="font-azonix text-xs opacity-30">V1.0</span>
        </div>
      </section>


      {/* ================= DROITE (TEXTE EN OUTFIT + MAJUSCULES) ================= */}
      <section className="flex-1 relative overflow-y-auto py-8 px-6 md:px-12 lg:py-20 bg-[#303030]">
        <div className="max-w-3xl mx-auto space-y-12 text-white/70 text-base leading-relaxed">

            {/* INTRO */}
            <div className="space-y-6">
                <p>
                    L’<strong className="text-white">IPT
                    <sup className="text-[9px] font-normal ml-0.5 opacity-70">TM</sup>
                    </strong> (Index de Potentiel de Transformation) est un indicateur 
                    propriétaire développé par STRYV lab pour évaluer la capacité réelle 
                    d’un individu à se transformer <strong className="text-white">avant toute tentative de programme, 
                    de protocole ou de changement de mode de vie</strong>.
                </p>

                <p>
                    Contrairement aux approches classiques, l’IPT ne mesure ni la motivation, 
                    ni la discipline, ni la volonté. Il mesure l’état fonctionnel du système 
                    biologique, comportemental et environnemental à un instant donné.
                </p>
            </div>

            {/* SECTION 1 */}
            <div className="border-t border-white/10 pt-8">
                {/* H2 EN OUTFIT (Font par défaut) */}
                <h2 className="text-white text-2xl font-bold mb-4">
                    Comprendre le potentiel de transformation physique
                </h2>
                <div className="bg-[#252525] border border-white/5 p-6 md:p-8 rounded-2xl space-y-4">
                    <p>
                        Deux personnes peuvent suivre le même programme, fournir le même effort 
                        et appliquer les mêmes recommandations nutritionnelles, tout en obtenant 
                        des résultats radicalement différents.
                    </p>
                    <p>
                        Cette différence s’explique par le potentiel de transformation réel du 
                        système. Lorsque ce potentiel est altéré, le corps résiste, l’énergie chute, 
                        l’adhérence s’effondre et la transformation échoue malgré la bonne volonté.
                    </p>
                </div>
            </div>

            {/* SECTION 2 */}
            <div>
                <h2 className="text-white text-2xl font-bold mb-4">
                    Pourquoi mesurer le potentiel avant d’agir
                </h2>
                <p>
                    Forcer la transformation d’un système déjà contraint conduit souvent à 
                    l’échec, à la frustration et à l’épuisement. Mesurer le potentiel permet 
                    d’éviter les stratégies inefficaces ou prématurées.
                </p>
            </div>

            {/* SECTION 3 - LISTE */}
            <div className="border-t border-white/10 pt-8">
                <h2 className="text-white text-2xl font-bold mb-4">
                    Ce que mesure réellement l’analyse IPT
                </h2>
                <p className="mb-6">
                    L’analyse IPT repose sur un questionnaire adaptatif intelligent. 
                    Toutes les questions ne sont pas posées : seules celles qui sont pertinentes 
                    pour votre profil sont activées.
                </p>
                
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        "Fonctionnement métabolique",
                        "Réponse hormonale et au stress",
                        "Sommeil et récupération",
                        "Adhérence psychologique",
                        "Contraintes environnementales",
                        "Capacité de réponse au stimulus"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 bg-[#252525] px-4 py-3 rounded-lg border border-white/5 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAFA72]"></span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* SECTION 4 */}
            <div className="border-t border-white/10 pt-8">
                <h2 className="text-white text-2xl font-bold mb-4">
                    Comment lire un score IPT
                </h2>
                <div className="space-y-4">
                    <p>
                        Le score IPT est exprimé sur une échelle de <span className="text-white font-mono">0 à 100</span>. 
                        Plus le score est élevé, plus le système est réceptif 
                        à une transformation efficace et durable.
                    </p>
                    <p className="p-4 bg-[#252525] border-l-2 border-[#DAFA72] text-sm italic">
                        Un IPT élevé ne garantit pas un résultat. 
                        Un IPT faible explique pourquoi les résultats n’arrivent pas, 
                        malgré l’effort.
                    </p>
                </div>
            </div>

            {/* SECTION 5 */}
            <div>
                <h2 className="text-white text-2xl font-bold mb-4">
                    L’IPT n’est pas un programme
                </h2>
                <p>
                    L’IPT n’est ni un programme, ni une promesse de transformation. 
                    C’est une base décisionnelle permettant de choisir la bonne stratégie, 
                    au bon moment, en respectant la physiologie individuelle et les contraintes environnementales.
                </p>
            </div>

            {/* SECTION 6 - FAQ */}
            <div className="border-t border-white/10 pt-8 pb-12">
                <h2 className="text-white font-outfit text-2xl font-bold mb-6">
                    FAQ — Questions fréquentes sur l’IPT
                </h2>

                <div className="space-y-4">
                    {[
                        { 
                            q: "L’IPT est-il un diagnostic médical ?", 
                            a: "Non. L’IPT™ n’est pas un diagnostic médical et n’a pas vocation à identifier ou traiter une pathologie. Il s’agit d’un outil d’analyse fonctionnelle permettant d’évaluer la capacité d’un système à s’adapter à une transformation. La méthode repose sur une approche innovante et multidimensionnelle, intégrant des facteurs physiologiques, comportementaux et contextuels, sans se substituer aux cadres médicaux ou cliniques." 
                        },
                        { 
                            q: "L’IPT garantit-il des résultats ?", 
                            a: "Non. L’IPT™ mesure un potentiel, pas une promesse. Cependant, le Rapport IPT identifie vos leviers de progression. Couplé à nos solutions (Protocol G+, OMNI Coaching 3.0), il permet d’augmenter ce potentiel physiologique, maximisant ainsi les probabilités d’une transformation réelle et durable." 
                        },
                        { 
                            q: "Pourquoi ne pas commencer directement par un programme ?", 
                            a: "Parce que l’efficacité d’un programme dépend de la capacité réelle du système à s’adapter. Lorsque certaines contraintes physiologiques, hormonales ou comportementales sont présentes, l’organisme limite volontairement la transformation. La mesure du potentiel permet d’objectiver ces contraintes avant toute intervention et de poser un cadre décisionnel fondé sur des principes d’adaptation biologique, plutôt que sur une approche uniforme ou standardisée." 
                        },
                        { 
                            q: "À qui s’adresse l’analyse IPT ?", 
                            a: "L’analyse IPT™ s’adresse à toute personne souhaitant comprendre les mécanismes qui influencent sa capacité à se transformer. Elle est particulièrement pertinente pour celles et ceux qui rencontrent des stagnations, des échecs répétés ou une difficulté à maintenir des résultats malgré des efforts constants. L’IPT™ est également utilisée en amont d’un accompagnement pour objectiver le potentiel réel du système et orienter les stratégies de transformation de manière plus précise et individualisée." 
                        }
                    ].map((item, i) => (
                        <div key={i} className="bg-[#252525] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
                            {/* AJOUT DE font-outfit POUR ÉVITER AZONIX */}
                            <h3 className="text-white font-outfit font-bold mb-2 text-sm">{item.q}</h3>
                            <p className="text-white/50 text-xs leading-relaxed">
                                {item.a}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA MOBILE ONLY */}
            <div className="lg:hidden pt-8 pb-8">
                 <Link
                    href="/analyse-ipt"
                    className="w-full flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-[#DAFA72] text-black font-bold text-sm"
                  >
                    Mesurer mon potentiel de transformation
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>

        </div>
      </section>

      <FaqIPTSchema />
    </main>
  );
}