import { imagesGen, type CleImage } from '@/content/images.gen'
import { cn } from '@/lib/cn'

/**
 * Rendu d'une image du manifeste (étape 15 bis, passe A).
 * <picture> AVIF + WebP servi statiquement depuis public/images — pas de
 * next/image : les variantes sont pré-générées par scripts/traiter-images.mjs
 * et le manifeste porte les dimensions intrinsèques (width/height posés,
 * zéro CLS). Toute image du site passe par ici : une clé hors manifeste ne
 * compile pas.
 */
export function Photo({
  cle,
  alt,
  sizes,
  priorite = false,
  differee = false,
  className,
  classNameImg,
}: {
  cle: CleImage
  alt: string
  /** Attribut sizes : obligatoire pour que le navigateur choisisse la
      bonne variante. Ex. « (min-width: 900px) 50vw, 100vw ». */
  sizes: string
  /** true UNIQUEMENT sur la première image du hero de la page courante. */
  priorite?: boolean
  /** Image présente dans le viewport mais pas encore visible (calques
      2-4 du diaporama) : fetchpriority=low pour ne pas concurrencer le
      LCP — lazy ne suffit pas, une image lazy DANS le viewport se
      télécharge immédiatement. */
  differee?: boolean
  className?: string
  classNameImg?: string
}) {
  const meta = imagesGen[cle]
  const srcSet = (ext: 'avif' | 'webp') =>
    meta.largeurs.map((l) => `/images/${cle}-${l}.${ext} ${l}w`).join(', ')

  return (
    <picture className={cn('block', className)}>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <img
        src={`/images/${cle}-${meta.largeurs[meta.largeurs.length - 1]}.webp`}
        srcSet={srcSet('webp')}
        sizes={sizes}
        width={meta.largeur}
        height={meta.hauteur}
        alt={alt}
        loading={priorite ? 'eager' : 'lazy'}
        fetchPriority={priorite ? 'high' : differee ? 'low' : undefined}
        decoding="async"
        className={classNameImg}
      />
    </picture>
  )
}
