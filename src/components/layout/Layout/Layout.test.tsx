import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Layout } from './Layout';

describe('Layout', () => {
  it('renders the navbar, footer, and children inside the main landmark', () => {
    render(
      <Layout>
        <p>content</p>
      </Layout>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('main')).toContainElement(screen.getByText('content'));
  });
});
