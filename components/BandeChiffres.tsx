import { Container } from '@/components/Container'
import { accueil } from '@/content/accueil'
import { site } from '@/content/site'
import type { Locale } from '@/lib/i18n'

/**
 * Bande de chiffres (brief §6.1) : trois données vérifiées, en mono, sans
 * habillage. Source partagée entre l'accueil et /entreprise (étape 10).
 * Le quatrième chiffre attend une donnée client — À CONFIRMER, non rendu
 * (voir content/accueil.ts).
 */
export function BandeChiffres({ locale }: { locale: Locale }) {
  return (
    <Container className="grid grid-cols-1 gap-8 py-14 sm:grid-cols-3">
      <div>
        <p className="font-mono text-display-m">{site.fondee}</p>
        <p className="mt-1 text-sm text-fg-soft">{accueil.chiffres.fondation[locale]}</p>
      </div>
      <div>
        <p className="font-mono text-display-m">{site.collaborateurs}</p>
        <p className="mt-1 text-sm text-fg-soft">{accueil.chiffres.collaborateurs[locale]}</p>
      </div>
      <div>
        <p className="font-mono text-display-m">{site.emplacements}</p>
        <p className="mt-1 text-sm text-fg-soft">{accueil.chiffres.emplacements[locale]}</p>
      </div>
    </Container>
  )
}
