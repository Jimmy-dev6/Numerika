'use client'

import { useSelection } from '@/components/media/SelectionContext'

/** Case à cocher d'un emplacement (jamais posée sur un réseau). */
export function CaseSelection({ slug, label }: { slug: string; label: string }) {
  const { slugs, basculer } = useSelection()

  return (
    <label className="absolute right-2 top-2 flex cursor-pointer items-center justify-center bg-bg/85 p-2">
      <input
        type="checkbox"
        checked={slugs.includes(slug)}
        onChange={() => basculer(slug)}
        className="h-4 w-4 cursor-pointer accent-[var(--accent)]"
      />
      <span className="sr-only">{label}</span>
    </label>
  )
}
