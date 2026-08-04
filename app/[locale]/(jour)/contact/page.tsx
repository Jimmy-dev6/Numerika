import type { Metadata } from 'next'
import { Container } from '@/components/Container'
import { WhatsAppCTA } from '@/components/WhatsAppCTA'
import { formulaires } from '@/content/formulaires'
import { site } from '@/content/site'
import { telHref } from '@/lib/format'
import type { Locale } from '@/lib/i18n'
import { seoAlternates } from '@/lib/seo'

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  return {
    title: formulaires.contact.titre[params.locale],
    description: formulaires.contact.metaDescription[params.locale],
    alternates: seoAlternates(params.locale, '/contact'),
  }
}

const t = formulaires.contact

/**
 * Contact (étape 11). Coordonnées depuis content/site.ts uniquement.
 * Pas de MapLibre ici : un lien sortant vers Google Maps suffit, construit
 * depuis les coords vérifiées du siège (relevées sur l'embed actuel).
 */
export default function Contact({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const maps = `https://www.google.com/maps?q=${site.adresse.coords.lat},${site.adresse.coords.lng}`

  return (
    <main>
      <Container className="py-16">
        <h1 className="expanded font-display text-display-l font-bold">{t.titre[locale]}</h1>

        <div className="mt-12 grid max-w-3xl gap-10 sm:grid-cols-2">
          <section>
            <h2 className="data text-fg-soft">{t.adresse[locale]}</h2>
            {/* Sans kilomètre tant que l'ambiguïté km 2,5 / km 3 n'est pas
                levée (À CONFIRMER, asset n°11). */}
            <p className="mt-3">
              {site.adresse.rue}
              <br />
              {site.adresse.ville}, {site.adresse.pays[locale]}
            </p>
            <p className="mt-3">
              <a
                href={maps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-fg-soft underline underline-offset-4 transition-colors hover:text-fg"
              >
                {t.maps[locale]}
              </a>
            </p>
          </section>

          <section>
            <h2 className="data text-fg-soft">{t.telephones[locale]}</h2>
            <ul className="mt-3 space-y-1">
              {site.telephones.map((tel) => (
                <li key={tel}>
                  <a href={telHref(tel)} className="transition-colors hover:text-red">
                    {tel}
                  </a>
                </li>
              ))}
            </ul>
            <h2 className="data mt-8 text-fg-soft">{t.email[locale]}</h2>
            <p className="mt-3">
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-red">
                {site.email}
              </a>
            </p>
          </section>

          {/* Horaires (asset n°9) : la section s'affiche dès que
              site.horaires est renseigné. */}
          {site.horaires !== null && (
            <section>
              <h2 className="data text-fg-soft">{t.horaires[locale]}</h2>
              <p className="mt-3">{site.horaires[locale]}</p>
            </section>
          )}

          <section>
            <h2 className="data text-fg-soft">{t.reseaux[locale]}</h2>
            {/* Garde-fou : jamais l'homonyme tunisien numerika-sa (site.ts). */}
            <ul className="mt-3 space-y-1">
              <li>
                <a
                  href={site.reseaux.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-red"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={site.reseaux.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-red"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={site.reseaux.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-red"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-14 border-t border-line pt-10">
          <WhatsAppCTA locale={locale} message={t.whatsapp[locale]} />
        </div>
      </Container>
    </main>
  )
}
