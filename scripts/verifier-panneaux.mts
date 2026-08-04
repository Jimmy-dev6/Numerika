/**
 * Vérifications de cohérence de l'inventaire (validation étape 3).
 * Exécution : npm run verifier:panneaux (Node 24 exécute le TypeScript
 * nativement, d'où les imports relatifs dans content/panneaux.ts).
 * Sort avec un code non nul si une vérification échoue.
 */
import { disponibilite, panneaux, type Panneau } from '../content/panneaux.ts'

let echecs = 0

function verifier(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  ok      ${message}`)
  } else {
    echecs++
    console.error(`  ÉCHEC   ${message}`)
  }
}

console.log('— Inventaire —')

const emplacements = panneaux.filter((p) => p.categorie === 'emplacement')
const reseaux = panneaux.filter((p) => p.categorie === 'reseau')

/* Le tableau du brief §7.3 compte 23 emplacements uniques (vérifiable par
   la somme des trafics : 3 375 000 vues/jour, chiffre cité au brief) et
   4 réseaux, soit 27 entrées — cohérent avec les « 27 fiches panneau »
   de l'architecture §5. */
verifier(emplacements.length === 23, `23 emplacements uniques (trouvé : ${emplacements.length})`)
verifier(reseaux.length === 4, `4 réseaux (trouvé : ${reseaux.length})`)
verifier(panneaux.length === 27, `27 entrées au total (trouvé : ${panneaux.length})`)

const sommeVues = emplacements.reduce((somme, p) => somme + (p.vuesJour ?? 0), 0)
verifier(
  sommeVues === 3_375_000,
  `somme des trafics = 3 375 000 vues/jour, comme au brief (trouvé : ${sommeVues.toLocaleString('fr-FR')})`
)

const slugs = panneaux.map((p) => p.slug)
verifier(new Set(slugs).size === slugs.length, 'slugs tous uniques')
verifier(
  slugs.every((s) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)),
  'slugs en minuscules, sans accents, tirets simples'
)

verifier(
  panneaux.every((p) => p.largeurM > 0 && p.hauteurM > 0),
  'largeurM et hauteurM strictement positifs partout'
)

function dateIsoValide(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date))
}
verifier(
  panneaux.every((p) => p.libreLe === null || dateIsoValide(p.libreLe)),
  'libreLe : null ou date ISO valide partout'
)

verifier(
  reseaux.every((p) => p.vuesJour === null && p.coords === null && p.libreLe === null),
  'réseaux : vuesJour, coords et libreLe à null (jamais sur la carte, étape 5)'
)

verifier(
  emplacements.every((p) => typeof p.vuesJour === 'number' && p.vuesJour > 0),
  'emplacements : vuesJour renseigné partout (estimations Numerika)'
)

console.log('— disponibilite() —')

function panneauTest(libreLe: string | null): Panneau {
  return {
    slug: 'test',
    nom: { fr: 'test', en: 'test' },
    zone: 'test',
    ville: 'test',
    categorie: 'emplacement',
    type: null,
    largeurM: 1,
    hauteurM: 1,
    faces: 'recto',
    support: null,
    vuesJour: 1,
    coords: null,
    mapsUrl: null,
    video: null,
    images: [],
    libreLe,
  }
}

const ref = new Date('2026-08-04')
verifier(disponibilite(panneauTest(null), ref) === 'libre', 'libreLe null → libre')
verifier(disponibilite(panneauTest('2026-07-31'), ref) === 'libre', 'date passée → libre')
verifier(disponibilite(panneauTest('2027-06-30'), ref) === 'occupe', 'date future → occupe')
verifier(disponibilite(panneauTest('2026-08-04'), ref) === 'libre', 'date du jour (≤ ref) → libre')

console.log(
  echecs === 0
    ? `\nTout est cohérent : ${panneaux.length} entrées (${emplacements.length} emplacements, ${reseaux.length} réseaux).`
    : `\n${echecs} vérification(s) en échec.`
)
process.exit(echecs === 0 ? 0 : 1)
