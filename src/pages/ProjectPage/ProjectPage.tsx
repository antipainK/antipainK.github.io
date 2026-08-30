import { useParams } from 'react-router';
import { projects } from '@data/projects';
import { useDocumentHead } from '@hooks/useDocumentHead';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const project = projects.find((candidate) => candidate.slug === slug);
  // `slug` comes from the URL and can never be a compile-time-known key, so this one
  // lookup intentionally bypasses the typed `t()` wrapper.
  const summary = project ? i18n.t(`projects.${project.slug}.shortDescription`) : undefined;

  useDocumentHead({
    title: project ? project.name : t(TRANSLATION_KEYS.projects.notFound),
    description: summary,
  });

  if (!project) {
    return <p>{t(TRANSLATION_KEYS.projects.notFound)}</p>;
  }

  return (
    <article>
      <h1>{project.name}</h1>
      <p>{summary}</p>
    </article>
  );
}
