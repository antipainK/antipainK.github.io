import { useState } from 'react';
import { EducationList } from '@components/sections/EducationList/EducationList';
import { ExperienceTimeline } from '@components/sections/ExperienceTimeline/ExperienceTimeline';
import { Hero } from '@components/sections/Hero/Hero';
import { SkillsSection } from '@components/sections/SkillsSection/SkillsSection';

export function HomePage() {
  const [highlightedEntryIds, setHighlightedEntryIds] = useState<ReadonlySet<string>>(new Set());

  return (
    <>
      <Hero />
      <ExperienceTimeline highlightedEntryIds={highlightedEntryIds} />
      <SkillsSection onHighlightChange={setHighlightedEntryIds} />
      <EducationList highlightedEntryIds={highlightedEntryIds} />
    </>
  );
}
