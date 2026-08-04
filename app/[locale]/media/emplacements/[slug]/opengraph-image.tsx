import { ImageResponse } from 'next/og'
import { panneaux } from '@/content/panneaux'
import { formatDimensions, formatNombre } from '@/lib/format'
import type { Locale } from '@/lib/i18n'

/**
 * Image OG dynamique des fiches panneau (brief §8, étape 12) :
 * nom, dimensions, trafic sur fond nuit — la maquette suit la DA
 * (Archivo pour le nom, Plex Mono pour les données, jaune signal).
 * Runtime edge : même raison que app/opengraph-image.tsx.
 */
export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { locale: Locale; slug: string } }) {
  /* Fetch DANS la fonction, jamais au niveau module (cf. app/opengraph-image.tsx). */
  const archivoBlack = fetch(
    new URL('../../../../../assets/fonts/ArchivoBlack-Regular.ttf', import.meta.url)
  ).then((r) => r.arrayBuffer())
  const plexMono = fetch(
    new URL('../../../../../assets/fonts/IBMPlexMono-Regular.ttf', import.meta.url)
  ).then((r) => r.arrayBuffer())

  const panneau = panneaux.find((p) => p.slug === params.slug)
  const { locale } = params

  /* Réduction du corps par paliers sur les noms longs (validation étape
     12) : le texte se replie sur plusieurs lignes, jamais de coupe. */
  const nomAffiche = panneau?.nom[locale] ?? 'Numerika Media'
  const corpsNom = nomAffiche.length > 64 ? 40 : nomAffiche.length > 48 ? 46 : 58

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '70px 80px',
          backgroundColor: '#0B0F14',
          color: '#FFFFFF',
        }}
      >
        <div
          style={{
            fontFamily: 'IBM Plex Mono',
            fontSize: 30,
            color: '#FFC400',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {/* Toujours UNE expression par div : satori exige display:flex
              explicite dès qu'un nœud a plusieurs enfants. */}
          {panneau ? `Numerika Media — ${panneau.zone}` : 'Numerika Media'}
        </div>

        <div
          style={{
            fontFamily: 'Archivo Black',
            fontSize: corpsNom,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
        >
          {nomAffiche}
        </div>

        <div style={{ display: 'flex', gap: 60, alignItems: 'flex-end' }}>
          {panneau && (
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 44, color: '#FFC400' }}>
              {formatDimensions(panneau.largeurM, panneau.hauteurM, locale)}
            </div>
          )}
          {panneau?.vuesJour != null && (
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 30, color: '#98A1AD' }}>
              {`${formatNombre(panneau.vuesJour, locale)} ${locale === 'fr' ? 'vues/jour' : 'views/day'}`}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Archivo Black', data: await archivoBlack, style: 'normal', weight: 400 },
        { name: 'IBM Plex Mono', data: await plexMono, style: 'normal', weight: 400 },
      ],
    }
  )
}
