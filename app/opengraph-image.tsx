import { ImageResponse } from 'next/og'

/**
 * Image OG statique par défaut (étape 12, point 5) : typographique sobre,
 * générée par code depuis les polices embarquées dans assets/fonts —
 * aucun asset externe. Utilisée par toutes les pages sans OG spécifique ;
 * les fiches panneau ont la leur (opengraph-image.tsx du segment [slug]).
 * Runtime edge + fetch(new URL(...)) : le runtime nodejs de @vercel/og
 * casse au build sous Windows (fileURLToPath sur import.meta), le pattern
 * edge est celui documenté par Next pour les polices locales.
 */
export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'NUMERIKA — Impression & communication visuelle, Dakar'

export default async function Image() {
  /* Fetch DANS la fonction, jamais au niveau module : à l'import, la
     route peut être évaluée hors de sa sandbox edge (rendu du 404) et le
     fetch des assets y échoue bruyamment (étape 13). */
  const archivoBlack = fetch(
    new URL('../assets/fonts/ArchivoBlack-Regular.ttf', import.meta.url)
  ).then((r) => r.arrayBuffer())
  const plexMono = fetch(new URL('../assets/fonts/IBMPlexMono-Regular.ttf', import.meta.url)).then(
    (r) => r.arrayBuffer()
  )
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#FBFAF7',
          color: '#111111',
        }}
      >
        <div style={{ fontFamily: 'Archivo Black', fontSize: 132, letterSpacing: '-0.02em' }}>
          NUMERIKA
        </div>
        <div
          style={{
            marginTop: 32,
            fontFamily: 'IBM Plex Mono',
            fontSize: 34,
            color: '#5A5A56',
          }}
        >
          Impression & communication visuelle, Dakar
        </div>
        <div
          style={{
            position: 'absolute',
            left: 80,
            right: 80,
            bottom: 70,
            height: 1,
            backgroundColor: '#DEDBD4',
          }}
        />
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
