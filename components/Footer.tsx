import { Container } from '@/components/Container'
import { site } from '@/content/site'
import { telHref } from '@/lib/format'
import type { Locale } from '@/lib/i18n'

/** Pied de page. Toutes les coordonnées viennent de content/site.ts. */
export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-line bg-bg">
      <Container className="grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="expanded font-display text-xl font-bold tracking-tight">{site.nom}</p>
          <p className="mt-3 text-sm text-fg-soft">
            {site.adresse.rue}, {site.adresse.ville}, {site.adresse.pays[locale]}
          </p>
        </div>

        <ul className="space-y-2 text-sm">
          {site.telephones.map((tel) => (
            <li key={tel}>
              <a href={telHref(tel)} className="text-fg-soft transition-colors hover:text-fg">
                {tel}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${site.email}`}
              className="text-fg-soft transition-colors hover:text-fg"
            >
              {site.email}
            </a>
          </li>
        </ul>

        <ul className="space-y-2 text-sm">
          <li>
            <a
              href={site.reseaux.facebook}
              rel="noopener noreferrer"
              target="_blank"
              className="text-fg-soft transition-colors hover:text-fg"
            >
              Facebook
            </a>
          </li>
          <li>
            <a
              href={site.reseaux.instagram}
              rel="noopener noreferrer"
              target="_blank"
              className="text-fg-soft transition-colors hover:text-fg"
            >
              Instagram
            </a>
          </li>
          <li>
            <a
              href={site.reseaux.linkedin}
              rel="noopener noreferrer"
              target="_blank"
              className="text-fg-soft transition-colors hover:text-fg"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </Container>

      <div className="border-t border-line">
        <Container className="py-5">
          <p className="data text-fg-soft">
            © {site.fondee}–{new Date().getFullYear()} {site.nom}
          </p>
        </Container>
      </div>
    </footer>
  )
}
