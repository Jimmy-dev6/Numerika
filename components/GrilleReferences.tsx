import { Compteur } from '@/components/Compteur'
import { Container } from '@/components/Container'
import { accueil } from '@/content/accueil'
import { references } from '@/content/references'
import type { Locale } from '@/lib/i18n'

/**
 * Références (brief §6.1), partagée accueil / entreprise (étape 10).
 * Passe B : la grille devient un double bandeau défilant (marquee CSS
 * pur, deux directions, pause au survol, ~40 s/boucle). Chaque piste
 * contient une copie aria-hidden pour boucler sans couture ; sans
 * JavaScript ou en mouvement réduit, les copies restent masquées et la
 * grille statique d'origine demeure (globals.css). Institutionnels
 * d'abord, donc dans la première piste. Les logos remplaceront les noms
 * quand ils seront fournis proprement.
 */
export function GrilleReferences({ locale }: { locale: Locale }) {
  const triees = [...references].sort(
    (a, b) => Number(b.institutionnel) - Number(a.institutionnel)
  )
  const moitie = Math.ceil(triees.length / 2)
  const pistes = [triees.slice(0, moitie), triees.slice(moitie)]

  return (
    <Container className="py-16">
      <p className="data text-fg-soft">
        <Compteur valeur={references.length} locale={locale} />{' '}
        {accueil.references.intertitre[locale]}
      </p>
      <div className="marquee mt-8">
        {pistes.map((piste, rang) => (
          <ul
            key={rang}
            className="marquee-piste text-sm"
            data-sens={rang === 1 ? 'inverse' : undefined}
          >
            {piste.map((reference) => (
              <li key={reference.nom} className={reference.institutionnel ? 'font-medium' : ''}>
                {reference.nom}
              </li>
            ))}
            {piste.map((reference) => (
              <li
                key={`copie-${reference.nom}`}
                aria-hidden
                className={`marquee-copie ${reference.institutionnel ? 'font-medium' : ''}`}
              >
                {reference.nom}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </Container>
  )
}
