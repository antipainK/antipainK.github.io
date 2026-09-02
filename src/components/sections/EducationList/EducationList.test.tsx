import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { en } from '@locales/en';
import { EducationList } from './EducationList';

// Sourced from the locale, not retyped: these assertions are about structure,
// so a copy edit to a degree title should not fail them.
const MSC_TITLE = en.education.aghMsc.title;
const BSC_TITLE = en.education.aghBsc.title;

function mscEntry() {
  return screen.getByRole('heading', { level: 3, name: MSC_TITLE }).closest('li');
}

describe('EducationList', () => {
  it('renders the section heading and seeded education entries', () => {
    render(<EducationList />);
    expect(screen.getByRole('heading', { level: 2, name: /^education$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: MSC_TITLE })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: BSC_TITLE })).toBeInTheDocument();
  });

  it('applies the highlighted class to an entry whose id is in highlightedEntryIds', () => {
    render(<EducationList highlightedEntryIds={new Set(['aghMsc'])} />);
    expect(mscEntry()?.className).toMatch(/highlighted/);
  });

  it('does not highlight anything when highlightedEntryIds is omitted', () => {
    render(<EducationList />);
    expect(mscEntry()?.className).not.toMatch(/highlighted/);
  });

  /*
   * The MSc entry records no languages yet, and more entries will land
   * incomplete. An entry with nothing to tag must render no chip row at all —
   * not an empty <ul> contributing its margin and gap to the layout.
   */
  it('renders no tag list for an entry with no language data', () => {
    render(<EducationList />);

    expect(mscEntry()?.querySelector('ul')).toBeNull();
  });

  it('still renders the tag list for an entry that has languages', () => {
    render(<EducationList />);
    const bsc = screen.getByRole('heading', { level: 3, name: BSC_TITLE }).closest('li');

    // Guards the assertion above against passing because nothing renders tags.
    expect(bsc?.querySelector('ul')).not.toBeNull();
    expect(bsc).toHaveTextContent('C++');
  });
});
