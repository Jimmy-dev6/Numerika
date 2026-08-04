import { site } from '@/content/site'
import { ui } from '@/content/ui'
import { cn } from '@/lib/cn'
import type { Locale } from '@/lib/i18n'

/**
 * Bouton WhatsApp contextuel (brief §6.6). Jamais de bulle flottante :
 * il se place dans le flux, là où le contexte le justifie. Le message
 * pré-rempli reprend le contexte de la page appelante (sur une fiche
 * panneau, il nomme l'emplacement).
 * Source unique du numéro : site.whatsappNumber. Tant qu'il est null
 * (À CONFIRMER), le composant ne rend rien.
 */
export function WhatsAppCTA({
  message,
  locale,
  label,
  className,
}: {
  /** Message pré-rempli, contextuel à la page d'où part le visiteur. */
  message: string
  locale: Locale
  /** Intitulé du bouton ; par défaut le libellé générique de ui.ts. */
  label?: string
  className?: string
}) {
  if (!site.whatsappNumber) return null

  const href = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 rounded-btn border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-fg',
        className
      )}
    >
      {label ?? ui.ouvrirWhatsApp[locale]}
    </a>
  )
}
