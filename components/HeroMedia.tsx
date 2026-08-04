import Image from 'next/image'
import { Container } from '@/components/Container'
import { Cote } from '@/components/Cote'

/**
 * Hero de l'accueil (brief §6.1, étape 7).
 * Structure prête pour la vidéo 4K et le repli photo (assets n°1 et 2,
 * À CONFIRMER) : source vidéo → plein écran muet en boucle avec poster ;
 * source image → photo d'atelier plein cadre ; null → hero typographique,
 * l'énoncé seul en Archivo Expanded, coté. Jamais de carrousel.
 */
export type HeroMediaSource =
  | { type: 'video'; src: string; poster: string }
  | { type: 'image'; src: string; alt: string }
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
  if (source === null) {
    return (
      <section className="py-24 md:py-36">
        <Container>
          <div className="relative inline-block pb-8 pr-2">
            <h1 className="expanded whitespace-pre-line font-display text-display-xl font-bold">
              {titre}
            </h1>
            <Cote valeur={coteValeur} position="bottom" />
          </div>
          <p className="mt-8 max-w-2xl text-fg-soft">{sousTitre}</p>
        </Container>
      </section>
    )
  }

  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden">
      {source.type === 'video' ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={source.src}
          poster={source.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <Image
          src={source.src}
          alt={source.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" aria-hidden />
      <Container className="relative pb-16 pt-40">
        <div className="relative inline-block pb-8 pr-2 text-white">
          <h1 className="expanded whitespace-pre-line font-display text-display-xl font-bold">
            {titre}
          </h1>
          <Cote valeur={coteValeur} position="bottom" className="text-white" />
        </div>
        <p className="mt-6 max-w-2xl text-white/85">{sousTitre}</p>
      </Container>
    </section>
  )
}
