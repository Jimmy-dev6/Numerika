'use client'

import { Map as MapLibre, Marker, NavigationControl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useRef } from 'react'
import { useSurbrillance } from '@/components/media/SurbrillanceContext'
import { media } from '@/content/media'
import { disponibilite, type Panneau } from '@/content/panneaux'
import { site } from '@/content/site'
import type { Locale } from '@/lib/i18n'

/**
 * Carte MapLibre de l'inventaire (étape 5). Chargée dynamiquement,
 * jamais dans le bundle initial.
 * Fond Carto Dark Matter : libre d'utilisation avec attribution (affichée
 * par MapLibre depuis les métadonnées du style), sans clé exposée.
 * Seuls les emplacements avec coords non-null produisent un marqueur ;
 * aucune coordonnée n'est inventée ni géocodée (consigne 2). Le siège
 * Numerika sert de point de référence visuel distinct (carré jaune).
 */
const STYLE_SOMBRE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
/** Centre de Dakar (brief §6.2), en [lng, lat]. */
const CENTRE: [number, number] = [-17.4677, 14.7167]
const ZOOM_INITIAL = 11

export function CarteMap({
  panneaux,
  maintenantIso,
  locale,
}: {
  panneaux: Panneau[]
  maintenantIso: string
  locale: Locale
}) {
  const conteneur = useRef<HTMLDivElement>(null)
  const carte = useRef<MapLibre | null>(null)
  const marqueurs = useRef(new Map<string, { marqueur: Marker; element: HTMLElement }>())
  const { survole, setActif } = useSurbrillance()
  const survoleRef = useRef<string | null>(survole)

  useEffect(() => {
    if (!conteneur.current || carte.current) return

    const m = new MapLibre({
      container: conteneur.current,
      style: STYLE_SOMBRE,
      center: CENTRE,
      zoom: ZOOM_INITIAL,
    })
    m.addControl(new NavigationControl({ showCompass: false }), 'top-right')

    /* Point de référence : le siège, pas un panneau. */
    const siege = document.createElement('div')
    siege.className = 'marqueur-siege'
    siege.title = media.carte.siege[locale]
    new Marker({ element: siege })
      .setLngLat([site.adresse.coords.lng, site.adresse.coords.lat])
      .addTo(m)

    carte.current = m
    return () => {
      m.remove()
      carte.current = null
      marqueurs.current.clear()
    }
    // locale ne change jamais sans navigation complète
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* (Re)construction des marqueurs quand la liste filtrée change :
     un panneau filtré disparaît de la carte comme de la liste. */
  useEffect(() => {
    const m = carte.current
    if (!m) return

    for (const { marqueur } of marqueurs.current.values()) marqueur.remove()
    marqueurs.current.clear()

    const avecCoords = panneaux.filter((p) => p.coords !== null)
    if (avecCoords.length === 0) return

    /* Échelle racine carrée (consigne 3) : le 210 000 n'écrase pas tout. */
    const racines = avecCoords.map((p) => Math.sqrt(p.vuesJour ?? 0))
    const min = Math.min(...racines)
    const max = Math.max(...racines)
    const maintenant = new Date(maintenantIso)

    for (const p of avecCoords) {
      const coords = p.coords
      if (!coords) continue
      const part = max > min ? (Math.sqrt(p.vuesJour ?? 0) - min) / (max - min) : 0.5
      const taille = Math.round(14 + 18 * part)
      const libre = disponibilite(p, maintenant) === 'libre'

      const element = document.createElement('button')
      element.type = 'button'
      element.className = `marqueur ${libre ? 'marqueur-libre' : 'marqueur-occupe'}`
      element.style.width = `${taille}px`
      element.style.height = `${taille}px`
      element.setAttribute('aria-label', p.nom[locale])
      if (survoleRef.current === p.slug) element.classList.add('marqueur-surbrillance')
      element.addEventListener('click', () => {
        setActif(p.slug)
        const cible = document.getElementById(`emplacement-${p.slug}`)
        const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        cible?.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'center' })
      })

      const marqueur = new Marker({ element })
        .setLngLat([coords.lng, coords.lat])
        .addTo(m)
      marqueurs.current.set(p.slug, { marqueur, element })
    }
  }, [panneaux, maintenantIso, locale, setActif])

  /* Surbrillance liste → carte. Jamais de transform : MapLibre positionne
     les marqueurs par transform, on ne peut qu'ajouter un contour. */
  useEffect(() => {
    survoleRef.current = survole
    for (const [slug, { element }] of marqueurs.current) {
      element.classList.toggle('marqueur-surbrillance', slug === survole)
    }
  }, [survole])

  return <div ref={conteneur} className="h-full w-full" />
}

export default CarteMap
