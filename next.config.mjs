/**
 * Redirections 301 de l'héritage WordPress (brief §8, étape 13).
 * Elles vivent ICI et s'exécutent AVANT le middleware (amendement étape 1) :
 * la cible est toujours l'URL finale préfixée /fr, jamais un chemin nu que
 * le middleware re-redirigerait — une seule redirection par requête.
 */

/* Anciennes URL simples (.php et WordPress) → nouvelles routes.
   Les quatre pages .php citées au brief sont couvertes en paire avec leur
   équivalent WordPress. */
const redirectionsSimples = [
  /* Paires .php / WordPress */
  ['/impression-digital.php', '/fr/metiers/impression-numerique'],
  ['/impression-digital', '/fr/metiers/impression-numerique'],
  ['/impression-numerique.php', '/fr/metiers/impression-numerique'],
  ['/impression-numerique', '/fr/metiers/impression-numerique'],
  ['/signaletique.php', '/fr/metiers/signaletique'],
  ['/signaletique', '/fr/metiers/signaletique'],
  ['/regie-publicitaire.php', '/fr/media'],
  ['/regie-publicitaire', '/fr/media'],

  /* Pages WordPress */
  ['/presentation-de-numerika', '/fr/entreprise'],
  ['/nos-realisations', '/fr/realisations'],
  ['/imprimerie', '/fr/metiers/imprimerie'],
  ['/textile', '/fr/metiers/textile'],
  ['/sublimation', '/fr/metiers/textile#sublimation'],
  ['/menuiserie-bois-et-aluminium', '/fr/metiers/menuiserie-facade'],
  ['/concept-architectural-360', '/fr/metiers/menuiserie-facade#facade'],
  ['/signaletique-exterieure', '/fr/metiers/signaletique#exterieure'],
  ['/signaletique-interieure', '/fr/metiers/signaletique#interieure'],
  ['/branding-vehicules', '/fr/metiers/branding-vehicules'],
  ['/gravure-laser-decoupe', '/fr/metiers/objets#gravure'],
  ['/3d', '/fr/metiers/3d-projets'],
  ['/parametrique', '/fr/metiers/3d-projets#parametrique'],
  ['/pole-projets-specifiques', '/fr/metiers/3d-projets#projets'],
  ['/studio-photo-video', '/fr/metiers/3d-projets#studio'],
  ['/events', '/fr/metiers/3d-projets#events'],
  ['/devis', '/fr/devis'],
  ['/contact', '/fr/contact'],
  ['/catalogue', '/fr/metiers'],

  /* Petits objets (anciennes sous-pages produits) */
  ['/stylo', '/fr/metiers/objets'],
  ['/porte-cle', '/fr/metiers/objets'],
  ['/mugs', '/fr/metiers/objets'],
  ['/trophee', '/fr/metiers/objets'],
  ['/pins', '/fr/metiers/objets'],
  ['/cle-usb', '/fr/metiers/objets'],
  ['/tapis-de-souris', '/fr/metiers/objets'],
  ['/badge', '/fr/metiers/objets'],
  ['/coffret-cadeaux', '/fr/metiers/objets'],

  /* Liens de la page entreprise actuelle */
  ['/goodies', '/fr/metiers/objets'],
  ['/display', '/fr/metiers/objets'],

  /* Liens du « CE QUE L'ON FAIT » actuel */
  ['/facade', '/fr/metiers/menuiserie-facade'],
  ['/personnalisation', '/fr/metiers/objets'],
  ['/solutions-daffichage', '/fr/media'],
]

/* Sous-pages connues de /support-de-communication/ ; la règle générique
   sur le préfixe couvre le reste (déclarée après les explicites). */
const supportsDeCommunication = [
  'beach-flag',
  'cadre-clippant',
  'mat-drapeau',
  'porte-brochure',
  'photo-call',
  'stand-hotesse',
  'totem',
  'tente',
  'presentoir-sur-mesure',
]

/*
 * Correspondance slug WordPress → slug figé (étape 3), ligne par ligne.
 * Les slugs WordPress sont reconstruits par slugification des noms du
 * brief §7.3 (la source), plus les variantes « aibd » relevées pour les
 * deux faces Almadies (validation étape 12).
 * À CONFIRMER : vérifier chaque slug contre le site WordPress vivant
 * avant la bascule — toute URL réelle divergente s'ajoute ici en une
 * ligne. Le repli générique /panneaux/* → liste couvre les inconnues.
 */
