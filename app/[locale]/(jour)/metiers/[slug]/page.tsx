import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/Container'
import { JsonLd } from '@/components/JsonLd'
import { WhatsAppCTA } from '@/components/WhatsAppCTA'
import { metiers, metiersTextes } from '@/content/metiers'
import { realisations } from '@/content/realisations'
import { site } from '@/content/site'
import type { Locale } from '@/lib/i18n'
import { jsonFilAriane, jsonService } from '@/lib/jsonld'
import { seoAlternates } from '@/lib/seo'

export function generateStaticParams() {
  return metiers.map((m) => ({ slug: m.slug }))
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string }
}): Metadata {
  const metier = metiers.find((m) => m.slug === params.slug)
  if (!metier) return {}
  return {
    title: metier.nom[params.locale],
    description: metier.description[params.locale],
    alternates: seoAlternates(params.locale, `/metiers/${metier.slug}`),
  }
}

/** Fiche pôle, gabarit unique (brief §6.4, étape 8). */
export default function FicheMetier({ params }: { params: { locale: Locale; slug: string } }) {
  const metier = metiers.find((m) => m.slug === params.slug)
  if (!metier) notFound()
  const { locale } = params

  /* 3 à 5 réalisations du pôle quand elles existent ; sinon la section
     est masquée — pas de substitution vide. Seules les publiable: true
     se montrent (étape 9) : rien sans autorisation client. */
  const realisationsPole = realisations
    .filter((r) => r.pole === metier.slug && r.publiable)
    .slice(0, 5)

  const messageWhatsApp = `${metiersTextes.fiche.whatsappIntro[locale]} ${metier.contexteDevis[locale]}.`

  return (
    <main>
      <JsonLd data={jsonService(metier, locale)} />
      <JsonLd
        data={jsonFilAriane([
          { nom: metiersTextes.page.titre[locale], chemin: `/${locale}/metiers` },
          { nom: metier.nom[locale], chemin: `/${locale}/metiers/${metier.slug}` },
        ])}
      />
      <Container className="py-16">
        {/* Ouverture : bloc de substitution en attendant les photos
            d'atelier (metier.image null, asset n°1). */}
        <div className="aspect-[21/9] border border-line bg-surface" aria-hidden />

        <h1 className="expanded mt-10 font-display text-display-l font-bold">
          {metier.nom[locale]}
        </h1>
        <p className="mt-4 max-w-2xl text-body">{metier.description[locale]}</p>

        <section className="mt-12">
          <h2 className="data text-fg-soft">{metiersTextes.fiche.produits[locale]}</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {metier.produits.map((produit) => (
              /* Ancres figées, cibles des redirections 301 de l'étape 13.
                 scroll-mt pour ne pas arriver sous l'en-tête. */
              <li key={produit.ancre} id={produit.ancre} className="scroll-mt-24 py-4">
                <span className="font-medium">{produit.nom[locale]}</span>
              </li>
            ))}
          </ul>
        </section>

        {realisationsPole.length > 0 && (
          <section className="mt-16">
            <h2 className="expanded font-display text-display-m font-bold">
              {metiersTextes.fiche.realisations[locale]}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
              {realisationsPole.map((r) => (
                <article key={r.slug}>
                  <div className="aspect-[4/3] border border-line bg-surface" aria-hidden />
                  <h3 className="mt-4 font-medium">
                    <Link
                      href={`/${locale}/realisations/${r.slug}`}
                      className="transition-colors hover:text-red"
                    >
                      {r.nom[locale]}
                    </Link>
                  </h3>
                  <p className="data mt-2 text-fg-soft">
                    {r.techniques.map((t) => t[locale]).join(', ')}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 flex flex-wrap items-center gap-4 border-t border-line pt-10">
          <Link
            href={`/${locale}${site.devis.href}`}
            className="rounded-btn bg-fg px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-85"
          >
            {metiersTextes.fiche.devis[locale]}
          </Link>
          <WhatsAppCTA locale={locale} message={messageWhatsApp} />
        </section>
      </Container>
    </main>
  )
}
