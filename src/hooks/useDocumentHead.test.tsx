import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DEFAULT_DESCRIPTION, useDocumentHead } from './useDocumentHead';

function TestComponent({ title, description }: { title: string; description?: string }) {
  useDocumentHead({ title, description });
  return null;
}

describe('useDocumentHead', () => {
  it('sets the document title and og:title', () => {
    render(<TestComponent title="Test Page" />);

    expect(document.title).toBe('Test Page');
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'Test Page');
  });

  it('sets description and og:description when provided', () => {
    render(<TestComponent title="Test Page" description="A description" />);

    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', 'A description');
    expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute('content', 'A description');
  });

  it('updates existing meta tags in place rather than duplicating them', () => {
    const { rerender } = render(<TestComponent title="First" />);
    rerender(<TestComponent title="Second" />);

    expect(document.title).toBe('Second');
    expect(document.querySelectorAll('meta[property="og:title"]')).toHaveLength(1);
  });

  it('falls back to the site default on a page that sets no description', () => {
    render(<TestComponent title="Test Page" />);

    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', DEFAULT_DESCRIPTION);
    expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute('content', DEFAULT_DESCRIPTION);
  });

  it('restores the default rather than stripping the tag when navigating off a page that set one', () => {
    const { rerender } = render(<TestComponent title="First" description="Has one" />);
    rerender(<TestComponent title="Second" />);

    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', DEFAULT_DESCRIPTION);
    expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute('content', DEFAULT_DESCRIPTION);
  });
});
