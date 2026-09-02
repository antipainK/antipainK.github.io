import type { Translations } from '@i18n/resources';
import type { PartialTranslations } from '@i18n/types';

/** Polish translations. Partial is allowed — missing keys fall back to English. */
export const pl = {
  common: {
    nav: {
      site: 'Witryna',
      experience: 'Doświadczenie',
      education: 'Edukacja',
      skills: 'Umiejętności',
      cv: 'CV',
    },
    sections: { experience: 'Doświadczenie', education: 'Edukacja', skills: 'Umiejętności' },
    skipToContent: 'Przejdź do treści',
    language: { label: 'Język' },
    contact: { heading: 'Kontakt' },
    rail: {
      location: 'Kraków, Polska. Otwarty na pracę hybrydową i zdalną.',
      portraitAlt: '{{name}}',
    },
    time: { present: 'Obecnie' },
    footer: {
      builtWith: 'Zbudowane w React, TypeScript i Vite.',
      rights: '© {{year}} {{name}}',
    },
    actions: { viewWebsite: 'Odwiedź stronę', viewSource: 'Zobacz kod' },
  },
  home: {
    hero: {
      role: 'Inżynier oprogramowania',
      statement: 'Buduję backend i frontend platformy do badania doświadczeń pracowników — i jestem tą osobą, która naprawia pipeline.',
      bio: 'Cztery lata między Krakowem, Genewą i zdalnym zespołem we Włoszech. Obecnie w Qualtrics, gdzie samodzielnie dowiozłem produkt we wczesnym dostępie i przebudowałem to, jak wdraża reszta biura.',
      figures: {
        // Computed from the data, so it will pass 5 and change form on its own.
        languages_one: 'rok z Javą i TypeScriptem',
        languages_few: 'lata z Javą i TypeScriptem',
        languages_many: 'lat z Javą i TypeScriptem',
        repos: 'repozytoriów z automatycznymi aktualizacjami zależności',
        engineers: 'inżynierów korzystających z moich szablonów CI',
      },
    },
  },
  cv: {
    title: 'CV',
  },
  experience: {
    qualtrics: {
      title: 'Software Engineer I',
      meta: 'Platforma Employee Experience. Kraków, hybrydowo.',
      highlights: [
        'Jedyny deweloper MVP produktu we wczesnym dostępie, który zbiera opinie pracowników pierwszej linii w czasie rzeczywistym i zestawia je z opiniami klientów.',
        'Poprowadziłem migrację do AWS i pełne przepisanie wewnętrznego systemu wsadowej synchronizacji danych nominacyjnych.',
        'Wdrożyłem ustandaryzowane szablony GitLab CI w ponad 20 repozytoriach w biurze liczącym 60 inżynierów, a RenovateBota w około 100 repozytoriach.',
        'Zbudowałem dashboardy w Splunku i Grafanie oraz alerting, na których pracuje zespół. Backend, frontend, wsparcie i dyżury on-call.',
      ],
    },
    genie: {
      title: 'Back End Developer',
      meta: 'Zarządzanie portfelem i ryzykiem dla portfeli krypto. Włochy, zdalnie.',
      highlights: [
        'Odpowiadałem za istotną część systemu zarządzania portfelem i ryzykiem, projektując skalowalne usługi backendowe i API.',
        'Wdrażałem rozwiązania cloud-native na AWS i Kubernetes, orkiestrując usługi pod kątem skali i niezawodności.',
      ],
    },
    cern: {
      title: 'Openlab Summer Student',
      meta: 'Staż inżynierski. Genewa, Szwajcaria.',
      highlights: [
        'Zbudowałem oprogramowanie do kontroli i monitorowania systemu zegarowego PPS, wykorzystywanego przez precyzyjny spektrometr protonowy LHC, po kilku miesiącach przygotowań do tego zagadnienia.',
      ],
    },
  },
  education: {
    aghMsc: {
      title: 'Magister inżynier na kierunku Informatyka',
      meta: 'Akademia Górniczo-Hutnicza w Krakowie',
      note: 'Praca magisterska: przetwarzanie obrazów z kamery zdarzeniowej.',
    },
    aghBsc: {
      title: 'Inżynier na kierunku Informatyka',
      meta: 'Akademia Górniczo-Hutnicza w Krakowie',
      note: 'Praca inżynierska: oprogramowanie do monitorowania dystrybucji czasu w detektorze CMS-PPS w CERN.',
    },
  },
  skills: {
    aside: 'Czas liczony na podstawie dat zatrudnienia',
    also: 'Ponadto',
    /* Phrased so no verb agrees with the count — only the noun after "z" inflects. */
    filterStatus_one: 'Filtr {{skill}} — {{matches}} z {{total}} roli',
    filterStatus_few: 'Filtr {{skill}} — {{matches}} z {{total}} ról',
    filterStatus_many: 'Filtr {{skill}} — {{matches}} z {{total}} ról',
    clearFilter: 'Wyczyść filtr',
    categories: {
      language: 'Języki',
      webDevelopment: 'Web i frameworki',
      database: 'Bazy danych',
      infrastructure: 'Infrastruktura i protokoły',
      aiAssisted: 'Narzędzia AI',
    },
    /*
     * "rok" takes three forms by count: 1 rok, 2-4 lata, 5+ lat. i18next picks
     * one from `count`. "mies." is an abbreviation and does not inflect, so it
     * needs no variants; the combined key pluralises on the years part.
     */
    duration: {
      years_one: '{{years}} rok',
      years_few: '{{years}} lata',
      years_many: '{{years}} lat',
      months: '{{months}} mies.',
      yearsAndMonths_one: '{{years}} rok {{months}} mies.',
      yearsAndMonths_few: '{{years}} lata {{months}} mies.',
      yearsAndMonths_many: '{{years}} lat {{months}} mies.',
    },
  },
  projects: {
    notFound: 'Nie znaleziono projektu.',
  },
  notFound: {
    title: 'Nie znaleziono strony',
    body: 'Strona, której szukasz, nie istnieje.',
  },
} as const satisfies PartialTranslations<Translations>;
