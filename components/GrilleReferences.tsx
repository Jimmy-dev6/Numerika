import { Container } from '@/components/Container'
import { accueil } from '@/content/accueil'
import { references } from '@/content/references'
import type { Locale } from '@/lib/i18n'

/**
 * Grille des références (brief §6.1) : statique, en texte, ordonnée,
 * dense. Institutionnels d'abord. Partagée entre l'accueil et
 * /entreprise (étape 10). Les logos remplaceront les noms quand ils
 * seront fournis proprement.
 */
export function GrilleReferences({ locale }: { locale: Locale }) {
  const triees = [...references].sort(
    (a, b) => Number(b.institutionnel) - Number(a.institutionnel)
  )

  return (
    <Container className="py-16">
      <p className="data text-fg-soft">
        <span className="font-mono">{references.length}</span>{' '}
        {accueil.references.intertitre[locale]}
      </p>
      <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3 lg:grid-cols-4">
        {triees.map((reference) => (
          <li key={reference.nom} className={reference.institutionnel ? 'font-medium' : ''}>
            {reference.nom}
          </li>
        ))}
      </ul>
    </Container>
  )
}
