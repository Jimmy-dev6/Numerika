import type { Locale } from './i18n'

/**
 * Formatage des données au rendu (brief étape 3, consigne 1) :
 * le stockage est numérique, la virgule décimale et le « × » sont une
 * affaire d'affichage. Unités SI toujours en minuscules.
 */

function localeBcp47(locale: Locale): string {
  return locale === 'fr' ? 'fr-FR' : 'en-GB'
}

/** « 8,80 × 4,50 m » en fr, « 8.80 × 4.50 m » en en. */
export function formatDimensions(largeurM: number, hauteurM: number, locale: Locale): string {
  const n = (v: number) =>
    v.toLocaleString(localeBcp47(locale), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  return `${n(largeurM)} × ${n(hauteurM)} m`
}

/** « 8,80 m » : une mesure seule, pour les cotes. */
export function formatMetres(valeur: number, locale: Locale): string {
  return `${valeur.toLocaleString(localeBcp47(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} m`
}

/** « 210 000 » en fr, « 210,000 » en en. */
export function formatNombre(valeur: number, locale: Locale): string {
  return valeur.toLocaleString(localeBcp47(locale))
}

/** « (+221) 33 842 84 42 » → « tel:+221338428442 ». */
export function telHref(affiche: string): string {
  return `tel:${affiche.replace(/[^\d+]/g, '')}`
}

/** « 19/01/2027 » : format court pour les échéances de disponibilité. */
export function formatDateCourte(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(localeBcp47(locale), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
