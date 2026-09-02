import { useOutletContext } from 'react-router';
import { EducationList } from '@components/sections/EducationList/EducationList';
import { ExperienceTimeline } from '@components/sections/ExperienceTimeline/ExperienceTimeline';
import { Hero } from '@components/sections/Hero/Hero';
import type { LayoutOutletContext } from '@components/layout/Layout/Layout';

export function HomePage() {
  // The skill chips live in the rail and the status in the header, so the
  // filter is owned by `Layout` and handed down through the outlet.
  const { selection } = useOutletContext<LayoutOutletContext>();
  const isFiltered = selection.filterSkill !== null;

  return (
    <>
      <Hero />
      <ExperienceTimeline highlightedEntryIds={selection.entryIds} isFiltered={isFiltered} />
      <EducationList highlightedEntryIds={selection.entryIds} isFiltered={isFiltered} />
    </>
  );
}
