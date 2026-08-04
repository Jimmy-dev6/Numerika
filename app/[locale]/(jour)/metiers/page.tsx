import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { metiers, metiersTextes } from '@/content/metiers'
import type { Locale } from '@/lib/i18n'
import { seoAlternates } from '@/lib/seo'

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  return {
    title: metiersTextes.page.titre[params.locale],
    description: metiersTextes.page.intro[params.locale],
    alternates: seoAlternates(params.locale, '/metiers'),
  }
}

/**
 * Vue d'ensemble des 8 pôles (brief §5, étape 8) : liste dense, pas de
 * grille de cartes décoratives. Sans images, la page tient par la
 * typographie.
 */
export default function Metiers({ params }: { params: { locale: Locale } }) {
  const { locale } = params

  return (
    <main>
      <Container className="py-16">
        <h1 className="expanded font-display text-display-l font-bold">
          {metiersTextes.page.titre[locale]}
        </h1>
        <p className="mt-4 max-w-2xl text-fg-soft">{metiersTextes.page.intro[locale]}</p>

        <div className="mt-12">
          {metiers.map((metier) => (
            <article key={metier.slug} className="border-t border-line py-10">
              <h2 className="expanded font-display text-display-m font-bold">
                <Link
                  href={`/${locale}/metiers/${metier.slug}`}
                  className="transition-colors hover:text-red"
                >
                  {metier.nom[locale]}
                </Link>
              </h2>
              <p className="mt-3 max-w-2xl text-fg-soft">{metier.description[locale]}</p>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {metier.produits.map((produit) => (
                  <li key={produit.ancre}>
                    <Link
                      href={`/${locale}/metiers/${metier.slug}#${produit.ancre}`}
                      className="data text-fg-soft transition-colors hover:text-fg"
                    >
                      {produit.nom[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </main>
  )
}
