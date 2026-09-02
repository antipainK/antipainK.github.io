/** English translations — the canonical shape. All keys must exist here. */
export const en = {
  common: {
    nav: {
      site: 'Site',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      cv: 'CV',
    },
    sections: { experience: 'Experience', education: 'Education', skills: 'Skills' },
    skipToContent: 'Skip to content',
    language: { label: 'Language' },
    /* Addresses are shown verbatim from the data, so only the group label is copy. */
    contact: { heading: 'Contact' },
    rail: {
      location: 'Kraków, Poland. Open to hybrid and remote.',
      portraitAlt: '{{name}}',
    },
    time: { present: 'Present' },
    footer: {
      builtWith: 'Built with React, TypeScript & Vite.',
      rights: '© {{year}} {{name}}',
    },
    actions: { viewWebsite: 'Visit website', viewSource: 'View source' },
  },
  home: {
    hero: {
      role: 'Software Engineer',
      statement: 'I build backend and frontend for an enterprise experience platform, and I\'m the one who fixes the pipeline.',
      bio: 'Four years between Kraków, Geneva and a remote team in Italy. Now at Qualtrics, where I shipped an early-access product on my own and rewired how the rest of the office ships theirs.',
      figures: {
        languages: 'years on Java and TypeScript',
        repos: 'repositories on automated dependency updates',
        engineers: 'engineers using my CI templates',
      },
    },
  },
  cv: {
    title: 'CV',
  },
  experience: {
    qualtrics: {
      title: 'Software Engineer I',
      meta: 'Employee Experience platform. Kraków, hybrid.',
      highlights: [
        'Sole developer of the MVP for an early-access product that captures real-time feedback from frontline employees and shows it alongside customer feedback.',
        'Led an AWS migration and a full rewrite of the internal nominations-data batch synchronisation system.',
        'Rolled out standardised GitLab CI templates to 20+ repositories across a 60-engineer office, and RenovateBot to roughly 100 repositories.',
        'Built the Splunk and Grafana dashboards and the alerting the team runs on. Backend, frontend, support and on-call.',
      ],
    },
    genie: {
      title: 'Back End Developer',
      meta: 'Portfolio and risk management for digital crypto wallets. Italy, remote.',
      highlights: [
        'Owned a significant part of the portfolio and risk management system, designing scalable backend services and APIs.',
        'Deployed cloud-native on AWS and Kubernetes, orchestrating services for scale and reliability.',
      ],
    },
    cern: {
      title: 'Openlab Summer Student',
      meta: 'Software engineering internship. Geneva, Switzerland.',
      highlights: [
        'Built control and monitoring software for the PPS clock system used by the LHC precision proton spectrometer, after several months of preparation on the problem.',
      ],
    },
  },
  education: {
    aghMsc: {
      title: 'Master of Science in Engineering, Computer Science',
      meta: 'AGH University of Krakow',
      note: 'Thesis: processing of images from an event camera.',
    },
    aghBsc: {
      title: 'Bachelor of Science, Computer Science',
      meta: 'AGH University of Krakow',
      note: 'Thesis: monitoring software for time distribution in the CMS-PPS detector at CERN.',
    },
  },
  skills: {
    aside: 'Durations are computed from dated roles',
    also: 'Also',
    filterStatus: 'Filter {{skill}} — {{matches}} of {{total}} roles',
    filterStatus_one: 'Filter {{skill}} — {{matches}} of {{total}} role',
    clearFilter: 'Clear filter',
    categories: {
      language: 'Languages',
      webDevelopment: 'Web & frameworks',
      database: 'Databases',
      infrastructure: 'Infrastructure & protocols',
      aiAssisted: 'AI tooling',
    },
    duration: {
      years: '{{years}} yr',
      months: '{{months}} mo',
      yearsAndMonths: '{{years}} yr {{months}} mo',
    },
  },
  projects: {
    notFound: 'Project not found.',
  },
  notFound: {
    title: 'Page not found',
    body: 'The page you were looking for doesn\'t exist.',
  },
} as const;
