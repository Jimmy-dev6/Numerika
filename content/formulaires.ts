import type { Localized } from '@/lib/i18n'

/** Textes des pages devis et contact (brief §6.6, étape 11). */
export const formulaires = {
  devis: {
    titre: { fr: 'Demande de devis', en: 'Request a quote' },
    metaDescription: {
      fr: 'Demande de devis Numerika : pôle concerné, description du projet, quantités, échéance.',
      en: 'Numerika quote request: relevant unit, project description, quantities, deadline.',
    },
    recap: { fr: 'Emplacements sélectionnés', en: 'Selected locations' },
    champs: {
      pole: { fr: 'Pôle concerné', en: 'Relevant unit' },
      choisirPole: { fr: 'Choisir un pôle', en: 'Choose a unit' },
      description: { fr: 'Description du projet', en: 'Project description' },
      quantite: { fr: 'Quantité', en: 'Quantity' },
      echeance: { fr: 'Échéance souhaitée', en: 'Desired deadline' },
      nom: { fr: 'Nom', en: 'Name' },
      telephone: { fr: 'Téléphone', en: 'Phone' },
      email: { fr: 'Email', en: 'Email' },
    },
    /* Pas de pièce jointe : Formspree gratuit ne la gère pas proprement.
       À CONFIRMER : plan Formspree (asset étape 11). */
    fichiers: {
      fr: 'Pour joindre des fichiers, passez par WhatsApp.',
      en: 'To attach files, use WhatsApp.',
    },
    envoyer: { fr: 'Envoyer la demande', en: 'Send the request' },
    envoi: { fr: 'Envoi en cours…', en: 'Sending…' },
    activation: {
      fr: 'Formulaire en cours d’activation. En attendant, la demande passe par WhatsApp.',
      en: 'Form being activated. In the meantime, requests go through WhatsApp.',
    },
    succes: { fr: 'Votre demande est envoyée.', en: 'Your request has been sent.' },
    echec: {
      fr: 'L’envoi a échoué. Réessayez, ou passez par WhatsApp.',
      en: 'Sending failed. Try again, or use WhatsApp.',
    },
    dejaEnvoye: {
      fr: 'Demande déjà envoyée. Modifiez un champ pour en envoyer une autre.',
      en: 'Request already sent. Change a field to send another one.',
    },
    whatsapp: {
      fr: 'Bonjour, je souhaite un devis.',
      en: 'Hello, I would like a quote.',
    },
  },
  contact: {
    titre: { fr: 'Contact', en: 'Contact' },
    metaDescription: {
      fr: 'Numerika, Route de Rufisque, Dakar. Téléphones, email, WhatsApp.',
      en: 'Numerika, Route de Rufisque, Dakar. Phone, email, WhatsApp.',
    },
    adresse: { fr: 'Adresse', en: 'Address' },
    telephones: { fr: 'Téléphones', en: 'Phone' },
    email: { fr: 'Email', en: 'Email' },
    horaires: { fr: 'Horaires', en: 'Opening hours' },
    maps: { fr: 'Ouvrir dans Google Maps', en: 'Open in Google Maps' },
    reseaux: { fr: 'Réseaux', en: 'Social' },
    whatsapp: {
      fr: 'Bonjour, je souhaite contacter Numerika.',
      en: 'Hello, I would like to contact Numerika.',
    },
  },
} satisfies Record<string, Record<string, Localized | Record<string, Localized>>>
