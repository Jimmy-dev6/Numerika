'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { panneaux } from '@/content/panneaux'

/**
 * Sélection multiple d'emplacements (étape 4, consigne 4).
 * Survit à la navigation entre liste et fiches via sessionStorage :
 * c'est une session de travail, jamais localStorage (donnée non durable).
 * Seuls des slugs d'emplacements connus sont acceptés, jamais de réseaux.
 */
const CLE_STOCKAGE = 'numerika-selection-emplacements'

const slugsAutorises = new Set(
  panneaux.filter((p) => p.categorie === 'emplacement').map((p) => p.slug)
)

type Selection = {
  slugs: string[]
  basculer: (slug: string) => void
  vider: () => void
}

const SelectionContexte = createContext<Selection | null>(null)

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([])
  const charge = useRef(false)

  useEffect(() => {
    try {
      const brut = sessionStorage.getItem(CLE_STOCKAGE)
      if (brut) {
        const lus: unknown = JSON.parse(brut)
        if (Array.isArray(lus)) {
          setSlugs(lus.filter((s): s is string => typeof s === 'string' && slugsAutorises.has(s)))
        }
      }
    } catch {
      /* stockage indisponible : la sélection reste en mémoire */
    }
    charge.current = true
  }, [])

  useEffect(() => {
    if (!charge.current) return
    try {
      sessionStorage.setItem(CLE_STOCKAGE, JSON.stringify(slugs))
    } catch {
      /* idem */
    }
  }, [slugs])

  const basculer = useCallback((slug: string) => {
    if (!slugsAutorises.has(slug)) return
    setSlugs((actuels) =>
      actuels.includes(slug) ? actuels.filter((s) => s !== slug) : [...actuels, slug]
    )
  }, [])

  const vider = useCallback(() => setSlugs([]), [])

  return (
    <SelectionContexte.Provider value={{ slugs, basculer, vider }}>
      {children}
    </SelectionContexte.Provider>
  )
}

export function useSelection(): Selection {
  const contexte = useContext(SelectionContexte)
  if (!contexte) {
    throw new Error('useSelection doit être utilisé sous <SelectionProvider> (layout /media)')
  }
  return contexte
}
