import type { Metadata } from 'next'
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/JsonLd'
import { site } from '@/content/site'
import { isLocale, locales } from '@/lib/i18n'
import { jsonOrganisation } from '@/lib/jsonld'
import { BASE, estProduction, ogLocale } from '@/lib/seo'
import '../globals.css'

/* Typographie (brief §4.4).
   Arbitrage étape 14 : display 'optional' sur Archivo — next/font n'émet
   pas de preload sous un segment dynamique sans layout racine (limitation
   Next 14), et le swap de la display sur les héros produisait un CLS de
   0.16. En optional : zéro décalage ; sur une toute première visite très
   lente, le titre peut rester en repli système ajusté, la police est en
   cache dès la navigation suivante. */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'optional',
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-plex-mono',
  display: 'swap',
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/**
 * Revalidation au moins deux fois par jour (brief §7.2) : la disponibilité
 * des panneaux est calculée depuis libreLe au rendu, un contrat qui expire
 * doit passer seul en « libre » sans intervention. Posé ici, il s'applique
 * à toutes les pages du site.
 */
export const revalidate = 43200 // 12 heures

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : 'fr'

  return {
    metadataBase: new URL(BASE),
    title: {
      default: site.meta.titre[locale],
      template: '%s — NUMERIKA',
    },
    description: site.hero.sousTitre[locale],
    openGraph: {
      siteName: site.nom,
      type: 'website',
      locale: ogLocale(locale),
    },
    /* Indexation pilotée par l'environnement (étape 12, point 0) :
       autorisée uniquement si NEXT_PUBLIC_SITE_ENV === 'production',
       variable posée sur Vercel à la bascule du domaine final, jamais en
       préversion. Par défaut : noindex. Même mécanique dans robots.ts et
       sitemap.ts (lib/seo.ts). */
    robots: estProduction ? undefined : { index: false, follow: false },
  }
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale

  return (
    // suppressHydrationWarning : la classe « js » est posée sur <html> avant
    // l'hydratation, React ne doit pas s'en alarmer.
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${archivo.variable} ${instrumentSans.variable} ${plexMono.variable} flex min-h-screen flex-col font-sans text-body antialiased`}
      >
        {/* Exécuté avant toute peinture du contenu : les états masqués et
            l'animation de <Cote> ne s'appliquent que sous html.js. Sans
            JavaScript, les cotes sont visibles d'emblée (amendement étape 2).
            Premier enfant du body car l'App Router ne donne pas la main sur
            le <head> ; l'exécution synchrone ici précède le rendu de tout
            contenu — même garantie, zéro flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {/* Organization + LocalBusiness fusionnés, toutes pages (étape 12). */}
        <JsonLd data={jsonOrganisation()} />
        {/* En-tête et pied de page vivent dans les layouts de régime :
            (jour) pour le mode Production, media pour le mode nuit, afin
            que la bascule couvre tout le viewport (brief §4.2). */}
        {children}
      </body>
    </html>
  )
}
