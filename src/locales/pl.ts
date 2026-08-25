import type { Translations } from '@i18n/resources';
import type { PartialTranslations } from '@i18n/types';

/** Polish translations. Partial is allowed — missing keys fall back to English. */
export const pl = {
  common: {
    nav: { experience: 'Doświadczenie', education: 'Edukacja' },
    sections: { experience: 'Doświadczenie', education: 'Edukacja' },
    language: { label: 'Język', select: 'Wybierz język' },
    time: { present: 'Obecnie' },
    footer: {
      builtWith: 'Zbudowane w React, TypeScript i Vite.',
      rights: '© {{year}} Wojciech Kosztyła',
    },
    actions: { viewWebsite: 'Odwiedź stronę', viewSource: 'Zobacz kod' },
  },
  home: {
    hero: {
      greeting: 'Cześć,',
      name: 'Nazywam się Wojciech Kosztyła',
      role: 'Inżynier oprogramowania',
      tagline: 'Tworzę niezawodne i dostępne aplikacje internetowe.',
    },
  },
  experience: {
    cern: {
      jobTitle: 'Stażysta – inżynieria oprogramowania',
      title: 'Openlab Summer Student',
      shortDescription: 'Letni staż w CERN przy narzędziach do analizy danych fizycznych.',
      description: 'Uczestniczyłem w letnim programie CERN Openlab, tworząc narzędzia w Pythonie do analizy i wizualizacji danych fizycznych.',
    },
  },
  education: {
    agh: {
      title: 'Studia magisterskie i inżynierskie, Informatyka',
      shortDescription: 'Akademia Górniczo-Hutnicza w Krakowie.',
      description: '',
    },
  },
} as const satisfies PartialTranslations<Translations>;
