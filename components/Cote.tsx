'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

export type CotePosition = 'top' | 'bottom' | 'left' | 'right'

export type CoteProps = {
  /**
   * Mesure réelle, déjà formatée (« 20,00 m », « 210 000 vues/jour »).
   * Obligatoire, sans valeur par défaut ni placeholder : une cote affiche
   * toujours une donnée vraie, sinon elle n'existe pas (brief §4.1).
   */
  valeur: string
  /**
   * Bord du conteneur le long duquel court la cote.
   * Le conteneur doit être en position: relative.
   */
  position: CotePosition
  className?: string
}

const bandeParPosition: Record<CotePosition, string> = {
  top: 'inset-x-0 top-0 h-4',
  bottom: 'inset-x-0 bottom-0 h-4',
  left: 'inset-y-0 left-0 w-4',
  right: 'inset-y-0 right-0 w-4',
}

/* La valeur apparaît en fin de tracé, décalée vers l'intérieur du cadre.
   Tracé de gauche à droite en horizontal, de haut en bas en vertical. */
const valeurParPosition: Record<CotePosition, string> = {
  top: 'right-0 top-full mt-1',
  bottom: 'right-0 bottom-full mb-1',
  left: 'bottom-0 left-full ml-1 [writing-mode:vertical-rl]',
  right: 'bottom-0 right-full mr-1 [writing-mode:vertical-rl]',
}

/**
 * Annotation de cote d'épure (brief §4.1) — élément signature de la DA.
 * Trait fin en couleur de filet du régime hérité (--line suit la bascule
 * jour/nuit), extrémités en tirets perpendiculaires, valeur en mono.
 * Le trait se dessine une seule fois à l'entrée dans le viewport ;
 * avec prefers-reduced-motion, aucune animation : tout est présent d'emblée.
 */
export function Cote({ valeur, position, className }: CoteProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDrawn(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setDrawn(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const horizontal = position === 'top' || position === 'bottom'

  return (
    <div
      ref={ref}
      data-drawn={drawn}
      className={cn('cote pointer-events-none absolute', bandeParPosition[position], className)}
    >
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
        {horizontal ? (
          <g stroke="var(--line)" strokeWidth="1">
            <line x1="0.5" y1="2" x2="0.5" y2="14" />
            <line className="cote-trait" pathLength={1} x1="0" y1="8" x2="100%" y2="8" />
            <line className="cote-fin" x1="100%" y1="2" x2="100%" y2="14" />
          </g>
        ) : (
          <g stroke="var(--line)" strokeWidth="1">
            <line x1="2" y1="0.5" x2="14" y2="0.5" />
            <line className="cote-trait" pathLength={1} x1="8" y1="0" x2="8" y2="100%" />
            <line className="cote-fin" x1="2" y1="100%" x2="14" y2="100%" />
          </g>
        )}
      </svg>
      {/* Valeur mesurée : jamais d'uppercase (règle d'unités SI, amendement
          étape 2) — « 20,00 m » ne devient pas « 20,00 M ». D'où font-mono
          text-data explicites plutôt que la classe .data des étiquettes. */}
      <span
        className={cn(
          'cote-fin absolute whitespace-nowrap font-mono text-data',
          valeurParPosition[position]
        )}
      >
        {valeur}
      </span>
    </div>
  )
}
