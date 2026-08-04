'use client'

import { useSurbrillance } from '@/components/media/SurbrillanceContext'
import { cn } from '@/lib/cn'

/**
 * Enveloppe interactive d'une carte de la liste : signale le survol ou le
 * focus à la carte MapLibre, et reçoit la surbrillance quand son marqueur
 * est cliqué. Le contenu reste rendu côté serveur.
 */
export function CarteHoverZone({ slug, children }: { slug: string; children: React.ReactNode }) {
  const { setSurvole, actif } = useSurbrillance()

  return (
    <div
      id={`emplacement-${slug}`}
      onMouseEnter={() => setSurvole(slug)}
      onMouseLeave={() => setSurvole(null)}
      onFocusCapture={() => setSurvole(slug)}
      onBlurCapture={() => setSurvole(null)}
      className={cn('scroll-mt-24', actif === slug && 'ring-2 ring-accent')}
    >
      {children}
    </div>
  )
}
