import type { Localized } from '@/lib/i18n'

/**
 * Portfolio (brief §6.5, étapes 8-9).
 * Le champ `publiable` gouverne le rendu partout (grille, fiches pôle,
 * accueil, études de cas) : rien ne se montre nulle part sans validation
 * client. Les trois fiches restent publiable: false tant que les
 * autorisations ne sont pas confirmées (asset n°7) et que les projets ne
 * sont pas documentés (asset n°12).
 */
export type Realisation = {
  slug: string
  nom: Localized
  client: string
  /** Slug du pôle métier (content/metiers.ts). */
  pole: string
  /** Étiquettes techniques, affichées en .data. */
  techniques: Localized[]
  /** Nourrissent une <Cote>. null si non connues — jamais inventées. */
  dimensions: { largeurM: number; hauteurM: number } | null
  annee: number | null
  /** 2-3 phrases factuelles. null tant que le projet n'est pas documenté. */
  resume: Localized | null
  /** Vide tant que les photos ne sont pas récupérées en résolution d'origine. */
  images: string[]
  /** Gouverne le rendu : rien ne se publie sans validation client. */
  publiable: boolean
}

export const realisations: Realisation[] = [
  {
    slug: 'trophee-semi-marathon-somone',
    nom: { fr: 'Trophée du Semi-Marathon de la Somone', en: 'Somone Half-Marathon trophy' },
    client: 'Semi-Marathon de la Somone',
    pole: 'objets',
    techniques: [
      { fr: 'Acrylique découpé laser', en: 'Laser-cut acrylic' },
      { fr: 'Socle bois', en: 'Wooden base' },
      { fr: 'Laiton gravé', en: 'Engraved brass' },
    ],
    dimensions: null,
    annee: null,
    resume: null,
    images: [],
    publiable: false,
  },
  {
    slug: 'trophees-maggi',
    nom: { fr: 'Trophées Maggi', en: 'Maggi trophies' },
    client: 'Maggi',
    pole: 'objets',
    techniques: [
      { fr: 'Verre gravé or', en: 'Gold-engraved glass' },
      { fr: 'Coffrets', en: 'Gift boxes' },
      { fr: 'Production en série', en: 'Series production' },
    ],
    dimensions: null,
    annee: null,
    resume: null,
    images: [],
    publiable: false,
  },
  {
    /* À CONFIRMER : enseigne choisie dans la liste de références du §2 ;
       la réalisation exacte reste à documenter avant publication. */
    slug: 'enseigne-terrou-bi',
    nom: { fr: 'Enseigne Terrou-Bi', en: 'Terrou-Bi sign' },
    client: 'Terrou-Bi',
    pole: 'signaletique',
    techniques: [{ fr: 'Enseigne extérieure', en: 'Exterior sign' }],
    dimensions: null,
    annee: null,
    resume: null,
    images: [],
    publiable: false,
  },
]

/** Libellés des pages réalisations. */
export const realisationsTextes = {
  page: {
    titre: { fr: 'Réalisations', en: 'Work' },
    description: {
      fr: 'Réalisations de l’atelier Numerika à Dakar : impression, signalétique, objets, textile.',
      en: 'Work from the Numerika workshop in Dakar: printing, signage, objects, textile.',
    },
    filtreTous: { fr: 'Tous les pôles', en: 'All units' },
  },
  vide: {
    message: {
      fr: 'Réalisations en cours de documentation.',
      en: 'Work being documented.',
    },
    whatsapp: {
      fr: 'Bonjour, je souhaite voir des réalisations de Numerika.',
      en: 'Hello, I would like to see examples of Numerika’s work.',
    },
  },
  fiche: {
    contexte: { fr: 'Le contexte', en: 'The context' },
    reponse: { fr: 'La réponse', en: 'The response' },
    client: { fr: 'Client', en: 'Client' },
    annee: { fr: 'Année', en: 'Year' },
    techniques: { fr: 'Techniques', en: 'Techniques' },
    dimensions: { fr: 'Dimensions', en: 'Dimensions' },
  },
} as const
