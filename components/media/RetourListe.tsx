'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { media } from '@/content/media'
import type { Locale } from '@/lib/i18n'

/**
 * Retour vers la liste en conservant les filtres (étape 6, consigne 4) :
 * la fiche est statique, le contexte de filtre arrive donc en searchParams
 * côté client et repart tel quel vers la liste. Un commercial qui ouvre
 * une fiche depuis sa liste filtrée ne perd pas son contexte en revenant.
 */
function Retour({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams()
  const query = searchParams.toString()

  return (
    <Link
      href={`/${locale}/media/emplacements${query ? `?${query}` : ''}`}
      className="text-sm text-fg-soft transition-colors hover:text-fg"
    >
      ← {media.fiche.retour[locale]}
    </Link>
  )
}

export function RetourListe({ locale }: { locale: Locale }) {
  return (
    /* useSearchParams exige une frontière Suspense dans une page statique ;
       le repli est le lien nu vers la liste. */
    <Suspense
      fallback={
        <Link
          href={`/${locale}/media/emplacements`}
          className="text-sm text-fg-soft transition-colors hover:text-fg"
        >
          ← {media.fiche.retour[locale]}
        </Link>
      }
    >
      <Retour locale={locale} />
    </Suspense>
  )
}
