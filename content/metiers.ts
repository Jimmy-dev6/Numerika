import type { CleImage } from './images.gen'
import type { Localized } from '@/lib/i18n'

/**
 * Les 8 pôles métier (brief §5, étape 8).
 * Les anciennes pages WordPress deviennent des ancres : chaque produit
 * porte la sienne. FIGÉES comme les slugs — ce sont les cibles des
 * redirections 301 de l'étape 13 (#sublimation, #gravure, #exterieure,
 * #interieure, #facade, #display, #parametrique, #projets, #studio,
 * #events). Ne plus les renommer.
 * Descriptions réécrites en langage client, règle éditoriale §8 :
 * factuel, ce qu'un dirigeant écrirait lui-même.
 */
export type Metier = {
  slug: string
  nom: Localized
  description: Localized
  /** Complément de la phrase WhatsApp : « Bonjour, j'ai un projet … ». */
  contexteDevis: Localized
  /** Image d'ouverture et vignette du pôle (étape 15 bis, passe A).
      RÉGIME PÔLE : une photo de réalisation montre un produit posé dans
      l'espace public — montrable en contexte pôle dès maintenant, mais
      SANS attribution tant que la réalisation n'est pas `publiable`
      (l'image seule, jamais le nom du client). Ne JAMAIS illustrer un
      pôle avec la photo d'un autre métier. null = substitution conservée. */
  image: CleImage | null
  produits: Array<{ ancre: string; nom: Localized }>
}

