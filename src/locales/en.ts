/** English translations — the canonical shape. All keys must exist here. */
export const en = {
  common: {
    nav: { experience: 'Experience', education: 'Education' },
    sections: { experience: 'Experience', education: 'Education' },
    language: { label: 'Language', select: 'Select language' },
    time: { present: 'Present' },
    footer: {
      builtWith: 'Built with React, TypeScript & Vite.',
      rights: '© {{year}} Wojciech Kosztyła',
    },
    actions: { viewWebsite: 'Visit website', viewSource: 'View source' },
  },
  home: {
    hero: {
      greeting: 'Hello there,',
      name: 'I\'m Wojciech Kosztyła',
      role: 'Software Engineer',
      tagline: 'I build reliable, accessible web applications.',
    },
  },
  experience: {
    cern: {
      jobTitle: 'Software Engineering Intern',
      title: 'Openlab Summer Student',
      shortDescription: 'Summer internship at CERN working on physics data-analysis tooling.',
      description: 'Contributed to research software during the CERN Openlab summer programme, developing Python tooling for physics data analysis and visualization.',
    },
  },
  education: {
    agh: {
      title: 'MSc & BSc, Computer Science',
      shortDescription: 'AGH University of Science and Technology, Kraków.',
      description: '',
    },
  },
} as const;
