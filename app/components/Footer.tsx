'use client';

import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  // Désactive le footer pendant l'expérience IPT
  if (pathname?.startsWith('/analyse-ipt')) return null;

  return (
    <footer className="py-10 px-6 md:px-12 lg:px-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="micro">
          © 2025 GENESIS — Forensic Metabolic Coaching
        </p>

        <p className="micro">
          IPT · Indice de Potentiel de Transformation
        </p>
      </div>
    </footer>
  );
}
