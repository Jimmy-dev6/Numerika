'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { media } from '@/content/media'
import { formatNombre } from '@/lib/format'
import type { Locale } from '@/lib/i18n'
import {
  facesPossibles,
  filtresActifs,
  paliersVues,
  type FiltresInventaire,
} from '@/lib/inventaire'

/**
 * Filtres de l'inventaire (consigne 3). L'état vit dans les searchParams
 * de l'URL, jamais seulement en état local : chaque combinaison de filtres
 * est un lien partageable. Le filtrage lui-même est exécuté côté serveur.
 *
 * Filtre « type » volontairement absent : la donnée type est null sur la
 * quasi-totalité des emplacements (À CONFIRMER client). Ne jamais afficher
 * un filtre qui ne filtre rien ; à réintroduire quand les données existent.
 */
export function Filtres({
  filtres,
  zones,
  locale,
}: {
  filtres: FiltresInventaire
  zones: string[]
  locale: Locale
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [enCours, demarrer] = useTransition()

  function appliquer(patch: Partial<Record<keyof FiltresInventaire, string>>) {
    const valeurs: Record<keyof FiltresInventaire, string> = {
      zone: filtres.zone ?? '',
      faces: filtres.faces ?? '',
      vuesMin: filtres.vuesMin?.toString() ?? '',
      dispo: filtres.dispo ?? '',
      libreAvant: filtres.libreAvant ?? '',
      ...patch,
    }
    const params = new URLSearchParams()
    for (const [cle, valeur] of Object.entries(valeurs)) {
      if (valeur) params.set(cle, valeur)
    }
    const query = params.toString()
    demarrer(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    })
  }

  const classeChamp =
    'w-full border border-line bg-surface px-3 py-2 text-sm text-fg [color-scheme:inherit]'

  return (
    <fieldset
      aria-busy={enCours}
      className={`grid grid-cols-2 gap-4 transition-opacity md:grid-cols-5 ${enCours ? 'opacity-60' : ''}`}
    >
      <legend className="sr-only">{media.filtres.legende[locale]}</legend>

      <label className="block">
        <span className="data mb-2 block text-fg-soft">{media.filtres.zone[locale]}</span>
        <select
          value={filtres.zone ?? ''}
          onChange={(e) => appliquer({ zone: e.target.value })}
          className={classeChamp}
        >
          <option value="">{media.filtres.toutes[locale]}</option>
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="data mb-2 block text-fg-soft">{media.filtres.faces[locale]}</span>
        <select
          value={filtres.faces ?? ''}
          onChange={(e) => appliquer({ faces: e.target.value })}
          className={classeChamp}
        >
          <option value="">{media.filtres.toutes[locale]}</option>
          {facesPossibles.map((faces) => (
            <option key={faces} value={faces}>
              {media.facesLabels[faces][locale]}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="data mb-2 block text-fg-soft">{media.filtres.vuesMin[locale]}</span>
        <select
          value={filtres.vuesMin?.toString() ?? ''}
          onChange={(e) => appliquer({ vuesMin: e.target.value })}
          className={classeChamp}
        >
          <option value="">{media.filtres.tous[locale]}</option>
          {paliersVues.map((palier) => (
            <option key={palier} value={palier}>
              ≥ {formatNombre(palier, locale)} {media.filtres.vuesJour[locale]}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="data mb-2 block text-fg-soft">{media.filtres.dispo[locale]}</span>
        <select
          value={filtres.dispo ?? ''}
          onChange={(e) => appliquer({ dispo: e.target.value })}
          className={classeChamp}
        >
          <option value="">{media.filtres.dispoTous[locale]}</option>
          <option value="libre">{media.filtres.dispoLibre[locale]}</option>
        </select>
      </label>

      <label className="block">
        <span className="data mb-2 block text-fg-soft">{media.filtres.libreAvant[locale]}</span>
        <input
          type="date"
          value={filtres.libreAvant ?? ''}
          onChange={(e) => appliquer({ libreAvant: e.target.value })}
          className={classeChamp}
        />
      </label>

      {filtresActifs(filtres) && (
        <button
          type="button"
          onClick={() =>
            appliquer({ zone: '', faces: '', vuesMin: '', dispo: '', libreAvant: '' })
          }
          className="col-span-2 justify-self-start text-sm text-fg-soft underline underline-offset-4 transition-colors hover:text-fg md:col-span-5"
        >
          {media.filtres.reinitialiser[locale]}
        </button>
      )}
    </fieldset>
  )
}
