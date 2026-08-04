export const locales = ['fr', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'fr'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/** Texte bilingue. Tout contenu éditable utilise cette forme. */
export type Localized = { fr: string; en: string }
