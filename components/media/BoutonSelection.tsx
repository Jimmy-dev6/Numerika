'use client'

import { useSelection } from '@/components/media/SelectionContext'
import { media } from '@/content/media'
import type { Locale } from '@/lib/i18n'

/**
 * Ajout à la sélection depuis une fiche (étape 6). Même contexte que la
 * liste : la sélection survit à la navigation liste ↔ fiche.
 */
export function BoutonSelection({ slug, locale }: { slug: string; locale: Locale }) {
  const { slugs, basculer } = useSelection()
  const selectionne = slugs.includes(slug)

  return (
    <button
      type="button"
      onClick={() => basculer(slug)}
      aria-pressed={selectionne}
      className="rounded-btn bg-fg px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-85"
    >
      {selectionne ? media.selection.retirer[locale] : media.selection.ajouter[locale]}
    </button>
  )
}
