import Link from 'next/link'
import { CaseSelection } from '@/components/media/CaseSelection'
import { Photo } from '@/components/Photo'
import { media } from '@/content/media'
import { disponibilite, type Panneau } from '@/content/panneaux'
import { formatDateCourte, formatDimensions, formatNombre } from '@/lib/format'
import type { Locale } from '@/lib/i18n'

/**
 * Carte d'un emplacement dans la liste (consigne 3, photos à l'étape
 * 15 bis) : la première photo du tableau en ratio contraint 3/2, les
 * dimensions par-dessus un voile bas pour rester lisibles. Le bloc de
 * substitution proportionnel reste le repli des sans-photo (Central
 * Équipement — jamais d'image inventée).
 * La disponibilité est toujours calculée via disponibilite(), jamais lue
 * d'un champ.
 */
export function CarteEmplacement({
  panneau,
  locale,
  maintenant,
  query,
  niveauTitre = 'h3',
  priorite = false,
}: {
  panneau: Panneau
  locale: Locale
  maintenant: Date
  /** Filtres actifs de la liste, propagés vers la fiche pour le retour. */
  query?: string
  /** h2 dans l'inventaire (sous le h1), h3 sous un h2 (fiches). Ordre des
      titres sans saut — audit accessibilité étape 14. */
  niveauTitre?: 'h2' | 'h3'
  /** true sur la première carte de l'inventaire seulement (LCP mobile). */
  priorite?: boolean
}) {
  const Titre = niveauTitre
  const dispo = disponibilite(panneau, maintenant)
  const photo = panneau.images[0] ?? null
  const hrefFiche = `/${locale}/media/emplacements/${panneau.slug}${query ? `?${query}` : ''}`

  return (
    <article className="group flex flex-col border border-line bg-surface">
      {photo !== null ? (
        <div className="relative aspect-[3/2] overflow-hidden border-b border-line">
          <Photo
            cle={photo}
            alt={panneau.nom[locale]}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priorite={priorite}
            className="h-full w-full"
            /* Zoom discret au survol (passe B), gaté mouvement réduit. */
            classNameImg="h-full w-full object-cover transition-transform duration-[600ms] motion-safe:group-hover:scale-[1.04]"
          />
          <p
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-2 pt-8 font-mono text-data text-white"
            aria-hidden
          >
            {formatDimensions(panneau.largeurM, panneau.hauteurM, locale)}
          </p>
          <CaseSelection slug={panneau.slug} label={media.selection.caseLabel[locale]} />
        </div>
      ) : (
        <div
          className="relative border-b border-line"
          style={{ aspectRatio: `${panneau.largeurM} / ${panneau.hauteurM}` }}
        >
          <p className="absolute inset-0 flex items-center justify-center font-mono text-display-m text-fg-soft">
            {formatDimensions(panneau.largeurM, panneau.hauteurM, locale)}
          </p>
          <CaseSelection slug={panneau.slug} label={media.selection.caseLabel[locale]} />
        </div>
      )}

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
          {/* Pulsation lente sur « libre » uniquement (passe B). */}
          <span
            aria-hidden
            className={`h-2 w-2 shrink-0 ${dispo === 'libre' ? 'pastille-libre bg-libre' : 'bg-occupe'}`}
          />
          {dispo === 'libre'
            ? media.dispo.libre[locale]
            : `${media.dispo.libreLe[locale]} ${formatDateCourte(panneau.libreLe as string, locale)}`}
        </p>
      </div>
    </article>
  )
}
