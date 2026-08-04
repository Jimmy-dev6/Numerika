import type { Locale } from './i18n'

/** Domaine final. metadataBase et toutes les URLs absolues en dérivent. */
export const BASE = 'https://numerikadakar.com'

/**
 * Indexation pilotée par l'environnement (étape 12, point 0) :
 * NEXT_PUBLIC_SITE_ENV=production est posée sur Vercel au moment de la
 * bascule du domaine final, jamais en préversion. Par défaut : noindex,
 * robots Disallow all, sitemap vide. Le site reste non indexable tant
 * que le domaine n'est pas branché.
 */
export const estProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'production'

/**
 * hreflang fr / en / x-default (→ fr) + canonical, en URLs absolues
 * (brief §8). `chemin` est le chemin sans préfixe de langue,
 * ex. '' ou '/media/emplacements/colobane'.
 */
export function seoAlternates(locale: Locale, chemin: string) {
  return {
    canonical: `${BASE}/${locale}${chemin}`,
    languages: {
      fr: `${BASE}/fr${chemin}`,
      en: `${BASE}/en${chemin}`,
      'x-default': `${BASE}/fr${chemin}`,
    },
  }
}

/** og:locale correct selon la langue — la correction du défaut historique
    du site actuel (og:locale en_US sur un site francophone). */
export function ogLocale(locale: Locale): string {
  return locale === 'fr' ? 'fr_SN' : 'en_US'
}
