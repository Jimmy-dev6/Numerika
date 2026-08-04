import type { Localized } from '@/lib/i18n'

/**
 * Données globales du site (brief §2, §7).
 * Squelette posé à l'étape 1, complété à l'étape 3.
 * Règle : aucune donnée non vérifiée n'est rendue. Ce qui est incertain
 * porte un commentaire À CONFIRMER et reste hors rendu.
 */
export const site = {
  nom: 'NUMERIKA',
  fondee: 2008,
  collaborateurs: 60,
  emplacements: 27,

  adresse: {
    // À CONFIRMER : "km 2.5" (pied de page actuel) ou "Km3" (page contact actuelle).
    // Une seule version doit subsister. En attendant, on ne rend que la rue.
    rue: 'Route de Rufisque',
    ville: 'Dakar',
    pays: { fr: 'Sénégal', en: 'Senegal' } satisfies Localized,
    coords: { lat: 14.6970171, lng: -17.4370865 },
  },

  telephones: ['(+221) 33 842 84 42', '(+221) 33 842 84 43', '(+221) 33 842 84 45'],
  email: 'info@numerika.sn',

  // Numéro de test, à remplacer avant mise en production (validation étape 2).
  // Source unique du numéro : jamais en dur dans un composant. Si repassé à
  // null, <WhatsAppCTA> ne rend rien — c'est le garde-fou voulu.
  whatsappNumber: '221776385420' as string | null,

  // À CONFIRMER : créer le formulaire sur Formspree et saisir l'ID ici.
  // Tant que null : formulaires rendus mais envoi désactivé, message
  // « Formulaire en cours d'activation » + WhatsApp en alternative —
  // jamais un formulaire qui semble marcher et n'envoie rien.
  formspreeId: null as string | null,

  // À CONFIRMER : horaires d'ouverture (asset n°9). La section Horaires
  // de /contact s'affiche dès que ce champ est renseigné.
  horaires: null as { fr: string; en: string } | null,

  navigation: [
    { href: '/metiers', label: { fr: 'Métiers', en: 'Expertise' } },
    { href: '/realisations', label: { fr: 'Réalisations', en: 'Work' } },
    { href: '/media', label: { fr: 'Numerika Media', en: 'Numerika Media' } },
    { href: '/entreprise', label: { fr: 'L’entreprise', en: 'About' } },
    { href: '/contact', label: { fr: 'Contact', en: 'Contact' } },
  ],

  devis: { href: '/devis', label: { fr: 'Demander un devis', en: 'Request a quote' } },

  reseaux: {
    facebook: 'https://www.facebook.com/NumerikaDakar',
    instagram: 'https://www.instagram.com/numerika_officiel_dkr',
    // Attention : ne jamais lier linkedin.com/company/numerika-sa (homonyme tunisien)
    linkedin: 'https://www.linkedin.com/company/numerikasenegal',
  },

  meta: {
    titre: {
      fr: 'NUMERIKA — Impression grand format et affichage urbain à Dakar',
      en: 'NUMERIKA — Large-format printing and out-of-home advertising in Dakar',
    } satisfies Localized,
  },

  hero: {
    // PROVISOIRE : à valider avec le client. Arbitrage étape 7 : le titre
    // est raccourci, la cote porte seule « depuis 2008 ».
    titre: {
      fr: 'Nous imprimons\nDakar.',
      en: 'Printing\nDakar.',
    } satisfies Localized,
    sousTitre: {
      fr: 'Imprimeur grand format et régie d’affichage urbain à Dakar.',
      en: 'Large-format printer and out-of-home advertising network in Dakar.',
    } satisfies Localized,
    /* À l'arrivée de l'asset n°8 (largeur d'impression maximale des
       machines) : décider si la largeur machine remplace l'année ou annote
       un autre bloc — ne pas cumuler deux cotes sur le hero. */
    cote: { fr: 'depuis 2008', en: 'since 2008' } satisfies Localized,
  },
} as const
