import type { Metadata } from 'next'
import { BandeChiffres } from '@/components/BandeChiffres'
import { Container } from '@/components/Container'
import { GrilleReferences } from '@/components/GrilleReferences'
import { entreprise, machines } from '@/content/entreprise'
import type { Locale } from '@/lib/i18n'
import { seoAlternates } from '@/lib/seo'

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  return {
    title: entreprise.meta.titre[params.locale],
    description: entreprise.recit[0]?.[params.locale],
    alternates: seoAlternates(params.locale, '/entreprise'),
  }
}

/*
 * JSON-LD Organization (étape 12) consommera, sans refonte de cette page :
 *   foundingDate      → site.fondee (2008)
 *   numberOfEmployees → site.collaborateurs (60)
 *   address           → site.adresse (rue, ville, pays, coords ;
 *                       km 2,5 / km 3 toujours À CONFIRMER)
 *   telephone         → site.telephones[0]
 *   sameAs            → site.reseaux (facebook, instagram, linkedin —
 *                       jamais l'homonyme tunisien)
 * NE PAS poser le script ici avant l'étape 12.
 */

/** Page entreprise (brief §6.3, étape 10) : le récit s'appuie sur des
    faits, pas des adjectifs. Photos d'atelier à venir (asset n°1) :
    substitutions assumées aux points prévus du gabarit. */
export default function Entreprise({ params }: { params: { locale: Locale } }) {
  const { locale } = params

  return (
    <main>
      <Container className="py-16">
        {/* Ouverture — entreprise.photos.ouverture (null, asset n°1) */}
        <div className="aspect-[21/9] border border-line bg-surface" aria-hidden />

        <h1 className="expanded mt-10 font-display text-display-l font-bold">
          {entreprise.titre[locale]}
        </h1>

        <div className="mt-6 max-w-2xl space-y-5">
          {entreprise.recit.map((paragraphe) => (
            <p key={paragraphe.fr}>{paragraphe[locale]}</p>
          ))}
        </div>
      </Container>

      {/* Photo de récit — entreprise.photos.recit (null, asset n°1) */}
      <Container>
        <div className="aspect-[21/9] border border-line bg-surface" aria-hidden />
      </Container>

      <Container className="py-16">
        <h2 className="expanded font-display text-display-m font-bold">
          {entreprise.valeurs.titre[locale]}
        </h2>
        {/* Présentation sobre : pas de cartes à icônes. */}
        <dl className="mt-8 max-w-3xl">
          {entreprise.valeurs.items.map((valeur) => (
            <div
              key={valeur.nom.fr}
              className="flex flex-col gap-1 border-t border-line py-5 sm:flex-row sm:gap-8"
            >
              <dt className="data shrink-0 text-fg-soft sm:w-56">{valeur.nom[locale]}</dt>
              <dd>{valeur.phrase[locale]}</dd>
            </div>
          ))}
        </dl>
      </Container>

      {/* Équipement : la section s'affiche automatiquement dès la première
          machine saisie dans content/entreprise.ts (asset n°8 À CONFIRMER).
          Les capacités mesurables nourriront des <Cote>. */}
      {machines.length > 0 && (
        <Container className="pb-16">
          <h2 className="expanded font-display text-display-m font-bold">
            {entreprise.equipement.titre[locale]}
          </h2>
          <dl className="mt-8 max-w-3xl">
            {machines.map((machine) => (
              <div
                key={machine.nom}
                className="flex flex-col gap-1 border-t border-line py-5 sm:flex-row sm:gap-8"
              >
                <dt className="shrink-0 font-medium sm:w-56">{machine.nom}</dt>
                <dd className="flex flex-wrap gap-x-6 gap-y-1">
                  <span className="data text-fg-soft">{machine.technologie[locale]}</span>
                  {machine.capacite !== null && (
                    <span className="font-mono text-data">
                      {machine.capacite.label[locale]} {machine.capacite.valeur}{' '}
                      {machine.capacite.unite}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      )}

      <section className="border-t border-line">
        <BandeChiffres locale={locale} />
      </section>

      <section className="border-t border-line">
        <GrilleReferences locale={locale} />
      </section>
    </main>
  )
}
