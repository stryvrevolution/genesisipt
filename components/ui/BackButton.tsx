'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export function BackButton({ href = '/outils' }: { href?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10"
    >
      <Link
        href={href}
        className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 group-hover:border-[#19D4FF]/50 transition-all">
          <ArrowLeft className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-sans font-normal opacity-0 group-hover:opacity-100 transition-opacity text-white">
          Retour
        </span>
      </Link>
    </motion.div>
  )
}






