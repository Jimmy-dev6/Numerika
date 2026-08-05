'use client'

import { useEffect, useState } from 'react'
import { Photo } from '@/components/Photo'
import type { CleImage } from '@/content/images.gen'

/**
 * Calques du diaporama du hero (étape 15 bis, passe A).
 *
 * Seule la PREMIÈRE image existe dans le HTML initial : elle porte le
 * LCP et reste l'unique visuel sans JavaScript ou en mouvement réduit —
 * les calques 2-4 ne serviraient alors à rien et leurs téléchargements
 * concurrenceraient le LCP (mesuré : -3 points Lighthouse). Ils ne sont
 * donc montés qu'après hydratation, et les classes d'animation ne sont
 * posées qu'à ce moment-là sur TOUS les calques : toutes les horloges
 * d'animation partent du même instant, le fondu enchaîné reste synchrone
 * même si l'hydratation est lente.
 *
 * Le mouvement lui-même reste du CSS pur, doublement gaté html.js +
 * prefers-reduced-motion (globals.css) — ce composant ne fait que
 * différer des ressources, il n'anime rien en JavaScript.
 */
export function Diaporama({ images }: { images: Array<{ cle: CleImage; alt: string }> }) {
  const [monte, setMonte] = useState(false)
  useEffect(() => setMonte(true), [])

  const calques = monte ? images : images.slice(0, 1)

  return (
    <>
      {calques.map((image, i) => (
        <div
          key={image.cle}
          /* media-entree (passe B) : la première image fond depuis 25 %
             d'opacité — jamais 0, le LCP compte la première frame. La
             classe d'animation du diaporama la remplace à l'hydratation,
             l'entrée est déjà jouée. */
          className={`absolute inset-0 overflow-hidden ${monte ? 'diapo-calque' : i === 0 ? 'media-entree' : ''} ${i === 0 ? 'opacity-100' : 'opacity-0'}`}
          style={{ '--i': i } as React.CSSProperties}
          aria-hidden={i > 0}
        >
          <Photo
            cle={image.cle}
            alt={i === 0 ? image.alt : ''}
            sizes="100vw"
            priorite={i === 0}
            differee={i > 0}
            className="h-full w-full"
            classNameImg="h-full w-full object-cover"
          />
        </div>
      ))}
    </>
  )
}
