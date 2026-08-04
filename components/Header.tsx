import Link from 'next/link'
import { LangSwitch } from '@/components/LangSwitch'
import { site } from '@/content/site'
import { ui } from '@/content/ui'
import type { Locale } from '@/lib/i18n'

/**
 * En-tête. La navigation reste visible à toutes les tailles (pas de menu
 * enterré) : logo en première ligne, liens en seconde ligne sur mobile.
 */
export function Header({ locale }: { locale: Locale }) {
  return (
    <header className="border-b border-line bg-bg">
      <div className="mx-auto flex max-w-grid flex-wrap items-center gap-x-8 gap-y-4 px-6 py-5">
        <Link
          href={`/${locale}`}
          className="expanded mr-auto font-display text-xl font-bold tracking-tight"
        >
          NUMERIKA
        </Link>

        <nav aria-label={ui.navPrincipale[locale]} className="order-last w-full md:order-none md:w-auto">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {site.navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={`/${locale}${item.href}`}
                  className="text-fg-soft transition-colors hover:text-fg"
                >
                  {item.label[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}${site.devis.href}`}
            className="rounded-btn bg-fg px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-85"
          >
            {site.devis.label[locale]}
          </Link>
          <LangSwitch locale={locale} />
        </div>
      </div>
    </header>
  )
}
