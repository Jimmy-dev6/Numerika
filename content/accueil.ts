import type { CleImage } from './images.gen'

/** Textes de l'accueil (brief §6.1, étape 7 ; images à l'étape 15 bis). */
export const accueil = {
  /* Diaporama du hero : 4 images fortes, réelles, sans attribution dans
     les alt tant que les réalisations ne sont pas publiables (régime
     pôle). L'ordre est éditorial : lumière, mouvement, échelle, régie. */
  heroDiaporama: [
    {
      cle: 'realisations/enseigne-lumineuse-ecobank',
      alt: { fr: 'Enseigne lumineuse posée en façade, de nuit', en: 'Illuminated sign installed on a façade at night' },
    },
    {
      cle: 'realisations/camion-casamancaise',
      alt: { fr: 'Camion habillé en covering total', en: 'Truck in full wrap' },
    },
    {
      cle: 'realisations/facade-crystal',
      alt: { fr: 'Façade de commerce habillée', en: 'Clad shop façade' },
    },
    {
      cle: 'panneaux/pikine-arene-nationale',
      alt: { fr: 'Panneau grand format à Pikine, vue aérienne', en: 'Large-format billboard in Pikine, aerial view' },
    },
  ] satisfies Array<{ cle: CleImage; alt: { fr: string; en: string } }>,

  portes: {
    production: {
      /* Image de fond de la porte (étape 15 bis) : le camion Numerika —
         l'atelier qui roule. Texte par-dessus voile sombre. */
      image: 'realisations/camion-numerika' satisfies CleImage,
      imageAlt: { fr: 'Camion Numerika en covering', en: 'Numerika truck in full wrap' },
      surtitre: { fr: 'Production', en: 'Production' },
      titre: { fr: 'Ce que l’on fabrique.', en: 'What we make.' },
      phrase: {
        fr: 'Impression grand format, imprimerie, signalétique, textile, objets, branding de véhicules.',
        en: 'Large-format printing, print shop, signage, textile, objects, vehicle branding.',
      },
      lien: { fr: 'Découvrir les métiers', en: 'Explore our expertise' },
    },
    media: {
      /* La photo Colobane du lot est une prise de JOUR (vérifiée) : repli
         prévu par le prompt maître → KRM00176, panneaux du Plateau. */
      image: 'panneaux/plateau-entree-ville' satisfies CleImage,
      imageAlt: { fr: 'Panneaux d’affichage au Plateau, Dakar', en: 'Billboards in Plateau, Dakar' },
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
