import { useState } from 'react';
import { Layout } from '@components/layout/Layout/Layout';
import { EducationList } from '@components/sections/EducationList/EducationList';
import { ExperienceTimeline } from '@components/sections/ExperienceTimeline/ExperienceTimeline';
import { Hero } from '@components/sections/Hero/Hero';
import { SkillsSection } from '@components/sections/SkillsSection/SkillsSection';

function App() {
  const [highlightedEntryIds, setHighlightedEntryIds] = useState<ReadonlySet<string>>(new Set());

  return (
    <Layout>
      <Hero />
      <ExperienceTimeline highlightedEntryIds={highlightedEntryIds} />
      <SkillsSection onHighlightChange={setHighlightedEntryIds} />
      <EducationList highlightedEntryIds={highlightedEntryIds} />
    </Layout>
  );
}

export default App;
