import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { Photo } from '@/components/Photo'
import { WhatsAppCTA } from '@/components/WhatsAppCTA'
import { metiers } from '@/content/metiers'
import { realisations, realisationsTextes } from '@/content/realisations'
import { cn } from '@/lib/cn'
import type { Locale } from '@/lib/i18n'
import { seoAlternates } from '@/lib/seo'

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  return {
    title: realisationsTextes.page.titre[params.locale],
    description: realisationsTextes.page.description[params.locale],
    alternates: seoAlternates(params.locale, '/realisations'),
  }
}

/**
 * Grille des réalisations (brief §6.5, étape 9), filtrable par pôle via
 * searchParams — même mécanique que l'inventaire régie, URL partageables.
 * Seules les publiable: true se rendent : tant que les autorisations
 * clients ne sont pas confirmées, la grille assume son état vide.
 */
export default function Realisations({
  params,
  searchParams,
}: {
  params: { locale: Locale }
  searchParams: Record<string, string | string[] | undefined>
}) {
  const { locale } = params

  const publiables = realisations.filter((r) => r.publiable)

  /* Seuls les pôles ayant au moins une réalisation publiable filtrent :
     jamais un filtre qui ne filtre rien. */
  const polesPresents = metiers.filter((m) => publiables.some((r) => r.pole === m.slug))
  const poleParam = typeof searchParams.pole === 'string' ? searchParams.pole : undefined
  const filtre = polesPresents.some((m) => m.slug === poleParam) ? (poleParam as string) : null
  const affichees = filtre ? publiables.filter((r) => r.pole === filtre) : publiables

  return (
    <main>
      <Container className="py-16">
        <h1 className="expanded font-display text-display-l font-bold">
          {realisationsTextes.page.titre[locale]}
        </h1>

        {polesPresents.length > 0 && (
          <nav className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href={`/${locale}/realisations`}
              className={cn(
                'data transition-colors hover:text-fg',
                filtre === null ? 'text-fg underline underline-offset-4' : 'text-fg-soft'
              )}
            >
              {realisationsTextes.page.filtreTous[locale]}
            </Link>
            {polesPresents.map((m) => (
              <Link
                key={m.slug}
                href={`/${locale}/realisations?pole=${m.slug}`}
                className={cn(
                  'data transition-colors hover:text-fg',
                  filtre === m.slug ? 'text-fg underline underline-offset-4' : 'text-fg-soft'
                )}
              >
                {m.nom[locale]}
              </Link>
            ))}
          </nav>
        )}

        {affichees.length > 0 ? (
          <div
            data-revele-groupe
            className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {affichees.map((r) => (
              <article key={r.slug} className="group">
                {/* Vignette réelle (étape 15 bis) — la grille est prête à
                    s'allumer à la bascule de `publiable`. */}
                {r.images[0] !== undefined ? (
                  <Photo
                    cle={r.images[0]}
                    alt={r.nom[locale]}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="aspect-[4/3] overflow-hidden border border-line bg-surface"
                    classNameImg="h-full w-full object-cover transition-transform duration-[600ms] motion-safe:group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="aspect-[4/3] border border-line bg-surface" aria-hidden />
                )}
                {/* Le nom du client est visible dès la grille (brief §6.5). */}
                <p className="data mt-4 text-fg-soft">{r.client}</p>
                <h2 className="mt-2 font-medium">
                  <Link
                    href={`/${locale}/realisations/${r.slug}`}
                    className="transition-colors hover:text-red"
                  >
                    {r.nom[locale]}
                  </Link>
                </h2>
                <p className="data mt-2 text-fg-soft">
                  {metiers.find((m) => m.slug === r.pole)?.nom[locale] ?? r.pole}
                  {' · '}
                  {r.techniques.map((t) => t[locale]).join(', ')}
                </p>
              </article>
            ))}
          </div>
        ) : (
          /* État vide assumé : le portfolio attend les autorisations
             clients (asset n°7) et la documentation (asset n°12). */
          <div className="mt-10 border border-line bg-surface p-10">
            <p className="text-fg-soft">{realisationsTextes.vide.message[locale]}</p>
            <div className="mt-6">
              <WhatsAppCTA locale={locale} message={realisationsTextes.vide.whatsapp[locale]} />
            </div>
          </div>
        )}
      </Container>
    </main>
  )
}
