import type { Metadata } from 'next'
import Link from 'next/link'
import { BandeChiffres } from '@/components/BandeChiffres'
import { Container } from '@/components/Container'
import { GrilleReferences } from '@/components/GrilleReferences'
import { HeroMedia } from '@/components/HeroMedia'
import { Photo } from '@/components/Photo'
import { WhatsAppCTA } from '@/components/WhatsAppCTA'
import { accueil } from '@/content/accueil'
import { media } from '@/content/media'
import { metiers } from '@/content/metiers'
import { Compteur } from '@/components/Compteur'
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
      {/* Hero en diaporama (étape 15 bis, passe A) : 4 images réelles en
          fondu enchaîné, priority sur la première seule. Titre et cote
          inchangés par-dessus le voile. */}
      <HeroMedia
        source={{
          type: 'diaporama',
          images: accueil.heroDiaporama.map((image) => ({
            cle: image.cle,
            alt: image.alt[locale],
          })),
        }}
        titre={site.hero.titre[locale]}
        sousTitre={site.hero.sousTitre[locale]}
        coteValeur={site.hero.cote[locale]}
      />

      {/* Les deux portes (brief §6.1) : la seule chose que le visiteur doit
          comprendre du premier écran. Empilées sous 900px. Images de fond
          réelles (étape 15 bis), texte blanc par-dessus voile sombre —
          le voile porte le contraste AA quel que soit le cliché. */}
      <section data-revele-groupe className="grid border-t border-line min-[900px]:grid-cols-2">
        <Link
          href={`/${locale}/metiers`}
          className="group relative flex flex-col gap-4 overflow-hidden px-6 py-16 min-[900px]:border-r min-[900px]:border-line md:px-10"
        >
          <Photo
            cle={accueil.portes.production.image}
            alt={accueil.portes.production.imageAlt[locale]}
            sizes="(min-width: 900px) 50vw, 100vw"
            className="absolute inset-0"
            classNameImg="h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-black/60" aria-hidden />
          <span className="data relative text-white/70">
            {accueil.portes.production.surtitre[locale]}
          </span>
          <span className="expanded relative font-display text-display-m font-bold text-white">
            {accueil.portes.production.titre[locale]}
          </span>
          <span className="relative max-w-md text-white/85">
            {accueil.portes.production.phrase[locale]}
          </span>
          <span className="relative mt-auto text-sm text-white/70 transition-colors group-hover:text-white">
            {accueil.portes.production.lien[locale]} →
          </span>
        </Link>

        <div data-mode="media" className="bg-bg text-fg">
          <Link
            href={`/${locale}/media`}
            className="group relative flex h-full flex-col gap-4 overflow-hidden px-6 py-16 md:px-10"
          >
            <Photo
              cle={accueil.portes.media.image}
              alt={accueil.portes.media.imageAlt[locale]}
              sizes="(min-width: 900px) 50vw, 100vw"
              className="absolute inset-0"
              classNameImg="h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-black/70" aria-hidden />
            <span className="data relative text-accent">
              {accueil.portes.media.surtitre[locale]}
            </span>
            <span className="expanded relative font-display text-display-m font-bold text-white">
              {accueil.portes.media.titre[locale]}
            </span>
            <span className="relative max-w-md text-white/85">
              {accueil.portes.media.phrase[locale]}
            </span>
            {/* La donnée la plus vendeuse du site : calculée, jamais écrite. */}
            <span className="relative font-mono text-data text-accent">
              <Compteur valeur={libres} locale={locale} />{' '}
              {libres === 1
                ? media.inventaire.libresAujourdhui.singulier[locale]
                : media.inventaire.libresAujourdhui.pluriel[locale]}
            </span>
            <span className="relative mt-auto text-sm text-white/70 transition-colors group-hover:text-white">
              {accueil.portes.media.lien[locale]} →
            </span>
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
            <div data-revele-groupe className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              {realisations
                .filter((r) => r.publiable)
                .slice(0, 3)
                .map((item) => (
                  <article key={item.slug}>
                    {/* Vraie image dès qu'elle existe (étape 15 bis) ; le
                        régime publiable gouverne toujours la section. */}
                    {item.images[0] !== undefined ? (
                      <Photo
                        cle={item.images[0]}
                        alt={item.nom[locale]}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="aspect-[4/3] overflow-hidden border border-line bg-surface"
                        classNameImg="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="aspect-[4/3] border border-line bg-surface" aria-hidden />
                    )}
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
      <section data-revele className="border-t border-line">
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
