import type { Metier } from '@/content/metiers'
import type { Panneau } from '@/content/panneaux'
import { site } from '@/content/site'
import type { Locale } from './i18n'
import { BASE } from './seo'

/**
 * Constructeurs JSON-LD (brief §8, étape 12).
 * Organization et LocalBusiness fusionnés en un seul nœud, posé sur le
 * layout — toutes les pages. Les données viennent de content/site.ts
 * (bloc anticipé de /entreprise, étape 10).
 */
export function jsonOrganisation() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${BASE}/#organisation`,
    name: site.nom,
    url: BASE,
    foundingDate: String(site.fondee),
    numberOfEmployees: { '@type': 'QuantitativeValue', value: site.collaborateurs },
    /* Adresse SANS kilomètre tant que l'ambiguïté km 2,5 / km 3 demeure
       (À CONFIRMER, asset n°11). */
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.adresse.rue,
      addressLocality: site.adresse.ville,
      addressCountry: 'SN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.adresse.coords.lat,
      longitude: site.adresse.coords.lng,
    },
    telephone: site.telephones[0],
    email: site.email,
    /* Garde-fou : jamais linkedin.com/company/numerika-sa (homonyme tunisien). */
    sameAs: [site.reseaux.facebook, site.reseaux.instagram, site.reseaux.linkedin],
  }
}

export function jsonService(metier: Metier, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: metier.nom[locale],
    description: metier.description[locale],
    url: `${BASE}/${locale}/metiers/${metier.slug}`,
    provider: { '@id': `${BASE}/#organisation` },
    areaServed: 'Dakar',
  }
}

export function jsonItemList(emplacements: Panneau[], locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Numerika Media',
    itemListElement: emplacements.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: p.nom[locale],
      url: `${BASE}/${locale}/media/emplacements/${p.slug}`,
    })),
  }
}

export function jsonFilAriane(elements: Array<{ nom: string; chemin: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: elements.map((element, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: element.nom,
      item: `${BASE}${element.chemin}`,
    })),
  }
}
