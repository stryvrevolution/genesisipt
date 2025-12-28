'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { ReactNode } from 'react'

/**
 * GLASS CARD COMPONENT - Medical Grade Glassmorphism
 * 
 * Features:
 * - 5-level depth system
 * - Backdrop blur avec border gradients
 * - Hover interactions (glow, lift, scale)
 * - Animation variants (fade, slide, scale)
 * - Responsive padding system
 */

interface GlassCardProps {
  children: ReactNode
  glassLevel?: 'light' | 'medium' | 'strong'
  depth?: 1 | 2 | 3 | 4 | 5
  withGlow?: boolean
  withBorderGradient?: boolean
  animation?: 'fade' | 'slide' | 'scale' | 'none'
  delay?: number
  className?: string
  [key: string]: any
}

export function GlassCard({
  children,
  glassLevel = 'medium',
  depth = 3,
  withGlow = false,
  withBorderGradient = true,
  animation = 'fade',
  delay = 0,
  className,
  ...props
}: GlassCardProps) {
  // Glass opacity mapping
  const glassOpacity = {
    light: 'bg-[rgba(255,255,255,0.08)]',
    medium: 'bg-[rgba(255,255,255,0.08)]',
    strong: 'bg-[rgba(255,255,255,0.08)]',
  }

  // Depth shadow mapping
  const depthShadow = {
    1: 'shadow-depth-1',
    2: 'shadow-depth-2',
    3: 'shadow-depth-3',
    4: 'shadow-depth-4',
    5: 'shadow-depth-5',
  }

  // Z-index mapping
  const depthZ = {
    1: 'z-10',
    2: 'z-20',
    3: 'z-30',
    4: 'z-40',
    5: 'z-50',
  }

  // Animation variants
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5, delay },
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay, type: 'spring' as const, stiffness: 100 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4, delay, type: 'spring' as const, stiffness: 120 },
    },
    none: {
      initial: {},
      animate: {},
      transition: {},
    },
  }

  return (
    <motion.div
      {...variants[animation]}
      className={cn(
        // Base glass structure
        'relative overflow-hidden rounded-card',
        glassOpacity[glassLevel],
        'backdrop-blur-[16px]',
        
        // Border
        'border border-[rgba(255,255,255,0.18)]',
        withBorderGradient && 'before:absolute before:inset-0 before:rounded-card before:p-[1px] before:bg-gradient-to-br before:from-transparent before:via-transparent before:to-transparent before:-z-10',
        
        // Depth system
        depthShadow[depth],
        depthZ[depth],
        
        // Hover interactions
        'transition-all duration-300 ease-out',
        'hover:translate-y-[-4px]',
        withGlow && 'hover:shadow-glow-md',
        
        // Padding responsive
        'p-6 md:p-8 lg:p-10',
        
        className
      )}
      {...props}
    >
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  )
}

/**
 * GLASS CARD HEADER - Typographie optimisée pour headers
 */
interface GlassCardHeaderProps {
  children: ReactNode
  className?: string
}

export function GlassCardHeader({ children, className }: GlassCardHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {children}
    </div>
  )
}

/**
 * GLASS CARD TITLE - Golden ratio typography
 */
interface GlassCardTitleProps {
  children: ReactNode
  className?: string
}

export function GlassCardTitle({ children, className }: GlassCardTitleProps) {
  return (
    <h3 className={cn(
      'text-2xl md:text-3xl font-light tracking-tight text-white',
      className
    )}>
      {children}
    </h3>
  )
}

/**
 * GLASS CARD DESCRIPTION - Corps de texte optimisé
 */
interface GlassCardDescriptionProps {
  children: ReactNode
  className?: string
}

export function GlassCardDescription({ children, className }: GlassCardDescriptionProps) {
  return (
    <p className={cn(
      'text-base md:text-lg font-extralight text-white/70 leading-relaxed',
      className
    )}>
      {children}
    </p>
  )
}

/**
 * GLASS CARD CONTENT - Zone de contenu principal
 */
interface GlassCardContentProps {
  children: ReactNode
  className?: string
}

export function GlassCardContent({ children, className }: GlassCardContentProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  )
}

/**
 * GLASS CARD FOOTER - Actions et CTAs
 */
interface GlassCardFooterProps {
  children: ReactNode
  className?: string
}

export function GlassCardFooter({ children, className }: GlassCardFooterProps) {
  return (
    <div className={cn('mt-8 pt-6 border-t border-[rgba(255,255,255,0.25)]', className)}>
      {children}
    </div>
  )
}

/**
 * GLASS STAT CARD - Pour afficher des métriques avec glow
 */
interface GlassStatCardProps {
  value: string | number
  label: string
  unit?: string
  trend?: number
  className?: string
}

export function GlassStatCard({ value, label, unit, trend, className }: GlassStatCardProps) {
  return (
    <GlassCard
      glassLevel="strong"
      depth={4}
      withGlow={true}
      animation="scale"
      className={cn('text-center', className)}
    >
      <div className="space-y-2">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl md:text-6xl font-extralight text-[#19D4FF]">
            {value}
          </span>
          {unit && (
            <span className="text-2xl font-light text-white/50">
              {unit}
            </span>
          )}
        </div>
        <p className="text-sm font-light text-white/60 uppercase tracking-wider">
          {label}
        </p>
        {trend !== undefined && (
          <p className={cn(
            'text-xs font-medium',
            trend > 0 ? 'text-[#19D4FF]' : 'text-red-500'
          )}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </p>
        )}
      </div>
    </GlassCard>
  )
}

/**
 * Example Usage:
 * 
 * <GlassCard
 *   glassLevel="medium"
 *   depth={3}
 *   withGlow={true}
 *   animation="slide"
 *   delay={0.2}
 * >
 *   <GlassCardHeader>
 *     <GlassCardTitle>Capacité Métabolique</GlassCardTitle>
 *     <GlassCardDescription>
 *       Analyse des freins Root Cause : Insuline, Cortisol, Thyroïde
 *     </GlassCardDescription>
 *   </GlassCardHeader>
 *   <GlassCardContent>
 *     Content here
 *   </GlassCardContent>
 *   <GlassCardFooter>
 *     Footer actions
 *   </GlassCardFooter>
 * </GlassCard>
 */








