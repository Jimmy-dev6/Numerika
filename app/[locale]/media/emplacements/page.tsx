import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { JsonLd } from '@/components/JsonLd'
import { CarteEmplacement } from '@/components/media/CarteEmplacement'
import { CarteHoverZone } from '@/components/media/CarteHoverZone'
import { Filtres } from '@/components/media/Filtres'
import { SectionCarte } from '@/components/media/SectionCarte'
import { SurbrillanceProvider } from '@/components/media/SurbrillanceContext'
import { media } from '@/content/media'
import { formatDimensions } from '@/lib/format'
import type { Locale } from '@/lib/i18n'
import {
  appliquerFiltres,
  emplacements,
  filtresEnQuery,
  parseFiltres,
  reseaux,
  trierEmplacements,
  zones,
} from '@/lib/inventaire'
import { jsonItemList } from '@/lib/jsonld'
import { seoAlternates } from '@/lib/seo'

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  return {
    title: media.meta.emplacements.titre[params.locale],
    description: media.meta.emplacements.description[params.locale],
    alternates: seoAlternates(params.locale, '/media/emplacements'),
  }
}

/**
 * Inventaire de la régie (brief §6.2, étape 4 sans la carte).
 * Page dynamique : les filtres arrivent par searchParams (URL partageable,
 * exigence produit) et le filtrage s'exécute côté serveur. La disponibilité
 * est calculée à chaque rendu, jamais stockée.
 */
export default function Emplacements({
  params,
  searchParams,
}: {
  params: { locale: Locale }
  searchParams: Record<string, string | string[] | undefined>
}) {
  const { locale } = params
  const maintenant = new Date()

  const filtres = parseFiltres(searchParams)
  const affiches = trierEmplacements(appliquerFiltres(emplacements, filtres, maintenant), maintenant)
  const query = filtresEnQuery(filtres)

  const compteur =
    affiches.length === 1
      ? media.inventaire.affiches.singulier[locale]
      : media.inventaire.affiches.pluriel[locale]

  return (
    <main className="pb-28">
      {/* ItemList des 23 emplacements — l'inventaire complet, pas la vue
          filtrée (étape 12). */}
      <JsonLd data={jsonItemList(emplacements, locale)} />
      <section className="py-16">
        <Container>
          <p className="data text-accent">{media.hero.surtitre[locale]}</p>
          <h1 className="expanded mt-4 font-display text-display-l font-bold">
            {media.inventaire.titre[locale]}
          </h1>

          <div className="mt-10 border-y border-line py-6">
            <Filtres filtres={filtres} zones={zones} locale={locale} />
          </div>

          <p className="mt-6 font-mono text-data text-fg-soft" aria-live="polite">
            {affiches.length} {media.inventaire.sur[locale]} {emplacements.length} {compteur}
          </p>

          {/* Carte et liste synchronisées (étape 5). DOM : carte d'abord
              (bouton de repli en tête sur mobile, lien d'évitement vers la
              liste), affichage : liste à gauche sur grand écran. La liste
              reste le chemin complet, la carte est une amélioration. */}
          <SurbrillanceProvider>
            <div className="mt-8 gap-8 lg:flex lg:items-start">
              <aside className="lg:sticky lg:top-6 lg:order-2 lg:w-2/5">
                <SectionCarte
                  panneaux={affiches}
                  maintenantIso={maintenant.toISOString()}
                  locale={locale}
                />
              </aside>

              <div id="liste-emplacements" className="mt-8 lg:order-1 lg:mt-0 lg:flex-1">
                {affiches.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {affiches.map((panneau) => (
                      <CarteHoverZone key={panneau.slug} slug={panneau.slug}>
                        <CarteEmplacement
                          panneau={panneau}
                          locale={locale}
                          maintenant={maintenant}
                          query={query}
                          niveauTitre="h2"
                        />
                      </CarteHoverZone>
                    ))}
                  </div>
                ) : (
                  /* État vide (consigne 6) : factuel, jamais d'écran muet. */
                  <div className="border border-line bg-surface p-10 text-center">
                    <p className="text-fg-soft">{media.vide.message[locale]}</p>
                    <Link
                      href={`/${locale}/media/emplacements`}
                      className="mt-4 inline-block text-sm underline underline-offset-4 transition-colors hover:text-accent"
                    >
                      {media.filtres.reinitialiser[locale]}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SurbrillanceProvider>
        </Container>
      </section>

      {/* Les réseaux : section séparée, jamais mélangés aux emplacements
          (consigne 3), pas de case à cocher (consigne 4). */}
      <section className="border-t border-line py-16">
        <Container>
          <h2 className="expanded font-display text-display-m font-bold">
            {media.reseaux.titre[locale]}
          </h2>
          <p className="mt-4 max-w-2xl text-fg-soft">{media.reseaux.intro[locale]}</p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reseaux.map((reseau) => (
              <article key={reseau.slug} className="flex flex-col border border-line bg-surface">
                <div
                  className="relative mx-auto w-full max-w-[12rem] border-b border-line"
                  style={{ aspectRatio: `${reseau.largeurM} / ${reseau.hauteurM}` }}
                >
                  <p className="absolute inset-0 flex items-center justify-center font-mono text-data text-fg-soft">
                    {formatDimensions(reseau.largeurM, reseau.hauteurM, locale)}
                  </p>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="text-sm font-medium">{reseau.nom[locale]}</h3>
                  <p className="data text-fg-soft">{reseau.zone}</p>
                  {reseau.support !== null && (
                    <p className="text-sm text-fg-soft">
                      {media.supportLabels[reseau.support][locale]},{' '}
                      {media.facesLabels[reseau.faces][locale].toLowerCase()}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </main>
  )
}
