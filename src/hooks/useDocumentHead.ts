import { useEffect } from 'react';

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

function removeMeta(attribute: 'name' | 'property', key: string): void {
  document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)?.remove();
}

/**
 * Sets the document title and description/OG meta tags for the current
 * route. This is what the build-time prerender snapshot actually captures
 * per page, so every routed page should call it.
 */
export function useDocumentHead({ title, description }: DocumentHeadOptions): void {
  useEffect(() => {
    document.title = title;
    upsertMeta('property', 'og:title', title);
    if (description) {
      upsertMeta('name', 'description', description);
      upsertMeta('property', 'og:description', description);
    } else {
      removeMeta('name', 'description');
      removeMeta('property', 'og:description');
    }
  }, [title, description]);
}
