import { cn } from '@/lib/cn'

/** Conteneur de mise en page : grille max 12 colonnes, gouttière 24px (brief §4.5). */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('mx-auto w-full max-w-grid px-6', className)}>{children}</div>
}
