'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { WhatsAppCTA } from '@/components/WhatsAppCTA'
import { formulaires } from '@/content/formulaires'
import { metiers } from '@/content/metiers'
import { site } from '@/content/site'
import type { Locale } from '@/lib/i18n'

/**
 * Formulaire de devis (brief §6.6, étape 11). Envoi via Formspree.
 * Anti-spam sans captcha : honeypot hors tab-order (rejet silencieux),
 * bouton désactivé pendant l'envoi, un envoi par session sauf
 * modification d'un champ.
 * Tant que site.formspreeId est null : formulaire rendu mais envoi
 * désactivé, message d'activation + WhatsApp en alternative visible —
 * jamais un formulaire qui semble marcher et n'envoie rien.
 */
type Etat = 'repos' | 'envoi' | 'succes' | 'echec'

const CLE_ENVOI = 'numerika-devis-envoye'
const t = formulaires.devis

export function FormulaireDevis({
  locale,
  /** Récapitulatif régie résolu côté serveur : libellés affichés,
      slugs injectés dans le payload. */
  selection,
}: {
  locale: Locale
  selection: Array<{ slug: string; libelle: string }>
}) {
  const [etat, setEtat] = useState<Etat>('repos')
  const [dejaEnvoye, setDejaEnvoye] = useState(false)
  const actif = site.formspreeId !== null

  useEffect(() => {
    try {
      if (sessionStorage.getItem(CLE_ENVOI)) setDejaEnvoye(true)
    } catch {}
  }, [])

  function surModification() {
    /* Une modification ré-autorise un envoi (limitation par session). */
    if (dejaEnvoye) setDejaEnvoye(false)
    if (etat === 'succes' || etat === 'echec') setEtat('repos')
  }

  async function envoyer(evenement: FormEvent<HTMLFormElement>) {
    evenement.preventDefault()
    if (!site.formspreeId || etat === 'envoi' || dejaEnvoye) return

    const donnees = new FormData(evenement.currentTarget)

    /* Honeypot rempli → un robot. Rejet silencieux : on affiche le succès
       sans rien envoyer. */
    if (String(donnees.get('_gotcha') ?? '') !== '') {
      setEtat('succes')
      return
    }

    setEtat('envoi')
    try {
      const reponse = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
        method: 'POST',
        body: donnees,
        headers: { Accept: 'application/json' },
      })
      if (reponse.ok) {
        setEtat('succes')
        setDejaEnvoye(true)
        try {
          sessionStorage.setItem(CLE_ENVOI, '1')
        } catch {}
      } else {
        setEtat('echec')
      }
    } catch {
      setEtat('echec')
    }
  }

  const classeChamp =
    'w-full border border-line bg-surface px-3 py-2 text-body text-fg [color-scheme:inherit]'
  const classeLabel = 'data mb-2 block text-fg-soft'

  return (
    <form onSubmit={envoyer} onChange={surModification} className="max-w-2xl" noValidate={false}>
      {!actif && (
        <div className="mb-8 border border-line bg-surface p-5">
          <p className="text-fg-soft">{t.activation[locale]}</p>
          <div className="mt-4">
            <WhatsAppCTA locale={locale} message={t.whatsapp[locale]} />
          </div>
        </div>
      )}

      {selection.length > 0 && (
        <fieldset className="mb-8 border border-line bg-surface p-5">
          <legend className="data px-1 text-fg-soft">{t.recap[locale]}</legend>
          <ul className="space-y-1">
            {selection.map((s) => (
              <li key={s.slug} className="text-sm">
                {s.libelle}
              </li>
            ))}
          </ul>
          {/* Récapitulatif non éditable : les slugs partent dans le payload. */}
          <input type="hidden" name="panneaux" value={selection.map((s) => s.slug).join(',')} />
        </fieldset>
      )}

      {/* Honeypot : hors tab-order, invisible, rejet silencieux si rempli. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Ne pas remplir
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6">
        <label className="block">
          <span className={classeLabel}>{t.champs.pole[locale]}</span>
          <select name="pole" required className={classeChamp} defaultValue="">
            <option value="" disabled>
              {t.champs.choisirPole[locale]}
            </option>
            {metiers.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.nom[locale]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={classeLabel}>{t.champs.description[locale]}</span>
          <textarea name="description" required rows={5} className={classeChamp} />
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className={classeLabel}>{t.champs.quantite[locale]}</span>
            <input type="text" name="quantite" className={classeChamp} />
          </label>
          <label className="block">
            <span className={classeLabel}>{t.champs.echeance[locale]}</span>
            <input type="date" name="echeance" className={classeChamp} />
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className={classeLabel}>{t.champs.nom[locale]}</span>
            <input type="text" name="nom" required autoComplete="name" className={classeChamp} />
          </label>
          <label className="block">
            <span className={classeLabel}>{t.champs.telephone[locale]}</span>
            <input type="tel" name="telephone" autoComplete="tel" className={classeChamp} />
          </label>
        </div>

        <label className="block">
          <span className={classeLabel}>{t.champs.email[locale]}</span>
          <input type="email" name="email" required autoComplete="email" className={classeChamp} />
        </label>

        <p className="text-sm text-fg-soft">{t.fichiers[locale]}</p>

        <div aria-live="polite">
          {etat === 'succes' ? (
            <p>{t.succes[locale]}</p>
          ) : etat === 'echec' ? (
            <div className="space-y-4">
              <p className="text-fg-soft">{t.echec[locale]}</p>
              <WhatsAppCTA locale={locale} message={t.whatsapp[locale]} />
            </div>
          ) : dejaEnvoye ? (
            <p className="text-fg-soft">{t.dejaEnvoye[locale]}</p>
          ) : (
            <button
              type="submit"
              disabled={!actif || etat === 'envoi'}
              className="rounded-btn bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {etat === 'envoi' ? t.envoi[locale] : t.envoyer[locale]}
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
