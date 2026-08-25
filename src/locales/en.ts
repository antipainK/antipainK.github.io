/** English translations — the canonical shape. All keys must exist here. */
export const en = {
  common: {
    nav: { experience: 'Experience', education: 'Education', primary: 'Primary' },
    sections: { experience: 'Experience', education: 'Education' },
    skipToContent: 'Skip to content',
    language: { label: 'Language' },
    time: { present: 'Present' },
    footer: {
      builtWith: 'Built with React, TypeScript & Vite.',
      rights: '© {{year}} {{name}}',
    },
    actions: { viewWebsite: 'Visit website', viewSource: 'View source' },
  },
  home: {
    hero: {
      greeting: 'Hello there,',
      name: 'I\'m {{name}}',
      role: 'Software Engineer',
      tagline: 'I build reliable, accessible web applications.',
    },
  },
  experience: {
    qualtrics: {
      jobTitle: 'Software Engineer I',
      title: 'Software Engineer I',
      shortDescription: 'Software Engineer I on Qualtrics\'s engineering team.',
    },
    genie: {
      jobTitle: 'Back End Developer',
      title: 'Back End Developer',
      shortDescription: 'Owned a significant part of a portfolio and risk management system for crypto wallets, built with FastAPI, GraphQL and PostgreSQL on AWS/Kubernetes.',
    },
    cern: {
      jobTitle: 'Software Engineer Intern',
      title: 'Openlab Summer Student',
      shortDescription: 'Summer internship at CERN improving control and monitoring tools for the PPS clock system used in the LHC\'s diamond detectors.',
    },
  },
  education: {
    aghMsc: {
      title: 'MSc, Computer Science',
      shortDescription: 'Master\'s thesis: "Processing of images from event camera".',
    },
    aghBsc: {
      title: 'BSc, Computer Science',
      shortDescription: 'Bachelor\'s thesis: "Monitoring software for time distribution in the CMS-PPS detector at CERN laboratory".',
    },
  },
} as const;
