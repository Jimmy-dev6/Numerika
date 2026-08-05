'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n'

/**
 * Compteur animé (étape 15 bis, passe B) : 800 ms, une seule fois, à
 * l'entrée dans le viewport. Le rendu serveur affiche la valeur FINALE —
 * sans JavaScript ou en mouvement réduit, la donnée vraie est là
 * d'emblée, rien ne compte. Règle SI respectée : le formatage passe par
 * toLocaleString et les unités arrivent par `suffixe` sans uppercase.
 * Seule petite animation en JS du site (un compteur ne se fait pas en
 * CSS) : requestAnimationFrame nu, aucune bibliothèque.
 */
export function Compteur({
  valeur,
  locale,
  decimales = 0,
  /** false pour les années : « 2008 », jamais « 2 008 ». */
  groupement = true,
  prefixe = '',
  suffixe = '',
  /** Décalage du départ (ms) — ex. après le fondu du hero /media. */
  delaiMs = 0,
}: {
  valeur: number
  locale: Locale
  decimales?: number
  groupement?: boolean
  prefixe?: string
  suffixe?: string
  delaiMs?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [affichee, setAffichee] = useState(valeur)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return

    let raf = 0
    let minuteur = 0
    const io = new IntersectionObserver(
      (entrees) => {
        if (!entrees.some((e) => e.isIntersecting)) return
        io.disconnect()
        minuteur = window.setTimeout(() => {
          const depart = performance.now()
          const pas = (t: number) => {
            const p = Math.min((t - depart) / 800, 1)
            const ease = 1 - Math.pow(1 - p, 3)
            setAffichee(valeur * ease)
            if (p < 1) raf = requestAnimationFrame(pas)
          }
          raf = requestAnimationFrame(pas)
        }, delaiMs)
      },
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(minuteur)
      cancelAnimationFrame(raf)
    }
  }, [valeur, delaiMs])

  const texte = affichee.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
    useGrouping: groupement,
  })

  return (
    <span ref={ref}>
      {prefixe}
      {texte}
      {suffixe}
    </span>
  )
}
