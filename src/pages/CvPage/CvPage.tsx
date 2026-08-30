import { profile } from '@data/portfolio';
import { useDocumentHead } from '@hooks/useDocumentHead';

export function CvPage() {
  useDocumentHead({ title: `CV — ${profile.name}` });

  return <p>cv placeholder</p>;
}
