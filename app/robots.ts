import type { MetadataRoute } from 'next'
import { BASE, estProduction } from '@/lib/seo'

/**
 * En production (NEXT_PUBLIC_SITE_ENV=production, posée à la bascule du
 * domaine) : tout autorisé, sitemap référencé. Hors production : Disallow
 * all, cohérent avec le noindex global (étape 12, point 0).
 */
export default function robots(): MetadataRoute.Robots {
  if (!estProduction) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE}/sitemap.xml`,
  }
}
