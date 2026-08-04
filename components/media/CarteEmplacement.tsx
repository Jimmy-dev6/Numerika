import Link from 'next/link'
import { CaseSelection } from '@/components/media/CaseSelection'
import { media } from '@/content/media'
import { disponibilite, type Panneau } from '@/content/panneaux'
import { formatDateCourte, formatDimensions, formatNombre } from '@/lib/format'
import type { Locale } from '@/lib/i18n'

/**
 * Carte d'un emplacement dans la liste (consigne 3).
 * En attendant les photos (asset À CONFIRMER), bloc de substitution sobre :
 * fond surface, proportions réelles du panneau, dimensions en grand.
 * La disponibilité est toujours calculée via disponibilite(), jamais lue
 * d'un champ.
 */
export function CarteEmplacement({
  panneau,
  locale,
  maintenant,
  query,
  niveauTitre = 'h3',
}: {
  panneau: Panneau
  locale: Locale
  maintenant: Date
  /** Filtres actifs de la liste, propagés vers la fiche pour le retour. */
  query?: string
  /** h2 dans l'inventaire (sous le h1), h3 sous un h2 (fiches). Ordre des
      titres sans saut — audit accessibilité étape 14. */
  niveauTitre?: 'h2' | 'h3'
}) {
  const Titre = niveauTitre
  const dispo = disponibilite(panneau, maintenant)
  const hrefFiche = `/${locale}/media/emplacements/${panneau.slug}${query ? `?${query}` : ''}`

  return (
    <article className="flex flex-col border border-line bg-surface">
      <div
        className="relative border-b border-line"
        style={{ aspectRatio: `${panneau.largeurM} / ${panneau.hauteurM}` }}
      >
        <p className="absolute inset-0 flex items-center justify-center font-mono text-display-m text-fg-soft">
          {formatDimensions(panneau.largeurM, panneau.hauteurM, locale)}
        </p>
        <CaseSelection slug={panneau.slug} label={media.selection.caseLabel[locale]} />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="data text-fg-soft">{panneau.zone}</p>
        <Titre className="text-sm font-medium leading-snug">
          <Link href={hrefFiche} className="transition-colors hover:text-accent">
            {panneau.nom[locale]}
          </Link>
        </Titre>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2">
          {panneau.vuesJour !== null && (
            <span className="font-mono text-data text-fg-soft">
              {formatNombre(panneau.vuesJour, locale)} {media.filtres.vuesJour[locale]}
            </span>
          )}
          <span className="data text-fg-soft">{media.facesLabels[panneau.faces][locale]}</span>
        </div>

        <p className="flex items-center gap-2 font-mono text-data">
          <span
            aria-hidden
            className={`h-2 w-2 shrink-0 ${dispo === 'libre' ? 'bg-libre' : 'bg-occupe'}`}
          />
          {dispo === 'libre'
            ? media.dispo.libre[locale]
            : `${media.dispo.libreLe[locale]} ${formatDateCourte(panneau.libreLe as string, locale)}`}
        </p>
      </div>
    </article>
  )
}
