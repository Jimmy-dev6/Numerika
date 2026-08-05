/**
 * Traitement des médias sources (étape 15 bis, passe A).
 *
 *   node scripts/traiter-images.mjs            → images seulement
 *   FFMPEG=chemin/ffmpeg.exe node scripts/traiter-images.mjs --videos
 *
 * Lit assets-sources/ (hors git, ~400 Mo — voir .gitignore) :
 *   panneaux/{slug}.jpg          photos nommées par slug figé
 *   realisations/{nom}.jpg|png   portfolio + uploads client
 *   videos/{slug}.mp4            vidéos drone nommées par slug + atelier.mp4
 *
 * Écrit :
 *   public/images/{categorie}/{nom}-{largeur}.avif + .webp
 *     largeurs 640 / 1280 / 1920, bornées à la largeur intrinsèque
 *     (jamais d'agrandissement ; une variante à l'intrinsèque si aucune
 *     largeur standard ne l'atteint, sauf écart < 10 %)
 *   public/videos/{nom}.mp4      H.264 1080p max, muet (les vidéos jouent
 *     muted partout), +faststart — les 4K du site pesaient 343 Mo au
 *     total, injouables sur mobile ; ffmpeg portable requis (--videos)
 *   public/videos/{nom}-poster.jpg  frame à 1 s (évite les fondus noirs)
 *   content/images.gen.ts        manifeste typé : dimensions intrinsèques
 *     lues des fichiers → ratios exacts, zéro CLS. NE PAS ÉDITER À LA MAIN.
 *
 * Idempotent : une sortie plus récente que sa source n'est pas refaite.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const RACINE = path.join(import.meta.dirname, '..')
const SOURCES = path.join(RACINE, 'assets-sources')
const SORTIE_IMAGES = path.join(RACINE, 'public', 'images')
const SORTIE_VIDEOS = path.join(RACINE, 'public', 'videos')
const MANIFESTE = path.join(RACINE, 'content', 'images.gen.ts')

/* 960 : la largeur utile des mobiles courants (~412 px CSS × DPR 1.75-2) —
   sans elle le navigateur saute de 640 à 1280 et télécharge le double. */
const LARGEURS = [640, 960, 1280, 1920]
const CATEGORIES = ['panneaux', 'realisations']
const AVEC_VIDEOS = process.argv.includes('--videos')
const FFMPEG = process.env.FFMPEG || 'ffmpeg'

const aRefaire = (source, sortie) =>
  !existsSync(sortie) || statSync(sortie).mtimeMs < statSync(source).mtimeMs

/* ————— Images ————— */
const manifeste = {}

for (const categorie of CATEGORIES) {
  const dossier = path.join(SOURCES, categorie)
  if (!existsSync(dossier)) continue
  mkdirSync(path.join(SORTIE_IMAGES, categorie), { recursive: true })

  for (const fichier of readdirSync(dossier).sort()) {
    if (!/\.(jpe?g|png|webp)$/i.test(fichier)) continue
    const source = path.join(dossier, fichier)
    const nom = fichier.replace(/\.[^.]+$/, '')
    const meta = await sharp(source).metadata()

    let largeurs = LARGEURS.filter((l) => l < meta.width)
    const plafond = Math.min(meta.width, 1920)
    if (largeurs.length === 0 || plafond > (largeurs.at(-1) ?? 0) * 1.1) {
      largeurs.push(plafond)
    }

    for (const largeur of largeurs) {
      const base = path.join(SORTIE_IMAGES, categorie, `${nom}-${largeur}`)
      const tube = sharp(source).resize({ width: largeur })
      if (aRefaire(source, `${base}.avif`)) {
        await tube.clone().avif({ quality: 55 }).toFile(`${base}.avif`)
      }
      if (aRefaire(source, `${base}.webp`)) {
        await tube.clone().webp({ quality: 78 }).toFile(`${base}.webp`)
      }
    }

    manifeste[`${categorie}/${nom}`] = {
      largeur: meta.width,
      hauteur: meta.height,
      largeurs,
    }
    process.stdout.write(`\rimages : ${Object.keys(manifeste).length}   `)
  }
}
console.log()

/* ————— Vidéos ————— */
const videosManifeste = {}
const dossierVideos = path.join(SOURCES, 'videos')
if (existsSync(dossierVideos)) {
  mkdirSync(SORTIE_VIDEOS, { recursive: true })
  for (const fichier of readdirSync(dossierVideos).sort()) {
    if (!/\.mp4$/i.test(fichier)) continue
    const source = path.join(dossierVideos, fichier)
    const nom = fichier.replace(/\.mp4$/i, '')
    const sortie = path.join(SORTIE_VIDEOS, `${nom}.mp4`)
    const poster = path.join(SORTIE_VIDEOS, `${nom}-poster.jpg`)

    if (AVEC_VIDEOS && aRefaire(source, sortie)) {
      execFileSync(FFMPEG, [
        '-y', '-i', source,
        '-vf', "scale='min(1920,iw)':-2:flags=lanczos,fps=30",
        '-c:v', 'libx264', '-crf', '27', '-preset', 'medium',
        '-an', '-movflags', '+faststart',
        sortie,
      ], { stdio: ['ignore', 'ignore', 'inherit'] })
    }
    if (AVEC_VIDEOS && aRefaire(source, poster)) {
      /* 1280 de large, qualité 7 : le poster porte le LCP des fiches —
         qualité maximale = 100-220 Ko et Lighthouse sous 95 (mesuré). */
      execFileSync(FFMPEG, [
        '-y', '-ss', '1', '-i', sortie,
        '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '7', poster,
      ], { stdio: ['ignore', 'ignore', 'inherit'] })
    }
    if (existsSync(sortie)) {
      videosManifeste[nom] = { poster: existsSync(poster) }
      console.log(`vidéo : ${nom} (${Math.round(statSync(sortie).size / 1024 / 1024)} Mo)`)
    }
  }
}

/* ————— Manifeste ————— */
const lignes = Object.entries(manifeste)
  .map(([cle, v]) => `  '${cle}': { largeur: ${v.largeur}, hauteur: ${v.hauteur}, largeurs: [${v.largeurs.join(', ')}] },`)
  .join('\n')
const lignesVideos = Object.entries(videosManifeste)
  .map(([cle, v]) => `  '${cle}': { poster: ${v.poster} },`)
  .join('\n')

writeFileSync(
  MANIFESTE,
  `/**
 * GÉNÉRÉ par scripts/traiter-images.mjs — NE PAS ÉDITER À LA MAIN.
 * Dimensions intrinsèques lues des fichiers sources : elles nourrissent
 * les ratios (aspect-ratio, width/height) et évitent tout CLS.
 * Toute image rendue par le site DOIT venir de ce manifeste.
 */

export type ImageGen = {
  /** Largeur intrinsèque de la source, en px. */
  largeur: number
  hauteur: number
  /** Variantes générées en AVIF + WebP : /images/{cle}-{l}.avif|webp */
  largeurs: number[]
}

export const imagesGen = {
${lignes}
} as const satisfies Record<string, ImageGen>

export type CleImage = keyof typeof imagesGen

/** Vidéos H.264 muettes : /videos/{cle}.mp4 (+ -poster.jpg si poster). */
export const videosGen = {
${lignesVideos}
} as const

export type CleVideo = keyof typeof videosGen
`
)
console.log(`manifeste : ${Object.keys(manifeste).length} images, ${Object.keys(videosManifeste).length} vidéos`)
