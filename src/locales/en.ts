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
    cern: {
      jobTitle: 'Software Engineering Intern',
      title: 'Openlab Summer Student',
      shortDescription: 'Summer internship at CERN working on physics data-analysis tooling.',
    },
  },
  education: {
    agh: {
      title: 'MSc & BSc, Computer Science',
      shortDescription: 'AGH University of Science and Technology, Kraków.',
    },
  },
} as const;
