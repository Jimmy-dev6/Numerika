import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/Container'
import { Cote } from '@/components/Cote'
import { JsonLd } from '@/components/JsonLd'
import { Photo } from '@/components/Photo'
import { metiers } from '@/content/metiers'
import { realisations, realisationsTextes } from '@/content/realisations'
import { formatDimensions, formatMetres } from '@/lib/format'
import type { Locale } from '@/lib/i18n'
import { jsonFilAriane } from '@/lib/jsonld'
import { seoAlternates } from '@/lib/seo'

/** Seules les études de cas publiables existent — pas de page fantôme. */
export function generateStaticParams() {
  return realisations.filter((r) => r.publiable).map((r) => ({ slug: r.slug }))
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string }
}): Metadata {
  const r = realisations.find((x) => x.slug === params.slug && x.publiable)
  if (!r) return {}
  const { locale } = params
  return {
    title: `${r.nom[locale]} — ${r.client}`,
    description:
      r.resume?.[locale] ?? r.techniques.map((t) => t[locale]).join(', '),
    alternates: seoAlternates(locale, `/realisations/${r.slug}`),
  }
}

/** Étude de cas (brief §6.5, étape 9) : le contexte, la réponse, les images. */
export default function EtudeDeCas({ params }: { params: { locale: Locale; slug: string } }) {
  const r = realisations.find((x) => x.slug === params.slug && x.publiable)
  if (!r) notFound()
  const { locale } = params

  const pole = metiers.find((m) => m.slug === r.pole)

  return (
    <main>
      <JsonLd
        data={jsonFilAriane([
          { nom: realisationsTextes.page.titre[locale], chemin: `/${locale}/realisations` },
          { nom: r.nom[locale], chemin: `/${locale}/realisations/${r.slug}` },
        ])}
      />
      <Container className="py-16">
        <header>
          <p className="data text-fg-soft">{pole?.nom[locale] ?? r.pole}</p>
          <h1 className="expanded mt-3 font-display text-display-l font-bold">{r.nom[locale]}</h1>
          <p className="mt-4 flex flex-wrap gap-x-8 gap-y-1">
            <span>
              <span className="data text-fg-soft">{realisationsTextes.fiche.client[locale]}</span>{' '}
              {r.client}
            </span>
            {r.annee !== null && (
              <span>
                <span className="data text-fg-soft">{realisationsTextes.fiche.annee[locale]}</span>{' '}
                <span className="font-mono text-data">{r.annee}</span>
              </span>
            )}
          </p>
        </header>

        {/* Le média (étape 15 bis) : les vraies photos dès qu'elles
            existent — la première en grand, les suivantes en galerie.
            Coté quand les dimensions sont connues — jamais inventées.
            Sans photo : substitution, cotée si possible. */}
        <div className="mt-10">
          {r.images[0] !== undefined ? (
            <>
              <div className="relative">
                <Photo
                  cle={r.images[0]}
                  alt={r.nom[locale]}
                  sizes="(min-width: 1280px) 72rem, 100vw"
                  priorite
                  className="overflow-hidden border border-line bg-surface"
                  classNameImg="h-auto w-full"
                />
                {r.dimensions !== null && (
                  <>
                    <Cote
                      valeur={formatMetres(r.dimensions.largeurM, locale)}
                      position="top"
                      className="cote-sur-media"
                    />
                    <Cote
                      valeur={formatMetres(r.dimensions.hauteurM, locale)}
                      position="right"
                      className="cote-sur-media"
                    />
                  </>
                )}
              </div>
              {r.images.length > 1 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {r.images.slice(1).map((cle, i) => (
                    <Photo
                      key={cle}
                      cle={cle}
                      alt={`${r.nom[locale]} — photo ${i + 2}`}
                      sizes="(min-width: 640px) 33vw, 50vw"
                      className="aspect-[4/3] overflow-hidden border border-line bg-surface"
                      classNameImg="h-full w-full object-cover"
                    />
                  ))}
                </div>
              )}
            </>
          ) : r.dimensions !== null ? (
            <div
              className="relative mx-auto w-full border border-line bg-surface"
              style={{
                aspectRatio: `${r.dimensions.largeurM} / ${r.dimensions.hauteurM}`,
                maxWidth: `min(100%, calc(24rem * ${r.dimensions.largeurM / r.dimensions.hauteurM}))`,
              }}
            >
              <Cote valeur={formatMetres(r.dimensions.largeurM, locale)} position="top" />
              <Cote valeur={formatMetres(r.dimensions.hauteurM, locale)} position="right" />
            </div>
          ) : (
            <div className="aspect-[21/9] border border-line bg-surface" aria-hidden />
          )}
        </div>

        {r.resume !== null && (
          <section className="mt-12">
            <h2 className="data text-fg-soft">{realisationsTextes.fiche.contexte[locale]}</h2>
            <p className="mt-3 max-w-2xl">{r.resume[locale]}</p>
          </section>
        )}

        <section className="mt-12">
          <h2 className="data text-fg-soft">{realisationsTextes.fiche.reponse[locale]}</h2>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {r.techniques.map((t) => (
              <li key={t.fr} className="data border border-line px-3 py-1">
                {t[locale]}
              </li>
            ))}
          </ul>
          {r.dimensions !== null && (
            <p className="mt-4">
              <span className="data text-fg-soft">
                {realisationsTextes.fiche.dimensions[locale]}
              </span>{' '}
              <span className="font-mono text-data">
                {formatDimensions(r.dimensions.largeurM, r.dimensions.hauteurM, locale)}
              </span>
            </p>
          )}
        </section>
      </Container>
    </main>
  )
}
