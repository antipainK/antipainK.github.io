import { profile } from '@data/portfolio';
import { useDocumentHead } from '@hooks/useDocumentHead';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';

export function CvPage() {
  const { t } = useTranslation();

  useDocumentHead({ title: `CV — ${profile.name}` });

  return (
    <>
      <h1>{t(TRANSLATION_KEYS.cv.title)}</h1>
      <p>cv placeholder</p>
    </>
  );
}
