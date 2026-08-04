import { notFound } from 'next/navigation'
import { Container } from '@/components/Container'
import { Cote } from '@/components/Cote'
import { WhatsAppCTA } from '@/components/WhatsAppCTA'
import type { Locale } from '@/lib/i18n'

/**
 * Démo de validation isolée du composant <Cote> (étape 2).
 * Exclue du build de production : notFound() en prod, la page n'existe
 * qu'en développement. Les valeurs affichées sont des dimensions réelles
 * de l'inventaire régie (brief §7.3) — jamais de cote inventée, même ici.
 */
export default function DemoCote({ params }: { params: { locale: Locale } }) {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <main className="py-16">
      <Container>
        <p className="data text-fg-soft">Dev — étape 2</p>
        <h1 className="expanded mt-4 font-display text-display-m font-bold">
          Composant Cote — les quatre positions, les deux régimes
        </h1>
        <p className="mt-4 max-w-2xl text-fg-soft">
          Chaque cadre reproduit les proportions réelles du panneau dont il porte les cotes. Le
          trait se dessine une seule fois à l&apos;entrée dans le viewport. Activer «&nbsp;réduire
          les animations&nbsp;» dans l&apos;OS pour vérifier le rendu statique.
        </p>

        {/* Régime Production */}
        <div className="mt-12 grid gap-16 md:grid-cols-2">
          <figure>
            <div className="relative aspect-[20/8] border border-line bg-surface">
              <Cote valeur="20,00 m" position="top" />
              <Cote valeur="8,00 m" position="right" />
            </div>
            <figcaption className="mt-6 text-sm text-fg-soft">
              Autoroute, face RN1 — positions top et right
            </figcaption>
          </figure>
          <figure>
            <div className="relative aspect-[17/8] border border-line bg-surface">
              <Cote valeur="17,00 m" position="bottom" />
              <Cote valeur="8,00 m" position="left" />
            </div>
            <figcaption className="mt-6 text-sm text-fg-soft">
              Autoroute, sens AIBD vers Dakar — positions bottom et left
            </figcaption>
          </figure>
        </div>
      </Container>

      {/* Régime Media — mêmes composants, tokens hérités via la bascule */}
      <section data-mode="media" className="mt-16 bg-bg py-16 text-fg">
        <Container>
          <p className="data text-accent">Numerika Media — mode nuit</p>
          <div className="mt-12 grid gap-16 md:grid-cols-2">
            <figure>
              <div className="relative aspect-[1498/793] border border-line bg-surface">
                <Cote valeur="14,98 m" position="top" />
                <Cote valeur="7,93 m" position="right" />
              </div>
              <figcaption className="mt-6 text-sm text-fg-soft">
                Autoroute, sens Dakar vers AIBD — positions top et right
              </figcaption>
            </figure>
            <figure>
              <div className="relative aspect-[880/450] border border-line bg-surface">
                <Cote valeur="8,80 m" position="bottom" />
                <Cote valeur="4,50 m" position="left" />
              </div>
              <figcaption className="mt-6 text-sm text-fg-soft">
                Almadies, au-dessus station Shell — positions bottom et left
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      {/* Vérification WhatsAppCTA (validation étape 2) : message contextuel
          nommant un emplacement réel, comme sur une future fiche panneau. */}
      <Container className="py-16">
        <p className="data text-fg-soft">Vérification WhatsAppCTA</p>
        <div className="mt-6">
          <WhatsAppCTA
            locale={params.locale}
            message="Bonjour, je souhaite des informations sur l'emplacement Autoroute, face RN1 (20,00 × 8,00 m)."
          />
        </div>
      </Container>
    </main>
  )
}
