'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WhatsAppCTA } from '@/components/WhatsAppCTA'
import { formulaires } from '@/content/formulaires'
import { ui } from '@/content/ui'
import type { Locale } from '@/lib/i18n'

/**
 * Contenu de la 404 (étape 14). not-found.tsx ne reçoit pas les params :
 * la langue se déduit du chemin côté client, repli sur le français.
 */
export function PageIntrouvable() {
  const pathname = usePathname()
  const locale: Locale = pathname?.startsWith('/en') ? 'en' : 'fr'

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-grid flex-col items-start justify-center gap-6 px-6 py-24">
      <p className="data text-fg-soft">404</p>
      <h1 className="expanded font-display text-display-l font-bold">{ui.introuvable[locale]}</h1>
      <div className="flex flex-wrap gap-x-8 gap-y-2">
        <Link
          href={`/${locale}`}
          className="underline underline-offset-4 transition-colors hover:text-red"
        >
          {ui.retourAccueil[locale]}
        </Link>
        <Link
          href={`/${locale}/media/emplacements`}
          className="underline underline-offset-4 transition-colors hover:text-red"
        >
          {ui.voirInventaire[locale]}
        </Link>
      </div>
      <WhatsAppCTA locale={locale} message={formulaires.contact.whatsapp[locale]} />
    </main>
  )
}
