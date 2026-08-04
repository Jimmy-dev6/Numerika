import { ImageResponse } from 'next/og'

/** Favicon générée par code (étape 14) : la 404 de /favicon.ico était la
    seule erreur console relevée par Lighthouse. */
export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111111',
          color: '#FBFAF7',
          fontSize: 22,
          fontWeight: 700,
          fontFamily: 'sans-serif',
        }}
      >
        N
      </div>
    ),
    size
  )
}
