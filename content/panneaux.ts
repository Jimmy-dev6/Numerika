import type { CleImage, CleVideo } from './images.gen'
import type { Localized } from '../lib/i18n'

/**
 * Inventaire de la régie NUMERIKA MEDIA (brief §7.1, §7.3).
 * Données relevées sur le site actuel en août 2026, recopiées sans arrondi
 * ni reformulation. Les trafics (vuesJour) sont des estimations Numerika,
 * qualifiées comme telles.
 *
 * Import relatif (pas d'alias @/) : le fichier est aussi consommé par
 * scripts/verifier-panneaux.ts, exécuté directement par Node.
 *
 * Écarts assumés avec le type du §7.1, au nom de la règle « jamais de
 * valeur inventée » (§13) :
 *   — type est nullable : le tableau du brief ne dit pas quels emplacements
 *     sont rooftop ou unipole. Seul le triface est déductible (colonne
 *     Faces), et les réseaux portent leur format. // À CONFIRMER
 *   — support est nullable : renseigné pour les réseaux (papier dos bleu),
 *     non précisé pour les emplacements uniques. // À CONFIRMER
 */

export type Disponibilite = 'libre' | 'occupe'

export type TypePanneau =
  | 'rooftop'
  | 'unipole'
  | 'triface'
  | '4x3'
  | '3x2.25'
  | 'oriflamme'
  | 'sucette'

export type Panneau = {
  /** Figé : URL définitive de la fiche et cible des redirections /panneaux/* */
  slug: string
  nom: Localized
  zone: string
  ville: string
  categorie: 'emplacement' | 'reseau'
  /** null = rooftop ou unipole non renseigné au brief. À CONFIRMER. */
  type: TypePanneau | null
  /** Dimensions stockées en nombres ; la virgule décimale et le « × »
      sont une affaire de rendu, jamais de stockage. */
  largeurM: number
  hauteurM: number
  faces: 'recto' | 'recto-verso' | 'triface'
  /** null = non précisé pour les emplacements uniques. À CONFIRMER. */
  support: 'bache-tendue' | 'papier-dos-bleu' | null
  /** Estimation Numerika. null pour les réseaux. */
  vuesJour: number | null
  coords: { lat: number; lng: number } | null
  mapsUrl: string | null
  /** Clé de videosGen : vidéo drone H.264 muette dans public/videos. */
  video: CleVideo | null
  /** Clés du manifeste images.gen.ts, la première est la photo principale. */
  images: CleImage[]
  /** null = libre immédiatement. Sinon date ISO de fin de contrat en cours. */
  libreLe: string | null
}

/**
 * Disponibilité calculée, jamais écrite en dur (brief §7.2).
 * Un panneau dont le contrat expire passe seul en « libre » le jour venu.
 * Les pages qui la rendent doivent exporter `revalidate = 43200` (12 h)
 * pour que les statuts suivent — posé globalement dans app/[locale]/layout.tsx.
 */
export function disponibilite(p: Panneau, ref: Date = new Date()): Disponibilite {
  if (!p.libreLe) return 'libre'
  return new Date(p.libreLe) <= ref ? 'libre' : 'occupe'
}

/* Photos et vidéos saisies à l'étape 15 bis (passe A) depuis la table de
   correspondance du prompt maître — fichiers du site actuel vérifiés un
   par un, retraités par scripts/traiter-images.mjs. Les 3 emplacements
   Central Équipement restent sans photo (À CONFIRMER : à demander au
   client). mapsUrl et coords : toujours null, jamais devinés. */

