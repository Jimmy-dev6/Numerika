'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { media } from '@/content/media'
import type { Panneau } from '@/content/panneaux'
import type { Locale } from '@/lib/i18n'
import { emplacements } from '@/lib/inventaire'

/**
 * Conteneur de la carte (étape 5, consignes 5 et 6).
 * MapLibre est importé dynamiquement (ssr: false) : il ne pèse rien dans
 * le bundle initial et ne charge que sur cette route. Sur mobile, la carte
 * est repliée sous un bouton, la liste d'abord ; elle ne charge qu'à
 * l'ouverture. La carte est une amélioration : la liste reste complète
 * et utilisable sans elle.
 */
const CarteMap = dynamic(() => import('@/components/media/CarteMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-surface">
      <p className="data text-fg-soft">…</p>
    </div>
  ),
})

export function SectionCarte({
  panneaux,
  maintenantIso,
  locale,
}: {
  panneaux: Panneau[]
  maintenantIso: string
  locale: Locale
}) {
  const [ouverte, setOuverte] = useState(false)
  const [grandEcran, setGrandEcran] = useState(false)

  useEffect(() => {
    const requete = window.matchMedia('(min-width: 1024px)')
    const maj = () => setGrandEcran(requete.matches)
    maj()
    requete.addEventListener('change', maj)
    return () => requete.removeEventListener('change', maj)
  }, [])

  const visible = grandEcran || ouverte

  /* Bandeau tant que moins de la moitié des emplacements ont des coords
     vérifiées (consigne 2). Compté sur l'inventaire complet, pas sur la
     liste filtrée. */
  const avecCoords = emplacements.filter((p) => p.coords !== null).length
  const bandeau = avecCoords < Math.ceil(emplacements.length / 2)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOuverte((o) => !o)}
        aria-expanded={ouverte}
        className="w-full rounded-btn border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-fg-soft lg:hidden"
      >
        {ouverte ? media.carte.masquer[locale] : media.carte.voir[locale]}
      </button>

      {visible && (
        <div className="relative mt-4 h-[26rem] border border-line lg:mt-0 lg:h-[calc(100vh-7rem)]">
          <a
            href="#liste-emplacements"
            className="sr-only left-2 top-2 z-10 bg-surface px-3 py-2 text-sm focus:not-sr-only focus:absolute"
          >
            {media.carte.passer[locale]}
          </a>
          {bandeau && (
            <p className="absolute inset-x-0 top-0 z-10 bg-night-soft/90 px-3 py-2 text-xs text-fg-soft">
              {media.carte.coordsEnCours[locale]}
            </p>
          )}
          <CarteMap panneaux={panneaux} maintenantIso={maintenantIso} locale={locale} />
        </div>
      )}
    </div>
  )
}
