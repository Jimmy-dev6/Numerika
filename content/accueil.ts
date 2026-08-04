/** Textes de l'accueil (brief §6.1, étape 7). */
export const accueil = {
  portes: {
    production: {
      surtitre: { fr: 'Production', en: 'Production' },
      titre: { fr: 'Ce que l’on fabrique.', en: 'What we make.' },
      phrase: {
        fr: 'Impression grand format, imprimerie, signalétique, textile, objets, branding de véhicules.',
        en: 'Large-format printing, print shop, signage, textile, objects, vehicle branding.',
      },
      lien: { fr: 'Découvrir les métiers', en: 'Explore our expertise' },
    },
    media: {
      surtitre: { fr: 'Numerika Media', en: 'Numerika Media' },
      titre: { fr: 'Où l’on vous voit.', en: 'Where you get seen.' },
      phrase: {
        fr: '23 emplacements grand format et 4 réseaux d’affichage à Dakar et en régions.',
        en: '23 large-format locations and 4 display networks across Dakar and the regions.',
      },
      lien: { fr: 'Explorer le réseau', en: 'Explore the network' },
    },
  },

  chiffres: {
    fondation: { fr: 'Fondation', en: 'Founded' },
    collaborateurs: { fr: 'Collaborateurs', en: 'Employees' },
    emplacements: {
      fr: 'Emplacements et réseaux d’affichage',
      en: 'Billboard locations and networks',
    },
    /* Quatrième chiffre : en attente d'une donnée client vraie et vérifiable
       (surface imprimée par an, clients actifs…). À CONFIRMER, non rendu. */
  },

  /* Les trois réalisations mises en avant vivent dans
     content/realisations.ts depuis l'étape 8 (source unique). */
  realisations: {
    titre: { fr: 'Réalisations', en: 'Work' },
  },

  references: {
    intertitre: { fr: 'références', en: 'references' },
  },

  pied: {
    whatsapp: {
      fr: 'Bonjour, je souhaite des informations sur les services de Numerika.',
      en: 'Hello, I would like information about Numerika’s services.',
    },
  },
} as const
