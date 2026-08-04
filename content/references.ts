/**
 * Références clients (brief §2), relevées sur le site actuel.
 * À CONFIRMER : validation de la liste publiée avant mise en ligne
 * (asset n°7 : autorisation de nommer les clients).
 * Affichage en texte : les logos remplaceront les noms quand ils seront
 * fournis proprement (vectoriels homogènes, pas les PNG du site actuel).
 * Institutionnels d'abord (brief §6.1).
 */
export type Reference = {
  nom: string
  institutionnel: boolean
}

export const references: Reference[] = [
  { nom: 'Ambassade de France', institutionnel: true },
  { nom: 'UNICEF', institutionnel: true },
  { nom: 'USAID', institutionnel: true },
  { nom: 'UNHCR', institutionnel: true },
  { nom: 'GB Foods', institutionnel: false },
  { nom: 'Kirene', institutionnel: false },
  { nom: 'La Casamançaise', institutionnel: false },
  { nom: 'Yas', institutionnel: false },
  { nom: 'DMC', institutionnel: false },
  { nom: 'Sofiex', institutionnel: false },
  { nom: 'ACS', institutionnel: false },
  { nom: 'Sunu Group', institutionnel: false },
  { nom: 'Eiffage', institutionnel: false },
  { nom: 'Confisen', institutionnel: false },
  { nom: 'Batimat', institutionnel: false },
  { nom: 'Afrikabanque', institutionnel: false },
  { nom: 'Uniparco', institutionnel: false },
  { nom: 'Sedima', institutionnel: false },
  { nom: 'Terrou-Bi', institutionnel: false },
  { nom: 'Sonatel', institutionnel: false },
  { nom: 'SENAC', institutionnel: false },
  { nom: 'Patisen', institutionnel: false },
  { nom: 'LASA', institutionnel: false },
  { nom: 'Société Générale', institutionnel: false },
  { nom: 'IBS', institutionnel: false },
  { nom: 'Expresso', institutionnel: false },
  { nom: 'Canal+', institutionnel: false },
  { nom: 'Bernabé', institutionnel: false },
  { nom: 'SECAA', institutionnel: false },
]

/* Références supplémentaires identifiables dans le portfolio du site actuel,
   NON publiées tant que non validées par le client : Ecobank, UBA, Super U,
   Ibis, Mitsubishi, Dongfeng, KIA, SONAM, Sanlam, Foundever, Adja,
   Fabrimetal, Sosenap, Universal Industries, Be Sport, Basilic, Crystal,
   GGA, Jado, Kosen, RFI, Banque de Dakar. */
