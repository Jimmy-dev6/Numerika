'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ui } from '@/content/ui'
import type { Locale } from '@/lib/i18n'

/**
 * Error boundary (étape 14) : un échec de rendu ou de chargement de chunk
 * ne laisse jamais d'écran blanc. Même régime éditorial que le site.
 */
export default function Erreur({ reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname()
  const locale: Locale = pathname?.startsWith('/en') ? 'en' : 'fr'

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-grid flex-col items-start justify-center gap-6 px-6 py-24">
      <h1 className="expanded font-display text-display-l font-bold">{ui.erreur[locale]}</h1>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-btn bg-fg px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-85"
        >
          {ui.reessayer[locale]}
        </button>
        <Link
          href={`/${locale}`}
          className="underline underline-offset-4 transition-colors hover:text-red"
        >
          {ui.retourAccueil[locale]}
        </Link>
      </div>
    </main>
  )
}
