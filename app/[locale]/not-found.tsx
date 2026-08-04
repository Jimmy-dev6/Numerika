import { PageIntrouvable } from '@/components/PageIntrouvable'

/** 404 localisée (étape 14). Rendue pour tout notFound() sous [locale],
    y compris le catch-all [...inconnu]. */
export default function NotFound() {
  return <PageIntrouvable />
}
