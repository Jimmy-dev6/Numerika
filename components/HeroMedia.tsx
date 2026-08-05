import { Container } from '@/components/Container'
import { Cote } from '@/components/Cote'
import { Diaporama } from '@/components/Diaporama'
import { Photo } from '@/components/Photo'
import type { CleImage, CleVideo } from '@/content/images.gen'

/**
 * Hero de l'accueil (brief §6.1, étape 7 ; diaporama à l'étape 15 bis).
 * — diaporama : 4 images fortes en fondu enchaîné de 6 s, Ken Burns
 *   discret (CSS pur, gaté html.js + reduced-motion — voir globals.css),
 *   priority sur la PREMIÈRE seule, voile sombre pour le contraste AA du
 *   titre et de la cote. Sans JS : première image seule, tout est lisible.
 * — video : plein écran muet en boucle avec poster.
 * — image : photo plein cadre.
 * — null : hero typographique, l'énoncé seul en Archivo Expanded, coté.
 * Jamais de carrousel manuel.
 */
export type HeroMediaSource =
  | { type: 'diaporama'; images: Array<{ cle: CleImage; alt: string }> }
  | { type: 'video'; cle: CleVideo; posterCle: CleImage }
  | { type: 'image'; cle: CleImage; alt: string }
  | null

export function HeroMedia({
  source,
  titre,
  sousTitre,
  coteValeur,
}: {
  source: HeroMediaSource
  titre: string
  sousTitre: string
  /** Donnée vraie uniquement : « depuis 2008 » tant que la largeur
      d'impression maximale des machines n'est pas confirmée. */
  coteValeur: string
}) {
  /* Séquence d'ouverture (passe B) : les lignes du titre montent à
     150 ms d'écart, la cote se trace ensuite (.sequence-hero retarde
     ses transitions). Texte de titre, pas de texte courant — B4 ok. */
  const lignes = titre.split('\n')
  const titreAnime = (
    <h1 className="expanded font-display text-display-xl font-bold">
      {lignes.map((ligne, i) => (
        <span key={ligne} className="hero-ligne block" style={{ '--i': i } as React.CSSProperties}>
          {ligne}
        </span>
      ))}
    </h1>
  )

  if (source === null) {
    return (
      <section className="py-24 md:py-36">
        <Container>
          <div className="sequence-hero relative inline-block pb-8 pr-2">
            {titreAnime}
            <Cote valeur={coteValeur} position="bottom" />
          </div>
          <p className="mt-8 max-w-2xl text-fg-soft">{sousTitre}</p>
        </Container>
      </section>
    )
  }

  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-[#0b0f14]">
      {source.type === 'diaporama' && <Diaporama images={source.images} />}
      {source.type === 'video' && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={`/videos/${source.cle}.mp4`}
          poster={`/videos/${source.cle}-poster.jpg`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}
      {source.type === 'image' && (
        <Photo
          cle={source.cle}
          alt={source.alt}
          sizes="100vw"
          priorite
          className="absolute inset-0"
          classNameImg="h-full w-full object-cover"
        />
      )}

      {/* Voile : seul dégradé autorisé (noir vers transparent), garantit
          le contraste AA du titre blanc quel que soit le cliché. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15" aria-hidden />
      <Container className="relative pb-16 pt-40">
        <div className="sequence-hero relative inline-block pb-8 pr-2 text-white">
          {titreAnime}
          <Cote valeur={coteValeur} position="bottom" className="text-white" />
        </div>
        <p className="mt-6 max-w-2xl text-white/85">{sousTitre}</p>
      </Container>
    </section>
  )
}
