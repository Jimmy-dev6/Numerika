import type { Localized } from '@/lib/i18n'

/**
 * Page entreprise (brief §6.3, étape 10).
 * Régime factuel strict :
 * — INTERDIT : « 45 ans d'expertise cumulée » tant que l'arbitrage client
 *   n'est pas rendu (asset n°10) — le récit tient sans ce chiffre.
 *   À CONFIRMER.
 * — INTERDIT : « leader », autoproclamé du site actuel. Le site prouve au
 *   lieu d'affirmer. À CONFIRMER si le client veut réintroduire un
 *   positionnement, il devra être démontrable.
 */
export const entreprise = {
  meta: {
    titre: { fr: 'L’entreprise', en: 'About Numerika' },
  },

  titre: { fr: 'L’entreprise', en: 'The company' },

  recit: [
    {
      fr: 'Numerika est née à Dakar en 2008, route de Rufisque. L’atelier n’a pas bougé ; l’équipe, elle, compte aujourd’hui 60 collaborateurs.',
      en: 'Numerika was founded in Dakar in 2008, on route de Rufisque. The workshop has not moved; the team has grown to 60 people.',
    },
    {
      fr: 'Deux métiers vivent sous le même toit. La production d’abord : impression grand format, imprimerie, signalétique, textile, objets, menuiserie. La régie ensuite : Numerika Media exploite 23 emplacements d’affichage et 4 réseaux, à Dakar et en régions.',
      en: 'Two businesses live under one roof. Production first: large-format printing, print work, signage, textile, objects, joinery. Then media: Numerika Media operates 23 billboard locations and 4 display networks, in Dakar and the regions.',
    },
    {
      fr: 'Les clients viennent du Sénégal et de la sous-région : institutions internationales, ambassades, banques, industriels, hôtels.',
      en: 'Clients come from Senegal and the wider sub-region: international institutions, embassies, banks, manufacturers, hotels.',
    },
  ] satisfies Localized[],

  valeurs: {
    titre: { fr: 'Valeurs', en: 'Values' },
    /* Les quatre valeurs du brief, réécrites en une phrase concrète
       chacune (règle éditoriale §8). Présentation sobre, pas de cartes
       à icônes. */
    items: [
      {
        // ENGAGEMENT DE SERVICE : validation client explicite requise
        // (« et se tient »). Version de repli si non assumé :
        // « le délai se donne avant la commande. »
        nom: { fr: 'Réactivité', en: 'Responsiveness' },
        phrase: {
          fr: 'Une campagne se joue souvent en jours : le délai se donne avant la commande et se tient.',
          en: 'A campaign is often a matter of days: the deadline is given before the order, and kept.',
        },
      },
      {
        nom: { fr: 'Professionnalisme', en: 'Professionalism' },
        phrase: {
          fr: 'Chaque commande sort contrôlée : dimensions vérifiées, couleurs conformes au fichier, pose soignée.',
          en: 'Every order leaves checked: dimensions verified, colours true to the file, careful installation.',
        },
      },
      {
        // ENGAGEMENT DE SERVICE : validation client explicite requise
        // (« un interlocuteur » unique).
        nom: { fr: 'Engagement collectif', en: 'Collective commitment' },
        phrase: {
          fr: 'Le graphiste, l’imprimeur et le poseur travaillent sous le même toit, et le client n’a qu’un interlocuteur.',
          en: 'Designer, printer and installer work under one roof, and the client deals with a single point of contact.',
        },
      },
      {
        nom: { fr: 'Créativité appliquée', en: 'Applied creativity' },
        phrase: {
          fr: 'Une idée n’est retenue que si l’atelier sait la fabriquer et si le budget la porte.',
          en: 'An idea is only kept if the workshop can build it and the budget can carry it.',
        },
      },
    ],
  },

  equipement: {
    titre: { fr: 'Équipement', en: 'Equipment' },
  },

  /** null tant que les photos d'atelier ne sont pas fournies (asset n°1). */
  photos: {
    ouverture: null as string | null,
    recit: null as string | null,
    valeurs: null as string | null,
  },
} as const

export type Machine = {
  nom: string
  /** latex, UV, éco-solvant, laser CO2, brodeuse, CNC… */
  technologie: Localized
  /** Capacité mesurable (largeur d'impression, zone de découpe…).
      Nourrira des <Cote> — jamais de valeur inventée. */
  capacite: { valeur: number; unite: string; label: Localized } | null
}

/* À CONFIRMER (asset n°8) : liste des machines, marques, largeurs
   d'impression, technologies. La section Équipement de /entreprise
   s'affiche automatiquement dès la première machine saisie ici —
   aucun code à toucher. */
export const machines: Machine[] = []
