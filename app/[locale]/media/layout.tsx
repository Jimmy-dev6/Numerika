import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { BarreSelection } from '@/components/media/BarreSelection'
import { SelectionProvider } from '@/components/media/SelectionContext'
import type { Locale } from '@/lib/i18n'

/**
 * Régime Media (brief §4.2) : la ville la nuit. La bascule est franche,
 * pas un dégradé : data-mode="media" redéfinit les variables sémantiques
 * pour tout le sous-arbre, en-tête et pied de page compris, côté serveur,
 * sans JavaScript. La sélection multiple vit ici pour survivre à la
 * navigation entre liste et fiches.
 */
export default function MediaLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const locale = params.locale as Locale

  return (
    <div data-mode="media" className="flex flex-1 flex-col bg-bg text-fg">
      <SelectionProvider>
        <Header locale={locale} />
        <div className="flex-1">{children}</div>
        <Footer locale={locale} />
        <BarreSelection locale={locale} />
      </SelectionProvider>
    </div>
  )
}
