import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/Container'
import { JsonLd } from '@/components/JsonLd'
import { Photo } from '@/components/Photo'
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

  /* Bande-galerie (étape 15 bis) — RÉGIME PÔLE, distinct de `publiable` :
     les images de réalisations montrent un produit posé dans l'espace
     public, elles sont montrables en contexte pôle dès maintenant, mais
     SANS le nom du client tant que publiable est false — l'image seule,
     jamais l'attribution (ni légende, ni alt nominatif). 3 à 6 images,
     l'ouverture exclue pour ne pas la doubler. */
  const bandeGalerie = realisations
    .filter((r) => r.pole === metier.slug)
    .flatMap((r) => r.images)
    .filter((cle) => cle !== metier.image)
    .slice(0, 6)

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
        {/* Ouverture pleine largeur (étape 15 bis) : photo de réalisation
            en contexte pôle — image seule, sans attribution (régime
            documenté dans content/metiers.ts). Ne JAMAIS illustrer un
            pôle avec la photo d'un autre métier : les pôles sans photo
            du lot (imprimerie, textile, 3D) gardent la substitution. */}
        {metier.image !== null ? (
          /* Ken Burns discret (passe B) : zoom 1 → 1.04 en 14 s, une fois. */
          <Photo
            cle={metier.image}
            alt={metier.nom[locale]}
            sizes="(min-width: 1280px) 72rem, 100vw"
            priorite
            className="kenburns aspect-[21/9] overflow-hidden border border-line bg-surface"
            classNameImg="h-full w-full object-cover"
          />
        ) : (
          <div className="aspect-[21/9] border border-line bg-surface" aria-hidden />
        )}

        <h1 className="expanded mt-10 font-display text-display-l font-bold">
          {metier.nom[locale]}
        </h1>
        <p className="mt-4 max-w-2xl text-body">{metier.description[locale]}</p>

        <section className="mt-12">
          <h2 className="data text-fg-soft">{metiersTextes.fiche.produits[locale]}</h2>
          <ul data-revele-groupe className="mt-4 divide-y divide-line border-y border-line">
            {metier.produits.map((produit) => (
              /* Ancres figées, cibles des redirections 301 de l'étape 13.
                 scroll-mt pour ne pas arriver sous l'en-tête. */
              <li key={produit.ancre} id={produit.ancre} className="scroll-mt-24 py-4">
                <span className="font-medium">{produit.nom[locale]}</span>
              </li>
            ))}
          </ul>
        </section>

        {bandeGalerie.length >= 3 && (
          /* Défilement horizontal natif, scroll-snap — pas de carrousel
             scripté. Chaque image garde son ratio intrinsèque via le
             manifeste, hauteur commune de bande. */
          <section className="mt-16" aria-label={metiersTextes.fiche.realisations[locale]}>
            <div
              data-revele-groupe
              className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:-mx-10 md:px-10"
            >
              {bandeGalerie.map((cle) => (
                <Photo
                  key={cle}
                  cle={cle}
                  alt=""
                  sizes="20rem"
                  className="h-56 w-auto shrink-0 snap-start overflow-hidden border border-line bg-surface"
                  classNameImg="h-full w-auto object-cover"
                />
              ))}
            </div>
          </section>
        )}

        {realisationsPole.length > 0 && (
          <section className="mt-16">
            <h2 className="expanded font-display text-display-m font-bold">
              {metiersTextes.fiche.realisations[locale]}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
              {realisationsPole.map((r) => (
                <article key={r.slug} className="group">
                  {r.images[0] !== undefined ? (
                    <Photo
                      cle={r.images[0]}
                      alt={r.nom[locale]}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="aspect-[4/3] overflow-hidden border border-line bg-surface"
                      classNameImg="h-full w-full object-cover transition-transform duration-[600ms] motion-safe:group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="aspect-[4/3] border border-line bg-surface" aria-hidden />
                  )}
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
            className="bouton-vif rounded-btn bg-fg px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-85"
          >
            {metiersTextes.fiche.devis[locale]}
          </Link>
          <WhatsAppCTA locale={locale} message={messageWhatsApp} />
        </section>
      </Container>
    </main>
  )
}
