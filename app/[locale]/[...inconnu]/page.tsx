import { notFound } from 'next/navigation'

/**
 * Attrape-tout (étape 14) : tout chemin inconnu sous /fr ou /en aboutit
 * à la 404 localisée de [locale]/not-found.tsx. Les routes explicites
 * gagnent toujours sur ce catch-all.
 */
export default function Inconnu(): never {
  notFound()
}
