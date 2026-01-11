'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Server, Copyright, X, Scale, Mail, Globe, FileText } from 'lucide-react';

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-background text-primary font-outfit">
      
      {/* HEADER FIXE */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 bg-background/80 backdrop-blur-md border-b border-gray-100/50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-xl font-bold tracking-widest text-primary">STRYV</span>
            <span className="text-xl font-light text-secondary">lab</span>
          </Link>

          <Link 
            href="/" 
            className="w-8 h-8 rounded-full bg-surface shadow-soft-out flex items-center justify-center text-secondary hover:text-primary hover:scale-105 transition-all"
          >
            <X size={16} />
          </Link>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <div className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">

          {/* TITRE & INTRO */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 text-[10px] font-bold tracking-widest text-accent uppercase mb-6">
              <Scale size={12} />
              Information Juridique
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-6">
              Mentions Légales<br/>
              <span className="text-secondary font-medium text-2xl">STRYV lab & GENESIS</span>
            </h1>
            <p className="text-sm text-secondary leading-relaxed font-light">
              Conformément aux dispositions de la loi belge et européenne régissant les services de la société de l'information.<br/>
              Dernière mise à jour : 09 janvier 2026
            </p>
          </div>

          <div className="grid gap-8">

            {/* 1. ÉDITEUR */}
            <section className="bg-surface border border-white/60 shadow-soft-out rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-surface-light rounded-lg text-accent">
                  <Building2 size={20} />
                </div>
                <h2 className="text-lg font-bold text-primary pt-1">1. Éditeur du Site</h2>
              </div>
              <div className="text-sm text-secondary leading-relaxed pl-12 space-y-3">
                <p className="font-medium text-primary mb-3">
                  Le site web <strong>stryvlab.com</strong> et les services GENESIS sont édités par :
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Raison sociale :</strong> STRYV lab (HB Solution)</p>
                  <p><strong>Forme juridique :</strong> Indépendant</p>
                  <p><strong>Siège social :</strong> Mons, Hainaut, Belgique</p>
                  <p><strong>Numéro d'entreprise BCE :</strong> 0745.797.168</p>
                  <p><strong>Numéro TVA :</strong> BE0745797168</p>
                  <p><strong>Directeur de publication :</strong> Boukelmoune Kévin</p>
                </div>
                <div className="pt-3 space-y-1 text-gray-700">
                  <p className="flex items-center gap-2">
                    <Mail size={14} className="text-accent" />
                    <strong>Contact :</strong> contact@stryvlab.com
                  </p>
                  <p className="flex items-center gap-2">
                    <Globe size={14} className="text-accent" />
                    <strong>Site web :</strong> <a href="https://www.stryvlab.com" className="underline hover:text-accent" target="_blank" rel="noopener">www.stryvlab.com</a>
                  </p>
                </div>
              </div>
            </section>

            {/* 2. HÉBERGEMENT */}
            <section className="bg-surface border border-white/60 shadow-soft-out rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-surface-light rounded-lg text-accent">
                  <Server size={20} />
                </div>
                <h2 className="text-lg font-bold text-primary pt-1">2. Hébergement</h2>
              </div>
              <div className="text-sm text-secondary leading-relaxed pl-12 space-y-4">
                <div>
                  <p className="font-semibold text-primary mb-2">Infrastructure Web & Backend :</p>
                  <p className="text-gray-700"><strong>Vercel Inc.</strong></p>
                  <p className="text-gray-600">440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
                  <p className="text-xs text-gray-500 mt-1">Serveurs de déploiement : Union Européenne (Allemagne, Pays-Bas)</p>
                </div>

                <div>
                  <p className="font-semibold text-primary mb-2">Base de Données :</p>
                  <p className="text-gray-700"><strong>Supabase Inc.</strong></p>
                  <p className="text-gray-600">460 Bryant Street, San Francisco, CA 94107, États-Unis</p>
                  <p className="text-xs text-gray-500 mt-1">Serveurs PostgreSQL : Union Européenne (Irlande, Allemagne)</p>
                </div>

                <div>
                  <p className="font-semibold text-primary mb-2">Processeur de Paiement :</p>
                  <p className="text-gray-700"><strong>Stripe Payments Europe Ltd.</strong></p>
                  <p className="text-gray-600">1 Grand Canal Street Lower, Grand Canal Dock, Dublin 2, Irlande</p>
                  <p className="text-xs text-gray-500 mt-1">Conformité : PCI-DSS Level 1, RGPD</p>
                </div>
              </div>
            </section>

            {/* 3. PROPRIÉTÉ INTELLECTUELLE */}
            <section className="bg-surface border border-white/60 shadow-soft-out rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-surface-light rounded-lg text-accent">
                  <Copyright size={20} />
                </div>
                <h2 className="text-lg font-bold text-primary pt-1">3. Propriété Intellectuelle</h2>
              </div>
              <div className="text-sm text-secondary leading-relaxed pl-12 space-y-3">
                <p>
                  L'ensemble des éléments présents sur le site <strong>stryvlab.com</strong> et dans les services GENESIS (marques, logos, textes, graphismes, photographies, vidéos, algorithmes, questionnaires, rapports, protocoles, code source, structure de navigation) sont la propriété exclusive de <strong>STRYV lab</strong> et sont protégés par :
                </p>
                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                  <li>Le droit d'auteur (Code de droit économique belge, Livre XI)</li>
                  <li>Le droit des marques (Benelux et Union Européenne)</li>
                  <li>Le droit des bases de données</li>
                  <li>Le droit des brevets (le cas échéant)</li>
                </ul>

                <p className="pt-3">
                  <strong>Marques déposées ou en cours de dépôt :</strong>
                </p>
                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                  <li><strong>STRYV lab™</strong></li>
                  <li><strong>GENESIS™</strong></li>
                  <li><strong>IPT™</strong> (Indice de Potentiel de Transformation)</li>
                </ul>

                <p className="pt-3 font-semibold text-primary">
                  Interdictions strictes :
                </p>
                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                  <li>Reproduction totale ou partielle du site web sans autorisation écrite.</li>
                  <li>Extraction, réutilisation ou commercialisation des contenus (rapports, protocoles, algorithmes).</li>
                  <li>Rétro-ingénierie du scoring algorithmique (scraping, analyse de code, décompilation).</li>
                  <li>Utilisation des marques "STRYV lab", "GENESIS", "IPT" à des fins commerciales ou de confusion.</li>
                  <li>Création de liens profonds (deep linking) sans autorisation préalable.</li>
                </ul>

                <p className="text-xs bg-red-50 p-3 rounded-lg border border-red-100 mt-4">
                  <strong>⚖️ Sanctions :</strong> Toute violation des droits de propriété intellectuelle expose l'auteur à des poursuites civiles (dommages et intérêts) et pénales (contrefaçon).
                </p>
              </div>
            </section>

            {/* 4. RESPONSABILITÉ */}
            <section className="bg-surface border border-white/60 shadow-soft-out rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-surface-light rounded-lg text-accent">
                  <Scale size={20} />
                </div>
                <h2 className="text-lg font-bold text-primary pt-1">4. Responsabilité</h2>
              </div>
              <div className="text-sm text-secondary leading-relaxed pl-12 space-y-3">
                <p>
                  <strong>STRYV lab</strong> s'efforce de fournir des informations exactes et à jour sur le site, mais ne peut garantir l'exactitude, l'exhaustivité ou la pertinence des contenus.
                </p>
                <p>
                  <strong>Limitation de responsabilité :</strong>
                </p>
                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                  <li>STRYV lab ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du site ou des services (y compris interruptions, bugs, erreurs de calcul).</li>
                  <li>L'utilisateur reconnaît utiliser le site et les services à ses propres risques.</li>
                  <li>STRYV lab ne garantit aucun résultat spécifique (perte de poids, performance sportive, amélioration de la santé).</li>
                </ul>
                <p className="pt-2">
                  <strong>Liens externes :</strong> Le site peut contenir des liens vers des sites tiers. STRYV lab n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
                </p>
              </div>
            </section>

            {/* 5. CONTACT & RÉCLAMATIONS */}
            <section className="bg-surface border border-white/60 shadow-soft-out rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-surface-light rounded-lg text-accent">
                  <Mail size={20} />
                </div>
                <h2 className="text-lg font-bold text-primary pt-1">5. Contact & Réclamations</h2>
              </div>
              <div className="text-sm text-secondary leading-relaxed pl-12 space-y-3">
                <p>
                  Pour toute question, réclamation ou demande d'information relative aux mentions légales, contactez-nous :
                </p>
                <div className="bg-accent/5 p-4 rounded-lg border border-accent/20 space-y-2">
                  <p className="font-semibold text-primary">📧 Support STRYV lab</p>
                  <p className="text-gray-700">E-mail : <strong>contact@stryvlab.com</strong></p>
                  <p className="text-gray-700">Objet : « Mentions Légales - [Votre demande] »</p>
                  <p className="text-xs text-gray-500 mt-2">Délai de réponse : 48h ouvrées maximum</p>
                </div>
              </div>
            </section>

            {/* 6. DROIT APPLICABLE */}
            <section className="bg-surface border border-white/60 shadow-soft-out rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-surface-light rounded-lg text-accent">
                  <FileText size={20} />
                </div>
                <h2 className="text-lg font-bold text-primary pt-1">6. Droit Applicable & Juridiction</h2>
              </div>
              <div className="text-sm text-secondary leading-relaxed pl-12 space-y-3">
                <p>
                  Les présentes mentions légales sont régies par le <strong>droit belge</strong>.
                </p>
                <p>
                  En cas de litige relatif à l'interprétation ou à l'exécution des présentes, et à défaut de solution amiable, compétence exclusive est attribuée aux <strong>tribunaux de Bruxelles</strong>, Belgique.
                </p>
                <p className="text-xs bg-gray-50 p-3 rounded-lg border border-gray-100 mt-3">
                  Conformément au Règlement (UE) n°524/2013, les consommateurs européens peuvent accéder à la plateforme de résolution en ligne des litiges de la Commission européenne : <a href="https://ec.europa.eu/consumers/odr" className="underline text-accent" target="_blank" rel="noopener">ec.europa.eu/consumers/odr</a>
                </p>
              </div>
            </section>

            {/* 7. CRÉDITS */}
            <section className="bg-surface border border-white/60 shadow-soft-out rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-surface-light rounded-lg text-accent">
                  <Globe size={20} />
                </div>
                <h2 className="text-lg font-bold text-primary pt-1">7. Crédits</h2>
              </div>
              <div className="text-sm text-secondary leading-relaxed pl-12 space-y-2">
                <p><strong>Conception & Développement :</strong> STRYV lab</p>
                <p><strong>Framework :</strong> Next.js 15 (React), TypeScript, Tailwind CSS</p>
                <p><strong>Typographie :</strong> Outfit (Google Fonts), Michroma (custom)</p>
                <p><strong>Icônes :</strong> Lucide React</p>
                <p><strong>Hébergement :</strong> Vercel + Supabase (voir section 2)</p>
              </div>
            </section>

          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 py-12 px-6 text-center">
        <p className="text-[11px] font-medium tracking-wide text-gray-400 uppercase">
          © {new Date().getFullYear()} STRYV lab - GENESIS Open Source.
        </p>
      </footer>
    </main>
  );
}