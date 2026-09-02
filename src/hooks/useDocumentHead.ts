import { useEffect } from 'react';

/**
 * Mirrors the `<meta name="description">` baked into `index.html`. Pages that
 * set no description of their own fall back to this rather than shipping none:
 * a page with no description at all unfurls blank when shared.
 */
export const DEFAULT_DESCRIPTION = 'Portfolio of Wojciech Kosztyła — software engineer.';

interface DocumentHeadOptions {
  title: string;
  description?: string;
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string): void {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Sets the document title and description/OG meta tags for the current
 * route. This is what the build-time prerender snapshot actually captures
 * per page, so every routed page should call it.
 */
export function useDocumentHead({ title, description }: DocumentHeadOptions): void {
  useEffect(() => {
    const resolved = description ?? DEFAULT_DESCRIPTION;

    document.title = title;
    upsertMeta('property', 'og:title', title);
    upsertMeta('name', 'description', resolved);
    upsertMeta('property', 'og:description', resolved);
  }, [title, description]);
}
