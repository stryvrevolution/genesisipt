'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  BarChart3, 
  FileText, 
  Calendar,
  Settings,
  LogOut,
  Loader2,
  Lock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Flame
} from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DashboardData {
  user: {
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  access: {
    hasIptReport: boolean;
    hasGplusProtocol: boolean;
    hasOmniProtocol: boolean;
  };
  latestIpt: {
    score: number;
    generatedAt: string;
    resultId: string;
  } | null;
  sessions: {
    total: number;
    completed: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  // Charger données dashboard
  useEffect(() => {
    async function loadDashboard() {
      try {
        // Vérifier auth
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        // Charger données dashboard
        const { data: { session } } = await supabase.auth.getSession();
        
        const res = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
        });

        const dashboardData = await res.json();

        if (dashboardData.success) {
          setData(dashboardData.data);
        }

      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // LOADING STATE
  if (loading) {
    return (
      <main className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">Erreur de chargement</p>
        </div>
      </main>
    );
  }

  const { user, access, latestIpt, sessions } = data;

  return (
    <main className="min-h-screen w-full bg-gray-50">
      
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
              {user.firstName?.[0] || user.email[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.email
                }
              </h1>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Déconnexion</span>
          </button>

        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* WELCOME SECTION */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord
          </h2>
          <p className="text-sm text-gray-600">
            Gérez vos analyses et protocoles GENESIS
          </p>
        </div>

        {/* STATS RAPIDES */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          
          {/* IPT Score */}
          {latestIpt && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Dernier IPT</p>
                  <p className="text-2xl font-bold text-gray-900">{latestIpt.score}/100</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Généré le {new Date(latestIpt.generatedAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          )}

          {/* Sessions */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <BarChart3 size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Analyses</p>
                <p className="text-2xl font-bold text-gray-900">{sessions.completed}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {sessions.total} session{sessions.total > 1 ? 's' : ''} au total
            </p>
          </div>

          {/* Protocole actif */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Flame size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Protocole</p>
                <p className="text-lg font-bold text-gray-900">
                  {access.hasOmniProtocol ? 'OMNI' : access.hasGplusProtocol ? 'G+' : 'Aucun'}
                </p>
              </div>
            </div>
            {access.hasGplusProtocol || access.hasOmniProtocol ? (
              <p className="text-xs text-green-600">● Actif</p>
            ) : (
              <p className="text-xs text-gray-500">Pas de protocole actif</p>
            )}
          </div>

        </div>

        {/* SECTIONS PRINCIPALES */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          
          {/* RAPPORT IPT */}
          <div className={`bg-white rounded-lg p-8 shadow-sm transition-all ${
            access.hasIptReport 
              ? 'hover:shadow-md hover:-translate-y-1 cursor-pointer' 
              : 'opacity-60'
          }`}>
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-green-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Rapport IPT™</h3>
                  <p className="text-xs text-gray-600">Analyse forensique métabolique</p>
                </div>
              </div>
              {access.hasIptReport ? (
                <CheckCircle2 size={20} className="text-green-600" />
              ) : (
                <Lock size={20} className="text-gray-400" />
              )}
            </div>

            {access.hasIptReport ? (
              <div>
                <p className="text-sm text-gray-700 mb-4">
                  Consultez votre analyse complète et vos root causes identifiées.
                </p>
                <Link 
                  href={`/results/${latestIpt?.resultId}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:gap-3 transition-all"
                >
                  Voir le rapport
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-700 mb-4">
                  Effectuez une analyse IPT pour débloquer votre rapport.
                </p>
                <Link 
                  href="/checkout/ipt"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
                >
                  Commander (35€)
                </Link>
              </div>
            )}
          </div>

          {/* PROTOCOLE G+ */}
          <div className={`bg-white rounded-lg p-8 shadow-sm transition-all ${
            access.hasGplusProtocol 
              ? 'hover:shadow-md hover:-translate-y-1 cursor-pointer border-2 border-green-200' 
              : 'opacity-60'
          }`}>
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar size={24} className="text-green-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Système G+</h3>
                  <p className="text-xs text-gray-600">Protocole actif 6 semaines</p>
                </div>
              </div>
              {access.hasGplusProtocol ? (
                <CheckCircle2 size={20} className="text-green-600" />
              ) : (
                <Lock size={20} className="text-gray-400" />
              )}
            </div>

            {access.hasGplusProtocol ? (
              <div>
                <p className="text-sm text-gray-700 mb-4">
                  Programmation neuro-métabolique + ajustements hebdo.
                </p>
                <Link 
                  href="/dashboard/protocol"
                  className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:gap-3 transition-all"
                >
                  Accéder au protocole
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-700 mb-4">
                  Protocole complet avec supervision algorithmique.
                </p>
                <Link 
                  href="/checkout/gplus"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
                >
                  Commander (250€)
                </Link>
              </div>
            )}
          </div>

          {/* PROTOCOLE OMNI */}
          <div className={`bg-white rounded-lg p-8 shadow-sm transition-all ${
            access.hasOmniProtocol 
              ? 'hover:shadow-md hover:-translate-y-1 cursor-pointer border-2 border-green-200' 
              : 'opacity-60'
          }`}>
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <Flame size={24} className="text-green-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">OMNI Hybrid</h3>
                  <p className="text-xs text-gray-600">Hautes performances 12 sem.</p>
                </div>
              </div>
              {access.hasOmniProtocol ? (
                <CheckCircle2 size={20} className="text-green-600" />
              ) : (
                <Lock size={20} className="text-gray-400" />
              )}
            </div>

            {access.hasOmniProtocol ? (
              <div>
                <p className="text-sm text-gray-700 mb-4">
                  Supervision biologique totale + canal privé 24/7.
                </p>
                <Link 
                  href="/dashboard/protocol/omni"
                  className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:gap-3 transition-all"
                >
                  Accéder au protocole
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-700 mb-4">
                  Ingénierie avancée de l'hypertrophie.
                </p>
                <Link 
                  href="/checkout/omni"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
                >
                  Candidater (800€)
                </Link>
              </div>
            )}
          </div>

          {/* OUTILS */}
          <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all">
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <Settings size={24} className="text-green-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Outils Lab</h3>
                  <p className="text-xs text-gray-600">Calculateurs gratuits</p>
                </div>
              </div>
              <CheckCircle2 size={20} className="text-green-600" />
            </div>

            <p className="text-sm text-gray-700 mb-4">
              Body Fat, Macros, Cycle Sync, HR Zones, Hydratation...
            </p>
            <Link 
              href="/outils"
              className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:gap-3 transition-all"
            >
              Voir tous les outils
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>

        {/* ACTIONS RAPIDES */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Actions rapides</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            
            <Link 
              href="/ipt/questionnaire"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <p className="text-sm font-bold text-gray-900 mb-1">Nouvelle analyse</p>
              <p className="text-xs text-gray-600">Lancer un nouveau questionnaire IPT</p>
            </Link>

            <Link 
              href="/booking"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <p className="text-sm font-bold text-gray-900 mb-1">Réserver consultation</p>
              <p className="text-xs text-gray-600">Parler à un coach STRYV</p>
            </Link>

            <Link 
              href="/dashboard/settings"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <p className="text-sm font-bold text-gray-900 mb-1">Paramètres</p>
              <p className="text-xs text-gray-600">Modifier votre profil</p>
            </Link>

          </div>
        </div>

      </div>
    </main>
  );
}