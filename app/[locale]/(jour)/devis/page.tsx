import type { Metadata } from 'next'
import { Container } from '@/components/Container'
import { FormulaireDevis } from '@/components/FormulaireDevis'
import { formulaires } from '@/content/formulaires'
import { panneaux } from '@/content/panneaux'
import { formatDimensions } from '@/lib/format'
import type { Locale } from '@/lib/i18n'
import { seoAlternates } from '@/lib/seo'

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  return {
    title: formulaires.devis.titre[params.locale],
    description: formulaires.devis.metaDescription[params.locale],
    alternates: seoAlternates(params.locale, '/devis'),
  }
}

/**
 * Demande de devis (brief §6.6, étape 11).
 * Pré-remplissage régie : ?panneaux=slug1,slug2 depuis la barre de
 * sélection de l'inventaire. Slugs invalides ignorés silencieusement ;
 * la sélection résolue s'affiche en récapitulatif non éditable et part
 * dans le payload.
 */
export default function Devis({
  params,
  searchParams,
}: {
  params: { locale: Locale }
  searchParams: Record<string, string | string[] | undefined>
}) {
  const { locale } = params

  const brut = typeof searchParams.panneaux === 'string' ? searchParams.panneaux : ''
  const slugs = brut.split(',').filter(Boolean)
  const selection = panneaux
    .filter((p) => p.categorie === 'emplacement' && slugs.includes(p.slug))
    .map((p) => ({
      slug: p.slug,
      libelle: `${p.nom[locale]} (${formatDimensions(p.largeurM, p.hauteurM, locale)})`,
    }))

  return (
    <main>
      <Container className="py-16">
        <h1 className="expanded font-display text-display-l font-bold">
          {formulaires.devis.titre[locale]}
        </h1>
        <div className="mt-10">
          <FormulaireDevis locale={locale} selection={selection} />
        </div>
      </Container>
    </main>
  )
}