const panneauxWordpress = [
  ['almadies-sens-ancien-aeroport-vers-almadies-au-dessus-station-shell', 'almadies-shell-sens-almadies'],
  ['almadies-sens-aibd-vers-almadies-au-dessus-station-shell', 'almadies-shell-sens-almadies'],
  ['almadies-sens-almadies-vers-ancien-aeroport-au-dessus-station-shell', 'almadies-shell-sens-aeroport'],
  ['almadies-sens-almadies-vers-aibd-au-dessus-station-shell', 'almadies-shell-sens-aeroport'],
  ['entree-ville-face-camp-abdou-diasse-sens-colobane-vers-entree-ville', 'entree-ville-abdou-diasse-sens-ville'],
  ['entree-ville-face-camp-abdou-diasse-sens-sortie-ville-vers-colobane', 'entree-ville-abdou-diasse-sens-colobane'],
  ['autoroute-a-cote-central-equipement-sens-aibd-vers-dakar', 'autoroute-central-equipement-sens-dakar'],
  ['autoroute-a-cote-central-equipement-face-rn1', 'autoroute-central-equipement-face-rn1'],
  ['pikine-a-cote-arene-nationale', 'pikine-arene-nationale'],
  ['aeroport-aibd', 'aeroport-aibd'],
  ['route-de-rufisque-face-cotoa', 'route-rufisque-cotoa'],
  ['corniche-ouest-sens-plateau-vers-soumbedioune', 'corniche-ouest-sens-soumbedioune'],
  ['soumbedioune-corniche-ouest-sortie-tunnel', 'soumbedioune-sortie-tunnel'],
  ['plateau-face-mairie-de-dakar', 'plateau-mairie'],
  ['colobane', 'colobane'],
  ['autoroute-a-peage-eiffage-sens-dakar-vers-aibd-croisement-sedima', 'peage-sedima-sens-aibd'],
  ['autoroute-a-peage-eiffage-sens-aibd-vers-dakar-croisement-sedima', 'peage-sedima-sens-dakar'],
  ['autoroute-mariste-sens-emg-vers-dakar', 'mariste-sens-dakar'],
  ['autoroute-mariste-sens-dakar-vers-emg', 'mariste-sens-emg'],
  ['ouest-foire-echangeur-foire', 'ouest-foire-echangeur'],
  ['plateau-place-de-lindependance', 'plateau-place-independance'],
  ['autoroute-sortie-peage-poste-thiaroye-sens-aibd-vers-dakar', 'peage-thiaroye-sens-dakar'],
  ['autoroute-sortie-peage-poste-thiaroye-sens-dakar-vers-aibd', 'peage-thiaroye-sens-aibd'],
  ['autoroute-a-cote-central-equipement-sens-dakar-vers-aibd', 'autoroute-central-equipement-sens-aibd'],
  ['plateau-entree-ville-de-dakar', 'plateau-entree-ville'],
]

/**
 * Chaque source héritée est déclarée avec ET sans slash final : WordPress
 * servait les deux, et la normalisation Next (308) créerait une chaîne
 * avant notre 301. skipTrailingSlashRedirect est actif : la normalisation
 * des URL du nouveau site vit dans le middleware, fusionnée avec le
 * préfixe de langue — une seule redirection par requête, toujours.
 */
/* statusCode 301 explicite : permanent: true émettrait un 308 ; le brief
   demande des 301 (équivalents pour le SEO, mais conformes au cahier). */
function paire(source, destination) {
  return [
    { source, destination, statusCode: 301 },
    { source: `${source}/`, destination, statusCode: 301 },
  ]
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  skipTrailingSlashRedirect: true,

  async redirects() {
    return [
      ...redirectionsSimples.flatMap(([source, destination]) => paire(source, destination)),

      ...supportsDeCommunication.flatMap((page) =>
        paire(`/support-de-communication/${page}`, '/fr/metiers/objets#display')
      ),
      ...paire('/support-de-communication', '/fr/metiers/objets#display'),
      {
        source: '/support-de-communication/:chemin+',
        destination: '/fr/metiers/objets#display',
        statusCode: 301,
      },

      ...panneauxWordpress.flatMap(([wordpress, nouveau]) =>
        paire(`/panneaux/${wordpress}`, `/fr/media/emplacements/${nouveau}`)
      ),
      /* Repli documenté : tout slug WordPress non recensé aboutit à la
         liste des emplacements, jamais à un slug deviné. */
      ...paire('/panneaux', '/fr/media/emplacements'),
      {
        source: '/panneaux/:chemin+',
        destination: '/fr/media/emplacements',
        statusCode: 301,
      },
    ]
  },
}

export default nextConfig
