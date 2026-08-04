'use client'

import Link from 'next/link'
import { useSelection } from '@/components/media/SelectionContext'
import { WhatsAppCTA } from '@/components/WhatsAppCTA'
import { media } from '@/content/media'
import { panneaux } from '@/content/panneaux'
import { formatDimensions } from '@/lib/format'
import type { Locale } from '@/lib/i18n'

/**
 * Compteur de sélection persistant, fixé en bas d'écran (consigne 4).
 * Actions : demande groupée WhatsApp listant les emplacements cochés
 * (nom + dimensions), et pré-remplissage du devis via searchParams.
 */
export function BarreSelection({ locale }: { locale: Locale }) {
  const { slugs, vider } = useSelection()

  if (slugs.length === 0) return null

  const selection = panneaux.filter((p) => slugs.includes(p.slug))
  const message = [
    media.selection.messageIntro[locale],
    ...selection.map(
      (p) => `- ${p.nom[locale]} (${formatDimensions(p.largeurM, p.hauteurM, locale)})`
    ),
  ].join('\n')

  const compteur =
    slugs.length === 1
      ? media.selection.compteur.singulier[locale]
      : media.selection.compteur.pluriel[locale]

  return (
    /* Rendu nul à sélection vide (plus haut) ; safe-area pour les écrans
       à encoche (validation étape 4). */
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-grid flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3">
        <p className="mr-auto text-sm">
          <span className="font-mono text-data">{slugs.length}</span> {compteur}
        </p>
        <WhatsAppCTA
          locale={locale}
          message={message}
          label={media.selection.whatsappLabel[locale]}
        />
        <Link
          href={`/${locale}/devis?panneaux=${slugs.join(',')}`}
          className="rounded-btn bg-fg px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-85"
        >
          {media.selection.devisLabel[locale]}
        </Link>
        <button
          type="button"
          onClick={vider}
          className="text-sm text-fg-soft transition-colors hover:text-fg"
        >
          {media.selection.vider[locale]}
        </button>
      </div>
    </div>
  )
}
