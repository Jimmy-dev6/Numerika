import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { preload } from 'react-dom'
import { Container } from '@/components/Container'
import { Cote } from '@/components/Cote'
import { JsonLd } from '@/components/JsonLd'
import { BoutonSelection } from '@/components/media/BoutonSelection'
import { CarteEmplacement } from '@/components/media/CarteEmplacement'
import { RetourListe } from '@/components/media/RetourListe'
import { Photo } from '@/components/Photo'
import { WhatsAppCTA } from '@/components/WhatsAppCTA'
import { imagesGen } from '@/content/images.gen'
import { media } from '@/content/media'
import { disponibilite, panneaux, type Panneau } from '@/content/panneaux'
import { formatDateCourte, formatDimensions, formatMetres, formatNombre } from '@/lib/format'
import type { Locale } from '@/lib/i18n'
import { emplacements } from '@/lib/inventaire'
import { jsonFilAriane } from '@/lib/jsonld'
import { seoAlternates } from '@/lib/seo'

/** Les 27 fiches (23 emplacements + 4 réseaux) sont générées en statique. */
export function generateStaticParams() {
  return panneaux.map((p) => ({ slug: p.slug }))
}

/**
 * Métadonnées par fiche (étape 6, consigne 3). Titre absolu pour échapper
 * au gabarit « %s — NUMERIKA » du layout. L'image OG dynamique de l'étape
 * 12 se branchera ici (openGraph.images) sans refonte.
 */
export function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string }
}): Metadata {
  const panneau = panneaux.find((p) => p.slug === params.slug)
  if (!panneau) return {}
  const { locale } = params
  const dims = formatDimensions(panneau.largeurM, panneau.hauteurM, locale)

  const alternates = seoAlternates(locale, `/media/emplacements/${panneau.slug}`)

  if (panneau.categorie === 'reseau') {
    return {
      title: { absolute: `${panneau.nom[locale]} — ${locale === 'fr' ? `Affichage ${dims}` : `${dims} display`} | Numerika Media` },
      description:
        locale === 'fr'
          ? `Réseau d’affichage au format ${dims}, couverture ${panneau.zone}.`
          : `Display network in ${dims} format, covering ${panneau.zone}.`,
      alternates,
    }
  }

  const vues =
    panneau.vuesJour !== null
      ? locale === 'fr'
        ? ` ${formatNombre(panneau.vuesJour, locale)} vues par jour, estimation Numerika.`
        : ` ${formatNombre(panneau.vuesJour, locale)} views per day, Numerika estimate.`
      : ''

  return {
    title: {
      absolute:
        locale === 'fr'
          ? `${panneau.nom.fr} — Affichage ${dims} à ${panneau.zone} | Numerika Media`
          : `${panneau.nom.en} — ${dims} billboard in ${panneau.zone} | Numerika Media`,
    },
    description:
      locale === 'fr'
        ? `Panneau ${dims} à ${panneau.zone}, ${panneau.ville}.${vues}`
        : `${dims} billboard in ${panneau.zone}, ${panneau.ville}.${vues}`,
    alternates,
  }
}

/**
 * Bloc média (étape 15 bis, passe A) : la vidéo drone quand elle existe
 * (muette, boucle, poster, preload metadata), sinon la photo en grand,
 * sinon la substitution proportionnelle. Les deux <Cote> annotent
 * PAR-DESSUS le média dans tous les cas — c'est la signature, elle ne
 * disparaît pas sous les images. Les valeurs restent les dimensions
 * réelles du panneau, jamais celles du cadre.
 */
