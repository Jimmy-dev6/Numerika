import type { Metadata } from 'next'
import Link from 'next/link'
import { BandeChiffres } from '@/components/BandeChiffres'
import { Container } from '@/components/Container'
import { GrilleReferences } from '@/components/GrilleReferences'
import { HeroMedia } from '@/components/HeroMedia'
import { WhatsAppCTA } from '@/components/WhatsAppCTA'
import { accueil } from '@/content/accueil'
import { media } from '@/content/media'
import { metiers } from '@/content/metiers'
import { disponibilite } from '@/content/panneaux'
import { realisations } from '@/content/realisations'
import { site } from '@/content/site'
import type { Locale } from '@/lib/i18n'
import { emplacements } from '@/lib/inventaire'
import { seoAlternates } from '@/lib/seo'

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  /* Titre et description : défauts du layout. */
  return { alternates: seoAlternates(params.locale, '') }
}

/** Accueil (brief §6.1, étape 7). Doit tenir debout sans une seule image :
    type, cotes et données seulement. */
export default function Accueil({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const maintenant = new Date()
  const libres = emplacements.filter((p) => disponibilite(p, maintenant) === 'libre').length

  return (
    <main>
      {/* Hero : pas de vidéo 4K ni de photo d'atelier exploitable → version
          typographique (source null). La vidéo prendra la place sans
          changer la structure. */}
      <HeroMedia
        source={null}
        titre={site.hero.titre[locale]}
        sousTitre={site.hero.sousTitre[locale]}
        coteValeur={site.hero.cote[locale]}
      />

      {/* Les deux portes (brief §6.1) : la seule chose que le visiteur doit
          comprendre du premier écran. Empilées sous 900px. */}
      <section className="grid border-t border-line min-[900px]:grid-cols-2">
        <Link
          href={`/${locale}/metiers`}
          className="group flex flex-col gap-4 px-6 py-16 transition-colors hover:bg-surface min-[900px]:border-r min-[900px]:border-line md:px-10"
        >
          <p className="data text-fg-soft">{accueil.portes.production.surtitre[locale]}</p>
          <p className="expanded font-display text-display-m font-bold">
            {accueil.portes.production.titre[locale]}
          </p>
          <p className="max-w-md text-fg-soft">{accueil.portes.production.phrase[locale]}</p>
          <p className="mt-auto text-sm text-fg-soft transition-colors group-hover:text-fg">
            {accueil.portes.production.lien[locale]} →
          </p>
        </Link>

        <div data-mode="media" className="bg-bg text-fg">
          <Link
            href={`/${locale}/media`}
            className="group flex h-full flex-col gap-4 px-6 py-16 transition-colors hover:bg-surface md:px-10"
          >
            <p className="data text-accent">{accueil.portes.media.surtitre[locale]}</p>
            <p className="expanded font-display text-display-m font-bold">
              {accueil.portes.media.titre[locale]}
            </p>
            <p className="max-w-md text-fg-soft">{accueil.portes.media.phrase[locale]}</p>
            {/* La donnée la plus vendeuse du site : calculée, jamais écrite. */}
            <p className="font-mono text-data text-accent">
              {libres}{' '}
              {libres === 1
                ? media.inventaire.libresAujourdhui.singulier[locale]
                : media.inventaire.libresAujourdhui.pluriel[locale]}
            </p>
            <p className="mt-auto text-sm text-fg-soft transition-colors group-hover:text-fg">
              {accueil.portes.media.lien[locale]} →
            </p>
          </Link>
        </div>
      </section>

      <section className="border-t border-line">
        <BandeChiffres locale={locale} />
      </section>

      {/* Réalisations en avant. `publiable` gouverne le rendu (étape 9) :
          rien ne se montre nulle part sans autorisation client — la section
          entière est masquée tant qu'aucune réalisation n'est publiable. */}
      {realisations.some((r) => r.publiable) && (
        <section className="border-t border-line">
          <Container className="py-16">
            <h2 className="expanded font-display text-display-m font-bold">
              {accueil.realisations.titre[locale]}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              {realisations
                .filter((r) => r.publiable)
                .slice(0, 3)
                .map((item) => (
                  <article key={item.slug}>
                    <div className="aspect-[4/3] border border-line bg-surface" aria-hidden />
                    <p className="data mt-4 text-fg-soft">
                      {metiers.find((m) => m.slug === item.pole)?.nom[locale] ?? item.pole}
                    </p>
                    <h3 className="mt-2 font-medium">{item.nom[locale]}</h3>
                    <p className="data mt-2 text-fg-soft">
                      {item.techniques.map((t) => t[locale]).join(', ')}
                    </p>
                  </article>
                ))}
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-line">
        <GrilleReferences locale={locale} />
      </section>

      {/* Pied d'accueil : WhatsApp générique + rappel des deux portes.
          Pas de formulaire ici. */}
      <section className="border-t border-line">
        <Container className="flex flex-wrap items-center gap-6 py-14">
          <WhatsAppCTA locale={locale} message={accueil.pied.whatsapp[locale]} />
          <Link
            href={`/${locale}/metiers`}
            className="text-sm text-fg-soft transition-colors hover:text-fg"
          >
            {accueil.portes.production.lien[locale]} →
          </Link>
          <Link
            href={`/${locale}/media`}
            className="text-sm text-fg-soft transition-colors hover:text-fg"
          >
            {accueil.portes.media.lien[locale]} →
          </Link>
        </Container>
      </section>
    </main>
  )
}
