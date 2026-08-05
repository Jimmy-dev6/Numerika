'use client'

import { useEffect } from 'react'

/**
 * Observateur global de révélation (étape 15 bis, passe B).
 *
 * Les composants serveur posent simplement `data-revele` (bloc seul) ou
 * `data-revele-groupe` (cascade des enfants directs, 60 ms d'écart,
 * plafonnée à 600 ms) — aucun composant client par section. Ici, un
 * unique IntersectionObserver flippe l'attribut à « fait » à l'entrée
 * dans le viewport, une seule fois par élément ; le mouvement lui-même
 * est du CSS pur (globals.css), doublement gaté html.js +
 * prefers-reduced-motion. Un MutationObserver rattrape les éléments
 * ajoutés par les navigations client (App Router).
 *
 * En mouvement réduit, on ne fait RIEN : les règles CSS ne masquent
 * rien, flipper les attributs serait du travail pour rien.
 */
export function Reveles() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          if (!entree.isIntersecting) continue
          const el = entree.target
          if (el.hasAttribute('data-revele-groupe')) {
            Array.from(el.children).forEach((enfant, i) => {
              ;(enfant as HTMLElement).style.setProperty(
                '--rd',
                `${Math.min(i * 60, 600)}ms`
              )
            })
            el.setAttribute('data-revele-groupe', 'fait')
          } else {
            el.setAttribute('data-revele', 'fait')
          }
          io.unobserve(el)
        }
      },
      { threshold: 0.12 }
    )

    const balayer = () => {
      const cibles = document.querySelectorAll(
        "[data-revele]:not([data-revele='fait']), [data-revele-groupe]:not([data-revele-groupe='fait'])"
      )
      cibles.forEach((el) => io.observe(el))
    }

    balayer()

    /* Navigations App Router : le nouveau contenu arrive sans rechargement. */
    let rafPrevu = 0
    const mo = new MutationObserver(() => {
      if (rafPrevu) return
      rafPrevu = requestAnimationFrame(() => {
        rafPrevu = 0
        balayer()
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      io.disconnect()
      if (rafPrevu) cancelAnimationFrame(rafPrevu)
    }
  }, [])

  return null
}
