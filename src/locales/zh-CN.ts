import type { Translations } from '@i18n/resources';
import type { PartialTranslations } from '@i18n/types';

/** Simplified Chinese translations (partial — the rest falls back to English). */
export const zhCN = {
  common: {
    nav: { experience: '经历', education: '教育' },
    sections: { experience: '工作经历', education: '教育背景' },
    skipToContent: '跳到主要内容',
    language: { label: '语言', select: '选择语言' },
    time: { present: '至今' },
    footer: {
      builtWith: '使用 React、TypeScript 和 Vite 构建。',
      rights: '© {{year}} Wojciech Kosztyła',
    },
    actions: { viewWebsite: '访问网站', viewSource: '查看源码' },
  },
  home: {
    hero: {
      greeting: '你好，',
      name: '我是 Wojciech Kosztyła',
      role: '软件工程师',
      tagline: '我构建可靠且无障碍的 Web 应用。',
    },
  },
} as const satisfies PartialTranslations<Translations>;