function BlocMedia({ panneau, locale }: { panneau: Panneau; locale: Locale }) {
  /* Ratio du cadre : celui du média quand il y en a un (vidéos 16/9,
     photos à leur ratio intrinsèque lu du manifeste), sinon les
     proportions réelles du panneau. */
  const photo = panneau.images[0] ?? null
  const meta = photo !== null ? imagesGen[photo] : null

  /* Le poster porte le LCP de la fiche : preload en priorité haute —
     l'attribut poster est découvert trop tard par le scanner sinon. */
  if (panneau.video !== null) {
    preload(`/videos/${panneau.video}-poster.jpg`, { as: 'image', fetchPriority: 'high' })
  }
  const ratio =
    panneau.video !== null
      ? 16 / 9
      : meta !== null
        ? meta.largeur / meta.hauteur
        : panneau.largeurM / panneau.hauteurM

  return (
    <div className="px-6 py-6">
      {/* Jamais max-height avec aspect-ratio : la hauteur se clamperait et
          les proportions mentiraient. On borne la largeur pour que la
          hauteur ne dépasse pas ~26rem, le ratio reste exact. */}
      {/* Passe B — la page raconte : voir (media-entree), mesurer (cotes
          retardées par .sequence-media), détailler (tableau en cascade).
          retrace-survol : les cotes se retracent au survol du média. */}
      <div
        className="sequence-media retrace-survol relative mx-auto w-full border border-line bg-surface"
        style={{
          aspectRatio: `${ratio}`,
          maxWidth: `min(100%, calc(26rem * ${ratio}))`,
        }}
      >
        {panneau.video !== null ? (
          <video
            className="media-entree absolute inset-0 h-full w-full object-cover"
            src={`/videos/${panneau.video}.mp4`}
            poster={`/videos/${panneau.video}-poster.jpg`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : photo !== null ? (
          <Photo
            cle={photo}
            alt={panneau.nom[locale]}
            sizes="(min-width: 1024px) 60rem, 100vw"
            priorite
            className="media-entree absolute inset-0"
            classNameImg="h-full w-full object-cover"
          />
        ) : (
          <p className="absolute inset-0 flex items-center justify-center font-mono text-display-m text-fg-soft">
            {formatDimensions(panneau.largeurM, panneau.hauteurM, locale)}
          </p>
        )}
        <Cote
          valeur={formatMetres(panneau.largeurM, locale)}
          position="top"
          className={panneau.video !== null || photo !== null ? 'cote-sur-media' : undefined}
        />
        <Cote
          valeur={formatMetres(panneau.hauteurM, locale)}
          position="right"
          className={panneau.video !== null || photo !== null ? 'cote-sur-media' : undefined}
        />
      </div>

      {/* Galerie : les photos restantes quand il y en a plusieurs. */}
      <GaleriePhotos panneau={panneau} locale={locale} />
    </div>
  )
}

/** Photos secondaires sous le média principal (la vidéo prime : toutes
    les photos passent alors en galerie). Rien si zéro ou une seule. */
function GaleriePhotos({ panneau, locale }: { panneau: Panneau; locale: Locale }) {
  const photos = panneau.video !== null ? panneau.images : panneau.images.slice(1)
  if (photos.length === 0) return null

  return (
    <div data-revele-groupe className="mx-auto mt-4 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3">
      {photos.map((cle, i) => (
        <Photo
          key={cle}
          cle={cle}
          alt={`${panneau.nom[locale]} — photo ${i + 1}`}
          sizes="(min-width: 640px) 33vw, 50vw"
          className="aspect-[3/2] overflow-hidden border border-line bg-surface"
          classNameImg="h-full w-full object-cover"
        />
      ))}
    </div>
  )
}

function LigneTechnique({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-line py-3">
      <dt className="data text-fg-soft">{label}</dt>
      <dd className="font-mono text-data">{valeur}</dd>
    </div>
  )
}

function FicheEmplacement({ panneau, locale }: { panneau: Panneau; locale: Locale }) {
  const maintenant = new Date()
  const dispo = disponibilite(panneau, maintenant)

  /* Proximité géographique impossible tant que coords est null : on ne la
     simule JAMAIS. « Dans la même zone » en attendant ; basculer sur la
     distance réelle quand les coords seront saisies (étape 6, consigne 2). */
  const memeZone = emplacements
    .filter((p) => p.zone === panneau.zone && p.slug !== panneau.slug)
    .slice(0, 3)

  const messageWhatsApp = `${media.fiche.whatsappIntro[locale]} ${panneau.nom[locale]} (${formatDimensions(panneau.largeurM, panneau.hauteurM, locale)}).`

  return (
    <main className="pb-28">
      <Container className="py-10">
        <RetourListe locale={locale} />

        <header className="mt-8">
          <p className="data text-accent">{panneau.zone}</p>
          <h1 className="expanded mt-3 max-w-4xl font-display text-display-m font-bold">
            {panneau.nom[locale]}
          </h1>
          <p className="mt-4 flex items-center gap-2 font-mono text-data">
            <span
              aria-hidden
              className={`h-2 w-2 shrink-0 ${dispo === 'libre' ? 'pastille-libre bg-libre' : 'bg-occupe'}`}
            />
            {dispo === 'libre'
              ? media.dispo.libre[locale]
              : /* La date est une information de vente, pas une gêne. */
                `${media.fiche.seLibere[locale]} ${formatDateCourte(panneau.libreLe as string, locale)}`}
          </p>
        </header>
      </Container>

      <BlocMedia panneau={panneau} locale={locale} />

      <Container>
        <div className="gap-12 lg:flex lg:items-start">
          <dl data-revele-groupe className="lg:flex-1">
            <LigneTechnique
              label={media.fiche.dimensions[locale]}
              valeur={formatDimensions(panneau.largeurM, panneau.hauteurM, locale)}
            />
            <LigneTechnique
              label={media.fiche.faces[locale]}
              valeur={media.facesLabels[panneau.faces][locale]}
            />
            {panneau.support !== null && (
              <LigneTechnique
                label={media.fiche.support[locale]}
                valeur={media.supportLabels[panneau.support][locale]}
              />
            )}
            {panneau.vuesJour !== null && (
              <LigneTechnique
                label={media.fiche.trafic[locale]}
                valeur={`${formatNombre(panneau.vuesJour, locale)} ${media.filtres.vuesJour[locale]} (${media.fiche.estimation[locale]})`}
              />
            )}
            <LigneTechnique label={media.fiche.zone[locale]} valeur={panneau.zone} />
            <LigneTechnique label={media.fiche.ville[locale]} valeur={panneau.ville} />
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-3 lg:mt-0 lg:w-72 lg:flex-col lg:items-stretch">
            <BoutonSelection slug={panneau.slug} locale={locale} />
            <WhatsAppCTA locale={locale} message={messageWhatsApp} />
            {panneau.mapsUrl !== null && (
              /* Masqué tant que mapsUrl est null (liens vérifiés un par un
                 avant saisie, jamais devinés). */
              <a
                href={panneau.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-fg-soft underline underline-offset-4 transition-colors hover:text-fg"
              >
                {media.fiche.maps[locale]}
              </a>
            )}
          </div>
        </div>

        {memeZone.length > 0 && (
          <section className="mt-16 border-t border-line pt-10">
            <h2 className="expanded font-display text-display-m font-bold">
              {media.fiche.memeZone[locale]}
            </h2>
            <div
              data-revele-groupe
              className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {memeZone.map((p) => (
                <CarteEmplacement key={p.slug} panneau={p} locale={locale} maintenant={maintenant} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  )
}

/** Fiche réseau : ni disponibilité, ni trafic, ni carte, ni sélection.
    Couverture, format, support et fonctionnement en réseau. */
function FicheReseau({ panneau, locale }: { panneau: Panneau; locale: Locale }) {
  const messageWhatsApp = `${media.reseauFiche.whatsappIntro[locale]} ${panneau.nom[locale].toLowerCase()}.`

  return (
    <main className="pb-28">
      <Container className="py-10">
        <RetourListe locale={locale} />

        <header className="mt-8">
          <p className="data text-accent">{panneau.zone}</p>
          <h1 className="expanded mt-3 font-display text-display-m font-bold">
            {panneau.nom[locale]}
          </h1>
        </header>
      </Container>

      <BlocMedia panneau={panneau} locale={locale} />

      <Container>
        <div className="gap-12 lg:flex lg:items-start">
          <div className="lg:flex-1">
            <dl>
              <LigneTechnique
                label={media.reseaux.format[locale]}
                valeur={formatDimensions(panneau.largeurM, panneau.hauteurM, locale)}
              />
              <LigneTechnique label={media.reseaux.couverture[locale]} valeur={panneau.zone} />
              {panneau.support !== null && (
                <LigneTechnique
                  label={media.reseaux.support[locale]}
                  valeur={media.supportLabels[panneau.support][locale]}
                />
              )}
              <LigneTechnique
                label={media.reseaux.faces[locale]}
                valeur={media.facesLabels[panneau.faces][locale]}
              />
            </dl>

            <h2 className="data mt-10 text-fg-soft">{media.reseauFiche.fonctionnement[locale]}</h2>
            <p className="mt-3 max-w-2xl text-fg-soft">{media.reseauFiche.explication[locale]}</p>
          </div>

          <div className="mt-8 lg:mt-0 lg:w-72">
            <WhatsAppCTA locale={locale} message={messageWhatsApp} />
          </div>
        </div>
      </Container>
    </main>
  )
}

export default function FichePanneau({ params }: { params: { locale: Locale; slug: string } }) {
  const panneau = panneaux.find((p) => p.slug === params.slug)
  if (!panneau) notFound()
  const { locale } = params

  return (
    <>
      <JsonLd
        data={jsonFilAriane([
          { nom: 'Numerika Media', chemin: `/${locale}/media` },
          { nom: media.meta.emplacements.titre[locale], chemin: `/${locale}/media/emplacements` },
          { nom: panneau.nom[locale], chemin: `/${locale}/media/emplacements/${panneau.slug}` },
        ])}
      />
      {panneau.categorie === 'reseau' ? (
        <FicheReseau panneau={panneau} locale={locale} />
      ) : (
        <FicheEmplacement panneau={panneau} locale={locale} />
      )}
    </>
  )
}
