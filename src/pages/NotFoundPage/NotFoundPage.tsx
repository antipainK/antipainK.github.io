import { useDocumentHead } from '@hooks/useDocumentHead';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';

export function NotFoundPage() {
  const { t } = useTranslation();
  const title = t(TRANSLATION_KEYS.notFound.title);

  useDocumentHead({ title });

  return (
    <>
      <h1>{title}</h1>
      <p>{t(TRANSLATION_KEYS.notFound.body)}</p>
    </>
  );
}
