import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, locales } from './lib/i18n'

/**
 * Routage bilingue (brief §5) : /fr par défaut, redirection de la racine
 * et de tout chemin sans préfixe de langue vers /fr/...
 *
 * IMPORTANT (amendement étape 1) : les redirections 301 héritées du site
 * WordPress (étape 13, brief §8) doivent vivre dans next.config.mjs, qui
 * s'exécute AVANT ce middleware — jamais ici. Sinon /impression-digital.php
 * deviendrait /fr/impression-digital.php puis 404, avec chaînes de
 * redirection et conflits à la clé.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  /* skipTrailingSlashRedirect est actif (étape 13) : la normalisation du
     slash final vit ici, FUSIONNÉE avec le préfixe de langue — une seule
     redirection par requête, jamais de chaîne. */
  const sansSlash = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

  const hasLocale = locales.some(
    (locale) => sansSlash === `/${locale}` || sansSlash.startsWith(`/${locale}/`)
  )
  if (hasLocale && sansSlash === pathname) return

  const chemin = hasLocale
    ? sansSlash
    : sansSlash === '/'
      ? `/${defaultLocale}`
      : `/${defaultLocale}${sansSlash}`

  /* URL standard, jamais nextUrl.clone() : NextURL mémorise le slash final
     de la requête entrante et le ré-appliquerait à la sérialisation —
     boucle infinie sur /fr/metiers/ (constaté étape 13). */
  const cible = new URL(`${chemin}${request.nextUrl.search}`, request.url)
  return NextResponse.redirect(cible, 308)
}

export const config = {
  // Tout sauf les assets Next, les fichiers statiques, les API routes et
  // les routes de métadonnées sans extension (étape 12 : /opengraph-image
  // n'a pas de point, sans cette exclusion le middleware le redirigerait
  // vers /fr/opengraph-image → 404).
  matcher: ['/((?!_next|api|opengraph-image|icon|apple-icon|.*\\..*).*)'],
}
