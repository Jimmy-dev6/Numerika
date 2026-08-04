/**
 * Vérification programmatique des contrastes WCAG AA (étape 14) sur les
 * paires réellement utilisées dans les deux régimes (brief §9).
 * Exécution : node scripts/verifier-contrastes.mts
 * Seuils : 4.5 pour le texte, 3 pour les composants d'interface (pastilles).
 */

function luminance(hex: string): number {
  const canaux = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }) as [number, number, number]
  const [r, g, b] = canaux
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contraste(a: string, b: string): number {
  const [clair, sombre] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return ((clair as number) + 0.05) / ((sombre as number) + 0.05)
}

type Paire = [string, string, string, number]

const paires: Paire[] = [
  /* Régime Production */
  ['#111111', '#FBFAF7', 'ink / paper — texte principal jour', 4.5],
  ['#5A5A56', '#FBFAF7', 'ink-soft / paper — texte secondaire jour', 4.5],
  ['#5A5A56', '#FFFFFF', 'ink-soft / surface — texte secondaire sur carte', 4.5],
  ['#E0261F', '#FBFAF7', 'red / paper — liens au survol', 4.5],
  ['#FBFAF7', '#111111', 'bg / fg — texte des boutons pleins jour', 4.5],

  /* Régime Media */
  ['#FFFFFF', '#0B0F14', 'blanc / night — texte principal nuit', 4.5],
  ['#98A1AD', '#0B0F14', 'night-fg-soft / night — texte secondaire nuit', 4.5],
  ['#98A1AD', '#161C24', 'night-fg-soft / night-soft — secondaire sur carte', 4.5],
  ['#FFC400', '#0B0F14', 'signal / night — données mono, jamais texte courant', 4.5],
  ['#FFC400', '#161C24', 'signal / night-soft', 4.5],
  ['#0B0F14', '#FFFFFF', 'night / blanc — texte des boutons pleins nuit', 4.5],

  /* Composants d'interface (seuil 3) : pastilles de disponibilité,
     marqueurs de carte. Les pastilles n'existent QU'EN régime nuit.
     INTERDICTION documentée (étape 14) : --libre (#3DBE6B) sur fond clair
     mesure 2.39, sous le seuil UI de 3 — ne jamais poser une pastille de
     disponibilité sur fond jour sans bordure sombre. Les marqueurs de la
     carte portent une bordure blanche 2px qui fait le travail. */
  ['#3DBE6B', '#161C24', 'libre / night-soft — pastille', 3],
  ['#7A8290', '#161C24', 'occupe / night-soft — pastille', 3],
]

let echecs = 0
for (const [avant, arriere, description, seuil] of paires) {
  const ratio = contraste(avant, arriere)
  const ok = ratio >= seuil
  if (!ok) echecs++
  console.log(
    `${ok ? '  ok    ' : '  ÉCHEC '} ${ratio.toFixed(2).padStart(5)} (seuil ${seuil})  ${description}`
  )
}

console.log(echecs === 0 ? '\nToutes les paires passent.' : `\n${echecs} paire(s) sous le seuil.`)
process.exit(echecs === 0 ? 0 : 1)
