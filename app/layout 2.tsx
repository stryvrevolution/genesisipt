import { Inter, Poppins, Roboto_Mono } from 'next/font/google'
import './globals.css'
// On garde le Footer en import normal car il est statique
import { FooterMedisync } from '@/app/components/sections/footer-medisync'
// 1. On importe l'outil dynamic de Next.js
import dynamic from 'next/dynamic'

// 2. On importe le Header de manière dynamique avec ssr: false
// Cela empêche le serveur d'essayer de lire "window" et de faire planter le build
const HeaderMedisync = dynamic(
  () => import('@/app/components/layout/header-medisync').then((mod) => mod.HeaderMedisync),
  { ssr: false }
)

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['200', '300', '500', '600'],
  variable: '--font-poppins',
})

const robotoMono = Roboto_Mono({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto-mono',
})

export const metadata = {
  title: 'GENESIS by Stryv Lab — Forensic Metabolic Coaching',
  description: 'L\'Indice de Potentiel de Transformation (IPT) évalue si votre transformation est biologiquement et comportementalement possible.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} ${inter.className} antialiased bg-[#11202E]`}>
        <HeaderMedisync />
        {children}
        <FooterMedisync />
      </body>
    </html>
  )
}