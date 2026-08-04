import { disponibilite, panneaux, type Panneau } from '@/content/panneaux'

/**
 * Logique d'inventaire de /media/emplacements (étape 4).
 * Le filtrage et le tri sont des fonctions pures exécutées côté serveur à
 * partir des searchParams : l'état des filtres vit dans l'URL, un lien
 * « panneaux libres avant décembre sur l'autoroute » doit être partageable
 * (exigence produit, consigne 3 de l'étape 4).
 */

export const emplacements = panneaux.filter((p) => p.categorie === 'emplacement')
export const reseaux = panneaux.filter((p) => p.categorie === 'reseau')

/** Zones dans l'ordre d'apparition de l'inventaire. */
export const zones = [...new Set(emplacements.map((p) => p.zone))]

export const facesPossibles = ['recto', 'recto-verso', 'triface'] as const

/** Paliers du filtre de trafic minimum, en vues/jour. */
export const paliersVues = [100_000, 125_000, 150_000, 175_000, 200_000] as const

export type FiltresInventaire = {
  zone: string | null
  faces: Panneau['faces'] | null
  vuesMin: number | null
  /** 'libre' = libres maintenant. null = tous. */
  dispo: 'libre' | null
  /** Date ISO : libres au plus tard à cette date. */
  libreAvant: string | null
}

export const filtresVides: FiltresInventaire = {
  zone: null,
  faces: null,
  vuesMin: null,
  dispo: null,
  libreAvant: null,
}

type SearchParams = Record<string, string | string[] | undefined>

function premier(valeur: string | string[] | undefined): string | undefined {
  return Array.isArray(valeur) ? valeur[0] : valeur
}

/** Toute valeur inconnue ou malformée est ignorée, jamais d'erreur. */
export function parseFiltres(searchParams: SearchParams): FiltresInventaire {
  const zone = premier(searchParams.zone)
  const faces = premier(searchParams.faces)
  const vuesMin = Number.parseInt(premier(searchParams.vuesMin) ?? '', 10)
  const dispo = premier(searchParams.dispo)
  const libreAvant = premier(searchParams.libreAvant)

  return {
    zone: zone && zones.includes(zone) ? zone : null,
    faces: facesPossibles.includes(faces as Panneau['faces']) ? (faces as Panneau['faces']) : null,
    vuesMin: Number.isFinite(vuesMin) && vuesMin > 0 ? vuesMin : null,
    dispo: dispo === 'libre' ? 'libre' : null,
    libreAvant:
      libreAvant && /^\d{4}-\d{2}-\d{2}$/.test(libreAvant) && !Number.isNaN(Date.parse(libreAvant))
        ? libreAvant
        : null,
  }
}

/**
 * Query string canonique d'un état de filtres, pour propager le contexte
 * de la liste vers les fiches et retour (étape 6, consigne 4).
 */
export function filtresEnQuery(f: FiltresInventaire): string {
  const params = new URLSearchParams()
  if (f.zone) params.set('zone', f.zone)
  if (f.faces) params.set('faces', f.faces)
  if (f.vuesMin) params.set('vuesMin', String(f.vuesMin))
  if (f.dispo) params.set('dispo', f.dispo)
  if (f.libreAvant) params.set('libreAvant', f.libreAvant)
  return params.toString()
}

export function filtresActifs(f: FiltresInventaire): boolean {
  return f.zone !== null || f.faces !== null || f.vuesMin !== null || f.dispo !== null || f.libreAvant !== null
}

export function appliquerFiltres(liste: Panneau[], f: FiltresInventaire, ref: Date): Panneau[] {
  return liste.filter(
    (p) =>
      (f.zone === null || p.zone === f.zone) &&
      (f.faces === null || p.faces === f.faces) &&
      (f.vuesMin === null || (p.vuesJour ?? 0) >= f.vuesMin) &&
      (f.dispo === null || disponibilite(p, ref) === 'libre') &&
      (f.libreAvant === null || p.libreLe === null || new Date(p.libreLe) <= new Date(f.libreAvant))
  )
}

/**
 * Tri par défaut (consigne 3) : disponibles d'abord, puis par date de
 * libération croissante, à trafic secondaire décroissant.
 */
export function trierEmplacements(liste: Panneau[], ref: Date): Panneau[] {
  return [...liste].sort((a, b) => {
    const occupeA = disponibilite(a, ref) === 'occupe' ? 1 : 0
    const occupeB = disponibilite(b, ref) === 'occupe' ? 1 : 0
    if (occupeA !== occupeB) return occupeA - occupeB
    if (occupeA === 1) {
      const dateA = Date.parse(a.libreLe ?? '')
      const dateB = Date.parse(b.libreLe ?? '')
      if (dateA !== dateB) return dateA - dateB
    }
    return (b.vuesJour ?? 0) - (a.vuesJour ?? 0)
  })
}
