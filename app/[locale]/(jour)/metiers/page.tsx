import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { Photo } from '@/components/Photo'
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

        <div data-revele-groupe className="mt-12">
          {metiers.map((metier) => (
            /* Vignette de pôle (étape 15 bis) : photo de réalisation en
               contexte pôle — image seule, sans attribution (régime
               documenté dans content/metiers.ts). La liste reste dense :
               la vignette accompagne, elle ne prend pas la page. */
            <article
              key={metier.slug}
              className="grid gap-6 border-t border-line py-10 md:grid-cols-[1fr,14rem] md:items-start"
            >
              <div>
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
              </div>
              {metier.image !== null && (
                <Photo
                  cle={metier.image}
                  alt={metier.nom[locale]}
                  sizes="(min-width: 768px) 14rem, 100vw"
                  className="order-first aspect-[4/3] overflow-hidden border border-line bg-surface md:order-none"
                  classNameImg="h-full w-full object-cover"
                />
              )}
            </article>
          ))}
        </div>
      </Container>
    </main>
  )
}
