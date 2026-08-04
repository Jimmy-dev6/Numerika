import type { Metadata } from 'next'
import Link from 'next/link'
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
  const contactsMillions = (Math.floor(contactsCumules / 100_000) / 10).toLocaleString(
    locale === 'fr' ? 'fr-FR' : 'en-GB',
    { minimumFractionDigits: 1, maximumFractionDigits: 1 }
  )

  const libres = emplacements.filter((p) => disponibilite(p, maintenant) === 'libre').length

  return (
    <main>
      <section className="py-24 md:py-32">
        <Container>
          <p className="data text-accent">{media.hero.surtitre[locale]}</p>
          <h1 className="expanded mt-6 font-display text-display-xl font-bold">
            {media.hero.titre[locale]}
          </h1>
          <p className="mt-8 max-w-2xl text-fg-soft">{media.hero.sousTitre[locale]}</p>

          <dl className="mt-16 grid grid-cols-1 gap-8 border-t border-line pt-8 sm:grid-cols-3">
            <div>
              <dd className="font-mono text-display-m text-accent">{emplacements.length}</dd>
              <dt className="mt-1 text-sm text-fg-soft">
                {media.hero.chiffres.emplacements[locale]}
              </dt>
            </div>
            <div>
              <dd className="font-mono text-display-m text-accent">{reseaux.length}</dd>
              <dt className="mt-1 text-sm text-fg-soft">{media.hero.chiffres.reseaux[locale]}</dt>
            </div>
            <div>
              <dd className="font-mono text-display-m text-accent">+{contactsMillions} M</dd>
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
              {libres}{' '}
              {libres === 1
                ? media.inventaire.libresAujourdhui.singulier[locale]
                : media.inventaire.libresAujourdhui.pluriel[locale]}
            </span>
          </Link>
        </Container>
      </section>

      <section className="border-t border-line py-16">
        <Container>
          <h2 className="expanded font-display text-display-m font-bold">
            {media.reseaux.titre[locale]}
          </h2>
          <p className="mt-4 max-w-2xl text-fg-soft">{media.reseaux.intro[locale]}</p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
