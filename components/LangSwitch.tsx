'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ui } from '@/content/ui'
import type { Locale } from '@/lib/i18n'

/** Bascule de langue : mène à la même page dans l'autre locale. */
export function LangSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? `/${locale}`
  const autre: Locale = locale === 'fr' ? 'en' : 'fr'
  const cible = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${autre}`)

  return (
    <Link
      href={cible}
      lang={autre}
      hrefLang={autre}
      aria-label={ui.changerLangue[locale]}
      className="data border border-line px-3 py-2 text-fg-soft transition-colors hover:text-fg"
    >
      {autre.toUpperCase()}
    </Link>
  )
}
