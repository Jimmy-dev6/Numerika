import type { MetadataRoute } from 'next'
import { metiers } from '@/content/metiers'
import { panneaux } from '@/content/panneaux'
import { realisations } from '@/content/realisations'
import { locales } from '@/lib/i18n'
import { BASE, estProduction } from '@/lib/seo'

/**
 * Sitemap (brief §8, étape 12) : toutes les routes des deux langues, dont
 * les 54 fiches panneau (27 slugs × 2) et les 8 pôles ; les études de cas
 * publiable uniquement ; jamais /dev/* ni les pages provisoires.
 * Choix documenté (étape 12, point 0) : hors production, le sitemap est
 * servi VIDE — même mécanique que le noindex et robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!estProduction) return []

  const chemins = [
    '',
    '/metiers',
    ...metiers.map((m) => `/metiers/${m.slug}`),
    '/realisations',
    ...realisations.filter((r) => r.publiable).map((r) => `/realisations/${r.slug}`),
    '/entreprise',
    '/devis',
    '/contact',
    '/media',
    '/media/emplacements',
    ...panneaux.map((p) => `/media/emplacements/${p.slug}`),
  ]

  const dateBuild = new Date()

  return chemins.flatMap((chemin) =>
    locales.map((locale) => ({
      url: `${BASE}/${locale}${chemin}`,
      lastModified: dateBuild,
    }))
  )
}
