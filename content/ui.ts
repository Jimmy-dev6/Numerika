import type { Localized } from '@/lib/i18n'

/**
 * Micro-libellés d'interface (aria, intitulés génériques).
 * Comme tout texte : jamais en dur dans les composants.
 */
export const ui = {
  navPrincipale: { fr: 'Navigation principale', en: 'Main navigation' },
  changerLangue: { fr: 'Switch to English', en: 'Passer en français' },
  ouvrirWhatsApp: { fr: 'Écrire sur WhatsApp', en: 'Chat on WhatsApp' },
  introuvable: { fr: 'Cette page n’existe pas.', en: 'This page does not exist.' },
  retourAccueil: { fr: 'Retour à l’accueil', en: 'Back to the home page' },
  voirInventaire: {
    fr: 'Voir les emplacements d’affichage',
    en: 'See the billboard locations',
  },
  erreur: { fr: 'Une erreur est survenue.', en: 'Something went wrong.' },
  reessayer: { fr: 'Réessayer', en: 'Try again' },
} satisfies Record<string, Localized>
