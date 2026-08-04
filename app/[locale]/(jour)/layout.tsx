import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { Locale } from '@/lib/i18n'

/** Régime Production (brief §4.2) : papier, encre, lumière du jour. */
export default function JourLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const locale = params.locale as Locale

  return (
    <>
      <Header locale={locale} />
      <div className="flex-1">{children}</div>
      <Footer locale={locale} />
    </>
  )
}
