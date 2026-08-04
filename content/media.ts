import type { Localized } from '@/lib/i18n'

/**
 * Textes des pages NUMERIKA MEDIA (brief §6.2).
 * Règle éditoriale §8 : factuel, pas de superlatifs creux, pas de tirets
 * cadratins. Le total de trafic est toujours qualifié de « cumulé », jamais
 * présenté comme une audience nette (brief §7.3).
 */
export const media = {
  meta: {
    accueil: {
      titre: { fr: 'Numerika Media, affichage urbain à Dakar', en: 'Numerika Media, out-of-home advertising in Dakar' },
    },
    emplacements: {
      titre: { fr: "Emplacements d'affichage", en: 'Billboard locations' },
      description: {
        fr: 'Les 23 emplacements d’affichage de Numerika Media à Dakar : dimensions, trafic, disponibilité.',
        en: 'Numerika Media’s 23 billboard locations in Dakar: dimensions, traffic, availability.',
      },
    },
  },

  hero: {
    surtitre: { fr: 'Numerika Media', en: 'Numerika Media' },
    titre: { fr: 'Où l’on vous voit.', en: 'Where you get seen.' },
    sousTitre: {
      fr: 'Le réseau d’affichage de Numerika : grands formats sur les axes majeurs de Dakar, réseaux 4x3, sucettes et oriflammes à Dakar et en régions.',
      en: 'Numerika’s out-of-home network: large formats on Dakar’s main roads, plus 4x3, city light and oriflamme networks across Dakar and the regions.',
    },
    chiffres: {
      emplacements: { fr: 'emplacements premium', en: 'premium locations' },
      reseaux: { fr: 'réseaux d’affichage', en: 'display networks' },
      contacts: { fr: 'contacts quotidiens cumulés', en: 'combined daily contacts' },
    },
    noteTrafics: {
      fr: 'Trafics : estimations Numerika. Contacts cumulés, non dédupliqués.',
      en: 'Traffic figures: Numerika estimates. Combined contacts, not deduplicated.',
    },
  },

  inventaire: {
    titre: { fr: 'Les emplacements', en: 'The locations' },
    lien: {
      fr: 'Voir les emplacements et leurs disponibilités',
      en: 'See the locations and their availability',
    },
    libresAujourdhui: {
      singulier: { fr: 'emplacement libre aujourd’hui', en: 'location available today' },
      pluriel: { fr: 'emplacements libres aujourd’hui', en: 'locations available today' },
    },
    affiches: {
      singulier: { fr: 'emplacement affiché', en: 'location shown' },
      pluriel: { fr: 'emplacements affichés', en: 'locations shown' },
    },
    sur: { fr: 'sur', en: 'of' },
  },

  filtres: {
    legende: { fr: 'Filtrer les emplacements', en: 'Filter the locations' },
    zone: { fr: 'Zone', en: 'Area' },
    faces: { fr: 'Faces', en: 'Faces' },
    vuesMin: { fr: 'Trafic minimum', en: 'Minimum traffic' },
    dispo: { fr: 'Disponibilité', en: 'Availability' },
    dispoTous: { fr: 'Tous', en: 'All' },
    dispoLibre: { fr: 'Libres maintenant', en: 'Available now' },
    libreAvant: { fr: 'Libres avant le', en: 'Available before' },
    toutes: { fr: 'Toutes', en: 'All' },
    tous: { fr: 'Tous', en: 'All' },
    vuesJour: { fr: 'vues/jour', en: 'views/day' },
    reinitialiser: { fr: 'Réinitialiser les filtres', en: 'Reset filters' },
  },

  vide: {
    message: {
      fr: 'Aucun emplacement ne correspond à ces critères.',
      en: 'No location matches these filters.',
    },
  },

  dispo: {
    libre: { fr: 'Libre', en: 'Available' },
    libreLe: { fr: 'libre le', en: 'available on' },
  },

  facesLabels: {
    recto: { fr: 'Recto', en: 'Single-sided' },
    'recto-verso': { fr: 'Recto-verso', en: 'Double-sided' },
    triface: { fr: 'Triface', en: 'Three-sided' },
  } satisfies Record<string, Localized>,

  supportLabels: {
    'bache-tendue': { fr: 'Bâche tendue', en: 'Stretched banner' },
    'papier-dos-bleu': { fr: 'Papier dos bleu', en: 'Blueback paper' },
  } satisfies Record<string, Localized>,

  reseaux: {
    titre: { fr: 'Les réseaux', en: 'The networks' },
    intro: {
      fr: 'En complément des emplacements uniques, quatre réseaux d’affichage couvrent Dakar et les régions en formats standardisés.',
      en: 'Alongside the single locations, four display networks cover Dakar and the regions in standard formats.',
    },
    couverture: { fr: 'Couverture', en: 'Coverage' },
    format: { fr: 'Format', en: 'Format' },
    support: { fr: 'Support', en: 'Material' },
    faces: { fr: 'Faces', en: 'Faces' },
  },

  fiche: {
    retour: { fr: 'Retour à la liste', en: 'Back to the list' },
    seLibere: { fr: 'Se libère le', en: 'Frees up on' },
    dimensions: { fr: 'Dimensions', en: 'Dimensions' },
    faces: { fr: 'Faces', en: 'Faces' },
    support: { fr: 'Support', en: 'Material' },
    trafic: { fr: 'Trafic', en: 'Traffic' },
    zone: { fr: 'Zone', en: 'Area' },
    ville: { fr: 'Ville', en: 'City' },
    estimation: { fr: 'estimation Numerika', en: 'Numerika estimate' },
    memeZone: { fr: 'Dans la même zone', en: 'In the same area' },
    maps: { fr: 'Voir sur Google Maps', en: 'Open in Google Maps' },
    whatsappIntro: {
      fr: 'Bonjour, je souhaite des informations sur l’emplacement',
      en: 'Hello, I would like information about the location',
    },
  },

  reseauFiche: {
    fonctionnement: { fr: 'Fonctionnement', en: 'How it works' },
    explication: {
      fr: 'Ce format fonctionne en réseau : plusieurs faces réparties sur la couverture indiquée, mobilisées ensemble pour une même campagne.',
      en: 'This format works as a network: multiple faces spread across the indicated coverage, used together for a single campaign.',
    },
    whatsappIntro: {
      fr: 'Bonjour, je souhaite des informations sur le',
      en: 'Hello, I would like information about the',
    },
  },

  selection: {
    ajouter: { fr: 'Ajouter à la sélection', en: 'Add to selection' },
    retirer: { fr: 'Retirer de la sélection', en: 'Remove from selection' },
    caseLabel: { fr: 'Sélectionner cet emplacement', en: 'Select this location' },
    compteur: {
      singulier: { fr: 'emplacement sélectionné', en: 'location selected' },
      pluriel: { fr: 'emplacements sélectionnés', en: 'locations selected' },
    },
    whatsappLabel: { fr: 'Demande groupée WhatsApp', en: 'Group enquiry on WhatsApp' },
    devisLabel: { fr: 'Pré-remplir un devis', en: 'Pre-fill a quote' },
    vider: { fr: 'Vider la sélection', en: 'Clear selection' },
    messageIntro: {
      fr: 'Bonjour, je souhaite une demande groupée pour les emplacements suivants :',
      en: 'Hello, I would like a group enquiry for the following locations:',
    },
  },

  carte: {
    voir: { fr: 'Voir la carte', en: 'Show the map' },
    masquer: { fr: 'Masquer la carte', en: 'Hide the map' },
    passer: { fr: 'Passer la carte, aller à la liste', en: 'Skip the map, go to the list' },
    coordsEnCours: {
      fr: 'Localisation précise en cours d’ajout.',
      en: 'Precise locations being added.',
    },
    siege: { fr: 'Siège Numerika, route de Rufisque', en: 'Numerika head office, route de Rufisque' },
  },

  whatsappAccueil: {
    fr: 'Bonjour, je souhaite des informations sur le réseau d’affichage Numerika Media.',
    en: 'Hello, I would like information about the Numerika Media display network.',
  },
} as const
