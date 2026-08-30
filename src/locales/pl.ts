import type { Translations } from '@i18n/resources';
import type { PartialTranslations } from '@i18n/types';

/** Polish translations. Partial is allowed — missing keys fall back to English. */
export const pl = {
  common: {
    nav: { experience: 'Doświadczenie', education: 'Edukacja', skills: 'Umiejętności', cv: 'CV', primary: 'Główna' },
    sections: { experience: 'Doświadczenie', education: 'Edukacja', skills: 'Umiejętności' },
    skipToContent: 'Przejdź do treści',
    language: { label: 'Język' },
    time: { present: 'Obecnie' },
    footer: {
      builtWith: 'Zbudowane w React, TypeScript i Vite.',
      rights: '© {{year}} {{name}}',
    },
    actions: { viewWebsite: 'Odwiedź stronę', viewSource: 'Zobacz kod' },
  },
  home: {
    hero: {
      greeting: 'Cześć,',
      name: 'Nazywam się {{name}}',
      role: 'Inżynier oprogramowania',
      tagline: 'Tworzę niezawodne i dostępne aplikacje internetowe.',
    },
  },
  experience: {
    qualtrics: {
      jobTitle: 'Software Engineer I',
      title: 'Software Engineer I',
      shortDescription: 'Software Engineer I w zespole inżynieryjnym Qualtrics.',
    },
    genie: {
      jobTitle: 'Back End Developer',
      title: 'Back End Developer',
      shortDescription: 'Odpowiadałem za istotną część systemu do zarządzania portfelem i ryzykiem dla portfeli krypto, zbudowanego z użyciem FastAPI, GraphQL i PostgreSQL na AWS/Kubernetes.',
    },
    cern: {
      jobTitle: 'Stażysta – inżynier oprogramowania',
      title: 'Openlab Summer Student',
      shortDescription: 'Letni staż w CERN – rozwój narzędzi do kontroli i monitorowania systemu zegarowego PPS wykorzystywanego w detektorach diamentowych LHC.',
    },
  },
  education: {
    aghMsc: {
      title: 'Studia magisterskie, Informatyka',
      shortDescription: 'Praca magisterska: „Processing of images from event camera”.',
    },
    aghBsc: {
      title: 'Studia inżynierskie, Informatyka',
      shortDescription: 'Praca inżynierska: „Monitoring software for time distribution in the CMS-PPS detector at CERN laboratory”.',
    },
  },
  skills: {
    categories: {
      language: 'Języki programowania',
      webDevelopment: 'Programowanie webowe',
      database: 'Bazy danych',
      cloudDevops: 'Cloud i DevOps',
      aiAssisted: 'Rozwój wspomagany AI',
    },
    duration: {
      years: '{{years}} lat',
      months: '{{months}} mies.',
      yearsAndMonths: '{{years}} lat {{months}} mies.',
    },
  },
  projects: {
    notFound: 'Nie znaleziono projektu.',
  },
} as const satisfies PartialTranslations<Translations>;