export const metiers: Metier[] = [
  {
    slug: 'impression-numerique',
    nom: { fr: 'Impression numérique', en: 'Digital printing' },
    description: {
      fr: 'Bâches, adhésifs, vinyles et tirages grand format, sur supports souples ou rigides, en petite comme en grande série.',
      en: 'Banners, adhesives, vinyl and large-format prints, on flexible or rigid materials, in short or long runs.',
    },
    contexteDevis: { fr: 'en impression numérique', en: 'in digital printing' },
    image: 'realisations/bache-lassa',
    produits: [
      { ancre: 'grand-format', nom: { fr: 'Grand format', en: 'Large format' } },
      { ancre: 'baches', nom: { fr: 'Bâches', en: 'Banners' } },
      { ancre: 'adhesifs', nom: { fr: 'Adhésifs et vinyles', en: 'Adhesives and vinyl' } },
      { ancre: 'multi-supports', nom: { fr: 'Multi-supports', en: 'Multi-material printing' } },
    ],
  },
  {
    slug: 'imprimerie',
    nom: { fr: 'Imprimerie', en: 'Print shop' },
    description: {
      fr: 'Flyers, affiches, dépliants et cartes de visite, avec le papier et la finition choisis pour l’usage.',
      en: 'Flyers, posters, leaflets and business cards, with paper and finishing matched to how they will be used.',
    },
    contexteDevis: { fr: 'en imprimerie', en: 'in print' },
    image: null, // À CONFIRMER : photos atelier imprimerie à demander

    produits: [
      { ancre: 'flyers', nom: { fr: 'Flyers', en: 'Flyers' } },
      { ancre: 'affiches', nom: { fr: 'Affiches', en: 'Posters' } },
      { ancre: 'depliants', nom: { fr: 'Dépliants', en: 'Leaflets' } },
      { ancre: 'cartes', nom: { fr: 'Cartes de visite', en: 'Business cards' } },
      { ancre: 'finitions', nom: { fr: 'Papiers et finitions', en: 'Papers and finishing' } },
    ],
  },
  {
    slug: 'textile',
    nom: { fr: 'Textile', en: 'Textile' },
    description: {
      fr: 'Broderie, sérigraphie, transfert et sublimation, sur vêtements de travail, tenues d’équipe et supports textiles.',
      en: 'Embroidery, screen printing, transfer and sublimation, on workwear, team clothing and textile materials.',
    },
    contexteDevis: { fr: 'en textile', en: 'in textile' },
    image: null, // À CONFIRMER : photos atelier textile à demander

    produits: [
      { ancre: 'broderie', nom: { fr: 'Broderie', en: 'Embroidery' } },
      { ancre: 'serigraphie', nom: { fr: 'Sérigraphie', en: 'Screen printing' } },
      { ancre: 'transfert', nom: { fr: 'Transfert', en: 'Transfer' } },
      { ancre: 'sublimation', nom: { fr: 'Sublimation', en: 'Sublimation' } },
      { ancre: 'vetements-pro', nom: { fr: 'Vêtements professionnels', en: 'Workwear' } },
    ],
  },
  {
    slug: 'signaletique',
    nom: { fr: 'Signalétique', en: 'Signage' },
    /* Pose validée (relecture étape 8), portfolio du site actuel à l'appui. */
    description: {
      fr: 'Enseignes, lettrages, totems et néons, fabriqués à l’atelier et posés en façade comme en intérieur.',
      en: 'Signs, lettering, totems and neon, made in our workshop and installed on façades and indoors.',
    },
    contexteDevis: { fr: 'en signalétique', en: 'in signage' },
    image: 'realisations/neon-madrague',
    produits: [
      { ancre: 'enseignes', nom: { fr: 'Enseignes', en: 'Signs' } },
      { ancre: 'exterieure', nom: { fr: 'Signalétique extérieure', en: 'Exterior signage' } },
      { ancre: 'interieure', nom: { fr: 'Signalétique intérieure', en: 'Interior signage' } },
      { ancre: 'neon', nom: { fr: 'Néon', en: 'Neon' } },
      { ancre: 'lettrage', nom: { fr: 'Lettrage', en: 'Lettering' } },
      { ancre: 'totems', nom: { fr: 'Totems', en: 'Totems' } },
    ],
  },
  {
    slug: 'objets',
    nom: { fr: 'Objets et personnalisation', en: 'Objects and personalisation' },
    description: {
      fr: 'Goodies, trophées, badges et coffrets, gravés ou marqués au laser, à l’unité ou en série.',
      en: 'Corporate gifts, trophies, badges and gift boxes, laser engraved or marked, one-off or in series.',
    },
    contexteDevis: { fr: 'en objets personnalisés', en: 'in personalised objects' },
    image: 'realisations/trophee-credit-international',
    produits: [
      { ancre: 'goodies', nom: { fr: 'Goodies', en: 'Corporate gifts' } },
      { ancre: 'trophees', nom: { fr: 'Trophées', en: 'Trophies' } },
      { ancre: 'gravure', nom: { fr: 'Gravure laser et découpe', en: 'Laser engraving and cutting' } },
      { ancre: 'badges', nom: { fr: 'Badges', en: 'Badges' } },
      { ancre: 'coffrets', nom: { fr: 'Coffrets cadeaux', en: 'Gift boxes' } },
      { ancre: 'display', nom: { fr: 'Supports de communication', en: 'Display materials' } },
    ],
  },
  {
    slug: 'branding-vehicules',
    nom: { fr: 'Branding véhicules', en: 'Vehicle branding' },
    /* Pose validée (relecture étape 8), portfolio du site actuel à l'appui. */
    description: {
      fr: 'Covering d’utilitaires, de flottes d’entreprise et de tricycles, découpe et pose comprises.',
      en: 'Wrapping for vans, company fleets and cargo tricycles, cutting and installation included.',
    },
    contexteDevis: { fr: 'en branding de véhicules', en: 'in vehicle branding' },
    image: 'realisations/camion-casamancaise',
    produits: [
      { ancre: 'covering', nom: { fr: 'Covering utilitaires', en: 'Van wrapping' } },
      { ancre: 'flottes', nom: { fr: 'Flottes', en: 'Fleets' } },
      { ancre: 'tricycles', nom: { fr: 'Tricycles', en: 'Cargo tricycles' } },
    ],
  },
  {
    slug: 'menuiserie-facade',
    nom: { fr: 'Menuiserie et façade', en: 'Woodwork and façades' },
    /* À CONFIRMER : destinataires (commerces, sièges, chantiers) à affiner
       avec le client (relecture étape 8). */
    description: {
      fr: 'Menuiserie bois et aluminium, revêtements muraux et habillage de façades, pour les commerces, les sièges et les chantiers.',
      en: 'Wood and aluminium joinery, wall cladding and façade treatment, for shops, head offices and construction sites.',
    },
    contexteDevis: { fr: 'en menuiserie ou façade', en: 'in joinery or façade work' },
    image: 'realisations/facade-crystal',
    produits: [
      { ancre: 'bois', nom: { fr: 'Menuiserie bois', en: 'Wood joinery' } },
      { ancre: 'aluminium', nom: { fr: 'Menuiserie aluminium', en: 'Aluminium joinery' } },
      { ancre: 'revetement', nom: { fr: 'Revêtements', en: 'Cladding' } },
      { ancre: 'facade', nom: { fr: 'Concept architectural 360°', en: '360° architectural concept' } },
    ],
  },
  {
    slug: '3d-projets',
    nom: { fr: '3D et projets spécifiques', en: '3D and special projects' },
    description: {
      fr: 'Impression 3D, découpe de polystyrène, structures paramétriques, studio photo et vidéo : le pôle des demandes qui sortent du catalogue.',
      en: '3D printing, polystyrene cutting, parametric structures, photo and video studio: the unit for requests outside the catalogue.',
    },
    contexteDevis: { fr: 'en 3D ou projet spécifique', en: 'in 3D or a special project' },
    image: null, // À CONFIRMER : photos atelier 3D/projets à demander

    produits: [
      { ancre: 'impression-3d', nom: { fr: 'Impression 3D', en: '3D printing' } },
      { ancre: 'polystyrene', nom: { fr: 'Polystyrène', en: 'Polystyrene' } },
      { ancre: 'parametrique', nom: { fr: 'Paramétrique', en: 'Parametric' } },
      { ancre: 'studio', nom: { fr: 'Studio photo et vidéo', en: 'Photo and video studio' } },
      { ancre: 'events', nom: { fr: 'Events', en: 'Events' } },
      { ancre: 'projets', nom: { fr: 'Projets spécifiques', en: 'Special projects' } },
    ],
  },
]

/** Libellés des pages métiers. */
export const metiersTextes = {
  page: {
    titre: { fr: 'Métiers', en: 'Expertise' },
    intro: {
      fr: 'Huit pôles sous le même toit, route de Rufisque.',
      en: 'Eight units under one roof, on route de Rufisque.',
    },
  },
  fiche: {
    produits: { fr: 'Produits et supports', en: 'Products and materials' },
    realisations: { fr: 'Réalisations du pôle', en: 'Work from this unit' },
    whatsappIntro: { fr: 'Bonjour, j’ai un projet', en: 'Hello, I have a project' },
    devis: { fr: 'Demander un devis', en: 'Request a quote' },
  },
} as const
