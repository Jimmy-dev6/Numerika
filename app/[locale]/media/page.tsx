import type { Metadata } from 'next'
import Link from 'next/link'
import { preload } from 'react-dom'
import { Compteur } from '@/components/Compteur'
import { Container } from '@/components/Container'
import { WhatsAppCTA } from '@/components/WhatsAppCTA'
import { media } from '@/content/media'
import { disponibilite } from '@/content/panneaux'
import { formatDimensions, formatNombre } from '@/lib/format'
import type { Locale } from '@/lib/i18n'
import { emplacements, reseaux } from '@/lib/inventaire'
import { seoAlternates } from '@/lib/seo'

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  return {
    title: media.meta.accueil.titre[params.locale],
    description: media.hero.sousTitre[params.locale],
    alternates: seoAlternates(params.locale, '/media'),
  }
}

/**
 * Accueil régie (brief §6.2). Hero vidéo drone à venir (asset n°4,
 * À CONFIRMER) : en attendant, fond nuit sobre, jamais d'image de
 * substitution générique.
 */
export default function MediaAccueil({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const maintenant = new Date()

  /* Somme des estimations Numerika, arrondie vers le bas et toujours
     présentée comme cumulée, jamais comme audience nette (brief §7.3). */
  const contactsCumules = emplacements.reduce((somme, p) => somme + (p.vuesJour ?? 0), 0)
  const contactsMillions = Math.floor(contactsCumules / 100_000) / 10

  const libres = emplacements.filter((p) => disponibilite(p, maintenant) === 'libre').length

  /* Le poster du hero vidéo porte le LCP : preload en priorité haute. */
  preload('/images/panneaux/pikine-arene-nationale-640.webp', {
    as: 'image',
    fetchPriority: 'high',
  })

  return (
    <main>
      {/* Hero vidéo drone (étape 15 bis, passe A) : la plus spectaculaire
          du lot (arène nationale), muette, en boucle, poster tiré de la
          photo du même emplacement (DJI_0637). Le poster porte le LCP ;
          la vidéo n'est jamais sur son chemin. Voile nuit par-dessus. */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/pikine-arene-nationale.mp4"
          poster="/images/panneaux/pikine-arene-nationale-640.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0b0f14] via-[#0b0f14]/70 to-[#0b0f14]/40"
          aria-hidden
        />
        {/* Passe B — « la ville s'allume » : voile noir fondu en 1 s
            par-dessus le hero. Le poster peint dessous dès la première
            frame, le LCP n'attend rien ; sans JS ou en mouvement réduit
            le voile reste transparent (globals.css). */}
        <div className="voile-allumage absolute inset-0 bg-[#0b0f14]" aria-hidden />
        <Container className="relative">
          <p className="data text-accent">{media.hero.surtitre[locale]}</p>
          <h1 className="expanded mt-6 font-display text-display-xl font-bold">
            {media.hero.titre[locale]}
          </h1>
          <p className="mt-8 max-w-2xl text-fg-soft">{media.hero.sousTitre[locale]}</p>

          {/* Compteurs (passe B) : ils démarrent après le fondu du voile
              (délai 900 ms) — jamais deux moments simultanés. */}
          <dl className="mt-16 grid grid-cols-1 gap-8 border-t border-line pt-8 sm:grid-cols-3">
            <div>
              <dd className="font-mono text-display-m text-accent">
                <Compteur valeur={emplacements.length} locale={locale} delaiMs={900} />
              </dd>
              <dt className="mt-1 text-sm text-fg-soft">
                {media.hero.chiffres.emplacements[locale]}
              </dt>
            </div>
            <div>
              <dd className="font-mono text-display-m text-accent">
                <Compteur valeur={reseaux.length} locale={locale} delaiMs={900} />
              </dd>
              <dt className="mt-1 text-sm text-fg-soft">{media.hero.chiffres.reseaux[locale]}</dt>
            </div>
            <div>
              <dd className="font-mono text-display-m text-accent">
                <Compteur
                  valeur={contactsMillions}
                  locale={locale}
                  decimales={1}
                  prefixe="+"
                  suffixe=" M"
                  delaiMs={900}
                />
              </dd>
              <dt className="mt-1 text-sm text-fg-soft">{media.hero.chiffres.contacts[locale]}</dt>
            </div>
          </dl>
          <p className="mt-6 text-xs text-fg-soft">{media.hero.noteTrafics[locale]}</p>
        </Container>
      </section>

      <section className="border-t border-line py-16">
        <Container>
          <Link
            href={`/${locale}/media/emplacements`}
            className="group flex flex-wrap items-baseline justify-between gap-4 border border-line bg-surface p-8 transition-colors hover:border-fg-soft"
          >
            <span className="expanded font-display text-display-m font-bold">
              {media.inventaire.titre[locale]}
            </span>
            <span className="text-sm text-fg-soft transition-colors group-hover:text-fg">
              {media.inventaire.lien[locale]} →
            </span>
            <span className="w-full font-mono text-data text-fg-soft">
              <Compteur valeur={libres} locale={locale} />{' '}
              {libres === 1
                ? media.inventaire.libresAujourdhui.singulier[locale]
                : media.inventaire.libresAujourdhui.pluriel[locale]}
            </span>
          </Link>
        </Container>
      </section>

      {/* Les 4 réseaux : les visuels du site actuel sont des images IA
          (exclues par principe) → cartes de données conservées, sans
          visuel. À CONFIRMER : photos réelles des réseaux à demander. */}
      <section className="border-t border-line py-16">
        <Container>
          <h2 className="expanded font-display text-display-m font-bold">
            {media.reseaux.titre[locale]}
          </h2>
          <p className="mt-4 max-w-2xl text-fg-soft">{media.reseaux.intro[locale]}</p>

          <div
            data-revele-groupe
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {reseaux.map((reseau) => (
              <article key={reseau.slug} className="border border-line bg-surface p-6">
                <h3 className="text-sm font-medium">{reseau.nom[locale]}</h3>
                <dl className="mt-4 space-y-2">
                  <div className="flex justify-between gap-4">
                    <dt className="data text-fg-soft">{media.reseaux.format[locale]}</dt>
                    <dd className="font-mono text-data">
                      {formatDimensions(reseau.largeurM, reseau.hauteurM, locale)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="data text-fg-soft">{media.reseaux.couverture[locale]}</dt>
                    <dd className="text-sm">{reseau.zone}</dd>
                  </div>
                  {reseau.support !== null && (
                    <div className="flex justify-between gap-4">
                      <dt className="data text-fg-soft">{media.reseaux.support[locale]}</dt>
                      <dd className="text-sm">{media.supportLabels[reseau.support][locale]}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt className="data text-fg-soft">{media.reseaux.faces[locale]}</dt>
                    <dd className="text-sm">{media.facesLabels[reseau.faces][locale]}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-16">
        <Container>
          <WhatsAppCTA locale={locale} message={media.whatsappAccueil[locale]} />
        </Container>
      </section>
    </main>
  )
}