export const panneaux: Panneau[] = [
  /* ——— Emplacements uniques (23), dans l'ordre du tableau §7.3 ——— */
  {
    slug: 'almadies-shell-sens-almadies',
    nom: {
      fr: 'Almadies, sens Ancien Aéroport vers Almadies (au-dessus station Shell)',
      en: 'Almadies, from Ancien Aéroport toward Almadies (above the Shell station)',
    },
    zone: 'Almadies',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 8.8,
    hauteurM: 4.5,
    faces: 'recto',
    support: null,
    vuesJour: 100_000,
    coords: null,
    mapsUrl: null,
    video: 'almadies-shell-sens-almadies',
    images: ['panneaux/almadies-shell-sens-almadies'],
    libreLe: null,
  },
  {
    slug: 'almadies-shell-sens-aeroport',
    nom: {
      fr: 'Almadies, sens Almadies vers Ancien Aéroport (au-dessus station Shell)',
      en: 'Almadies, from Almadies toward Ancien Aéroport (above the Shell station)',
    },
    zone: 'Almadies',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 8.05,
    hauteurM: 3.97,
    faces: 'recto',
    support: null,
    vuesJour: 105_000,
    coords: null,
    mapsUrl: null,
    video: 'almadies-shell-sens-aeroport',
    images: ['panneaux/almadies-shell-sens-aeroport'],
    libreLe: null,
  },
  {
    slug: 'entree-ville-abdou-diasse-sens-ville',
    nom: {
      fr: 'Entrée ville, face camp Abdou Diasse, sens Colobane vers entrée ville',
      en: 'City entrance, facing Camp Abdou Diasse, from Colobane toward the city entrance',
    },
    zone: 'Entrée ville',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 8.98,
    hauteurM: 7.98,
    faces: 'recto',
    support: null,
    vuesJour: 170_000,
    coords: null,
    mapsUrl: null,
    video: 'entree-ville-abdou-diasse-sens-ville',
    images: ['panneaux/entree-ville-abdou-diasse-sens-ville'],
    libreLe: null,
  },
  {
    slug: 'entree-ville-abdou-diasse-sens-colobane',
    nom: {
      fr: 'Entrée ville, face camp Abdou Diasse, sens sortie ville vers Colobane',
      en: 'City entrance, facing Camp Abdou Diasse, from the city exit toward Colobane',
    },
    zone: 'Entrée ville',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 7.98,
    hauteurM: 5.98,
    faces: 'recto',
    support: null,
    vuesJour: 160_000,
    coords: null,
    mapsUrl: null,
    video: 'entree-ville-abdou-diasse-sens-colobane',
    images: ['panneaux/entree-ville-abdou-diasse-sens-colobane'],
    libreLe: null,
  },
  {
    slug: 'autoroute-central-equipement-sens-dakar',
    nom: {
      fr: 'Autoroute, à côté Central Équipement, sens AIBD vers Dakar',
      en: 'Motorway, next to Central Équipement, from AIBD toward Dakar',
    },
    zone: 'Autoroute',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 17.0,
    hauteurM: 8.0,
    faces: 'recto',
    support: null,
    vuesJour: 175_000,
    coords: null,
    mapsUrl: null,
    video: 'autoroute-central-equipement-sens-dakar',
    images: [], // À CONFIRMER : photos à demander au client
    libreLe: null,
  },
  {
    slug: 'autoroute-central-equipement-face-rn1',
    nom: {
      fr: 'Autoroute, à côté Central Équipement, face RN1',
      en: 'Motorway, next to Central Équipement, facing the RN1',
    },
    zone: 'Autoroute',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 20.0,
    hauteurM: 8.0,
    faces: 'recto',
    support: null,
    vuesJour: 170_000,
    coords: null,
    mapsUrl: null,
    video: 'autoroute-central-equipement-face-rn1',
    images: [], // À CONFIRMER : photos à demander au client
    libreLe: null,
  },
  {
    slug: 'pikine-arene-nationale',
    nom: {
      fr: 'Pikine, à côté arène nationale',
      en: 'Pikine, next to the national wrestling arena',
    },
    zone: 'Pikine',
    ville: 'Pikine',
    categorie: 'emplacement',
    type: null,
    largeurM: 5.0,
    hauteurM: 7.0,
    faces: 'recto-verso',
    support: null,
    vuesJour: 190_000,
    coords: null,
    mapsUrl: null,
    video: 'pikine-arene-nationale',
    images: ['panneaux/pikine-arene-nationale', 'panneaux/pikine-arene-nationale-2'],
    libreLe: null,
  },
  {
    slug: 'aeroport-aibd',
    nom: {
      fr: 'Aéroport AIBD',
      en: 'AIBD Airport',
    },
    zone: 'AIBD',
    ville: 'AIBD',
    categorie: 'emplacement',
    type: null,
    largeurM: 4.0,
    hauteurM: 5.0,
    faces: 'recto-verso',
    support: null,
    vuesJour: 135_000,
    coords: null,
    mapsUrl: null,
    video: 'aeroport-aibd',
    images: ['panneaux/aeroport-aibd', 'panneaux/aeroport-aibd-2', 'panneaux/aeroport-aibd-3'],
    libreLe: null,
  },
  {
    slug: 'route-rufisque-cotoa',
    nom: {
      fr: 'Route de Rufisque, face COTOA',
      en: 'Route de Rufisque, facing COTOA',
    },
    zone: 'Route de Rufisque',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 4.0,
    hauteurM: 5.0,
    faces: 'recto-verso',
    support: null,
    vuesJour: 125_000,
    coords: null,
    mapsUrl: null,
    video: 'route-rufisque-cotoa',
    images: ['panneaux/route-rufisque-cotoa', 'panneaux/route-rufisque-cotoa-2', 'panneaux/route-rufisque-cotoa-3'],
    libreLe: null,
  },
  {
    slug: 'corniche-ouest-sens-soumbedioune',
    nom: {
      fr: 'Corniche Ouest, sens Plateau vers Soumbédioune',
      en: 'Corniche Ouest, from Plateau toward Soumbédioune',
    },
    zone: 'Corniche Ouest',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 9.6,
    hauteurM: 4.8,
    faces: 'recto',
    support: null,
    vuesJour: 110_000,
    coords: null,
    mapsUrl: null,
    video: null,
    images: ['panneaux/corniche-ouest-sens-soumbedioune'],
    libreLe: '2026-07-31',
  },
  {
    slug: 'soumbedioune-sortie-tunnel',
    nom: {
      fr: 'Soumbédioune, Corniche Ouest, sortie tunnel',
      en: 'Soumbédioune, Corniche Ouest, tunnel exit',
    },
    zone: 'Corniche Ouest',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 8.8,
    hauteurM: 2.88,
    faces: 'recto',
    support: null,
    vuesJour: 95_000,
    coords: null,
    mapsUrl: null,
    video: null,
    images: ['panneaux/soumbedioune-sortie-tunnel'],
    libreLe: '2026-10-31',
  },
  {
    slug: 'plateau-mairie',
    nom: {
      fr: 'Plateau, face mairie de Dakar',
      en: 'Plateau, facing Dakar City Hall',
    },
    zone: 'Plateau',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 4.0,
    hauteurM: 5.0,
    faces: 'recto-verso',
    support: null,
    vuesJour: 120_000,
    coords: null,
    mapsUrl: null,
    video: null,
    images: ['panneaux/plateau-mairie', 'panneaux/plateau-mairie-2'],
    libreLe: '2026-12-31',
  },
  {
    slug: 'colobane',
    nom: {
      fr: 'Colobane',
      en: 'Colobane',
    },
    zone: 'Colobane',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 14.64,
    hauteurM: 6.0,
    faces: 'recto',
    support: null,
    vuesJour: 160_000,
    coords: null,
    mapsUrl: null,
    video: null,
    images: ['panneaux/colobane'],
    libreLe: '2026-12-31',
  },
  {
    slug: 'peage-sedima-sens-aibd',
    nom: {
      fr: 'Autoroute à péage Eiffage, sens Dakar vers AIBD (croisement Sedima)',
      en: 'Eiffage toll motorway, from Dakar toward AIBD (Sedima junction)',
    },
    zone: 'Almadies 2',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 14.0,
    hauteurM: 6.0,
    faces: 'recto',
    support: null,
    vuesJour: 185_000,
    coords: null,
    mapsUrl: null,
    video: 'peage-sedima-sens-aibd',
    images: ['panneaux/peage-sedima-sens-aibd'],
    libreLe: '2026-12-31',
  },
  {
    slug: 'peage-sedima-sens-dakar',
    nom: {
      fr: 'Autoroute à péage Eiffage, sens AIBD vers Dakar (croisement Sedima)',
      en: 'Eiffage toll motorway, from AIBD toward Dakar (Sedima junction)',
    },
    zone: 'Almadies 2',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 8.4,
    hauteurM: 6.0,
    faces: 'recto',
    support: null,
    vuesJour: 180_000,
    coords: null,
    mapsUrl: null,
    video: 'peage-sedima-sens-dakar',
    images: ['panneaux/peage-sedima-sens-dakar'],
    libreLe: '2026-12-31',
  },
  {
    slug: 'mariste-sens-dakar',
    nom: {
      fr: 'Autoroute Mariste, sens EMG vers Dakar',
      en: 'Mariste motorway, from EMG toward Dakar',
    },
    zone: 'Autoroute Mariste',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 13.0,
    hauteurM: 6.0,
    faces: 'recto',
    support: null,
    vuesJour: 145_000,
    coords: null,
    mapsUrl: null,
    video: null,
    images: ['panneaux/mariste-sens-dakar'],
    libreLe: '2026-12-31',
  },
  {
    slug: 'mariste-sens-emg',
    nom: {
      fr: 'Autoroute Mariste, sens Dakar vers EMG',
      en: 'Mariste motorway, from Dakar toward EMG',
    },
    zone: 'Autoroute Mariste',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 8.4,
    hauteurM: 6.0,
    faces: 'recto',
    support: null,
    vuesJour: 140_000,
    coords: null,
    mapsUrl: null,
    video: null,
    images: ['panneaux/mariste-sens-emg'],
    libreLe: '2027-01-19',
  },
  {
    slug: 'ouest-foire-echangeur',
    nom: {
      fr: 'Ouest Foire, échangeur foire',
      en: 'Ouest Foire, foire interchange',
    },
    zone: 'Ouest Foire',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: 'triface',
    largeurM: 12.0,
    hauteurM: 4.0,
    faces: 'triface',
    support: null,
    vuesJour: 145_000,
    coords: null,
    mapsUrl: null,
    video: null,
    images: ['panneaux/ouest-foire-echangeur', 'panneaux/ouest-foire-echangeur-2', 'panneaux/ouest-foire-echangeur-3'],
    libreLe: '2027-01-31',
  },
  {
    slug: 'plateau-place-independance',
    nom: {
      fr: "Plateau, Place de l'Indépendance",
      en: "Plateau, Place de l'Indépendance",
    },
    zone: 'Plateau',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 4.0,
    hauteurM: 4.0,
    faces: 'recto',
    support: null,
    vuesJour: 130_000,
    coords: null,
    mapsUrl: null,
    video: null,
    images: ['panneaux/plateau-place-independance'],
    libreLe: '2027-03-31',
  },
  {
    slug: 'peage-thiaroye-sens-dakar',
    nom: {
      fr: 'Autoroute, sortie péage Poste Thiaroye, sens AIBD vers Dakar',
      en: 'Motorway, Poste Thiaroye toll exit, from AIBD toward Dakar',
    },
    zone: 'Autoroute à péage',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 12.0,
    hauteurM: 6.0,
    faces: 'recto',
    support: null,
    vuesJour: 155_000,
    coords: null,
    mapsUrl: null,
    video: null,
    images: ['panneaux/peage-thiaroye-sens-dakar'],
    libreLe: '2027-04-06',
  },
  {
    slug: 'peage-thiaroye-sens-aibd',
    nom: {
      fr: 'Autoroute, sortie péage Poste Thiaroye, sens Dakar vers AIBD',
      en: 'Motorway, Poste Thiaroye toll exit, from Dakar toward AIBD',
    },
    zone: 'Autoroute à péage',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 10.0,
    hauteurM: 6.0,
    faces: 'recto',
    support: null,
    vuesJour: 150_000,
    coords: null,
    mapsUrl: null,
    video: null,
    images: ['panneaux/peage-thiaroye-sens-aibd'],
    libreLe: '2027-04-06',
  },
  {
    slug: 'autoroute-central-equipement-sens-aibd',
    nom: {
      fr: 'Autoroute, à côté Central Équipement, sens Dakar vers AIBD',
      en: 'Motorway, next to Central Équipement, from Dakar toward AIBD',
    },
    zone: 'Autoroute',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 14.98,
    hauteurM: 7.93,
    faces: 'recto',
    support: null,
    vuesJour: 210_000,
    coords: null,
    mapsUrl: null,
    video: null,
    images: [], // À CONFIRMER : photos à demander au client
    libreLe: '2027-05-31',
  },
  {
    slug: 'plateau-entree-ville',
    nom: {
      fr: 'Plateau, entrée ville de Dakar',
      en: 'Plateau, Dakar city entrance',
    },
    zone: 'Plateau',
    ville: 'Dakar',
    categorie: 'emplacement',
    type: null,
    largeurM: 10.0,
    hauteurM: 4.0,
    faces: 'recto',
    support: null,
    vuesJour: 120_000,
    coords: null,
    mapsUrl: null,
    video: null,
    images: ['panneaux/plateau-entree-ville'],
    libreLe: '2027-06-30',
  },

  /* ——— Réseaux (4) : couverture portée par zone, jamais sur la carte ——— */
  {
    slug: 'reseau-4x3',
    nom: {
      fr: 'Réseau 4x3',
      en: '4x3 network',
    },
    zone: 'Dakar et régions',
    ville: 'Dakar',
    categorie: 'reseau',
    type: '4x3',
    largeurM: 4.0,
    hauteurM: 3.0,
    faces: 'recto-verso',
    support: 'papier-dos-bleu',
    vuesJour: null,
    coords: null,
    mapsUrl: null,
    video: null,
    images: [],
    libreLe: null,
  },
  {
    slug: 'reseau-3x2-25',
    nom: {
      fr: 'Réseau 3x2,25',
      en: '3x2.25 network',
    },
    zone: 'Dakar et régions',
    ville: 'Dakar',
    categorie: 'reseau',
    type: '3x2.25',
    largeurM: 3.0,
    hauteurM: 2.25,
    faces: 'recto-verso',
    support: 'papier-dos-bleu',
    vuesJour: null,
    coords: null,
    mapsUrl: null,
    video: null,
    images: [],
    libreLe: null,
  },
  {
    slug: 'reseau-oriflamme',
    nom: {
      fr: 'Réseau oriflamme',
      en: 'Oriflamme network',
    },
    zone: 'Dakar et régions',
    ville: 'Dakar',
    categorie: 'reseau',
    type: 'oriflamme',
    largeurM: 1.0,
    hauteurM: 1.5,
    faces: 'recto-verso',
    support: 'papier-dos-bleu',
    vuesJour: null,
    coords: null,
    mapsUrl: null,
    video: null,
    images: [],
    libreLe: null,
  },
  {
    slug: 'reseau-sucette',
    nom: {
      fr: 'Réseau sucette',
      en: 'Sucette (city light) network',
    },
    zone: 'Dakar',
    ville: 'Dakar',
    categorie: 'reseau',
    type: 'sucette',
    largeurM: 1.5,
    hauteurM: 2.0,
    faces: 'recto-verso',
    support: 'papier-dos-bleu',
    vuesJour: null,
    coords: null,
    mapsUrl: null,
    video: null,
    images: [],
    libreLe: null,
  },
]
