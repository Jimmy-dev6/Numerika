'use client'

import { createContext, useContext, useState } from 'react'

/**
 * Synchronisation carte-liste (étape 5, consigne 4).
 * survole : slug de la carte de liste survolée ou focalisée → le marqueur
 * correspondant passe en surbrillance.
 * actif : slug du marqueur cliqué → la carte de liste correspondante est
 * mise en surbrillance et défilée en vue.
 */
type Surbrillance = {
  survole: string | null
  setSurvole: (slug: string | null) => void
  actif: string | null
  setActif: (slug: string | null) => void
}

const SurbrillanceContexte = createContext<Surbrillance | null>(null)

export function SurbrillanceProvider({ children }: { children: React.ReactNode }) {
  const [survole, setSurvole] = useState<string | null>(null)
  const [actif, setActif] = useState<string | null>(null)

  return (
    <SurbrillanceContexte.Provider value={{ survole, setSurvole, actif, setActif }}>
      {children}
    </SurbrillanceContexte.Provider>
  )
}

export function useSurbrillance(): Surbrillance {
  const contexte = useContext(SurbrillanceContexte)
  if (!contexte) {
    throw new Error('useSurbrillance doit être utilisé sous <SurbrillanceProvider>')
  }
  return contexte
}
