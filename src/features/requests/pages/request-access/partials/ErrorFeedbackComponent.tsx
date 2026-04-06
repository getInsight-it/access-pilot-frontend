import { Button } from "../../../../../common/external/ui/button.tsx";
import { FlipWords } from "../../../../../common/external/ui/flip-words.tsx";
import { useI18n } from "../../../../../common/context/i18n/I18nContext.tsx";

interface ErrorFeedbackProps {
  words: string[];
  onRetry: () => void;
}

export const ErrorFeedback = ({ words, onRetry }: ErrorFeedbackProps) => {
  const { t } = useI18n();

  return (
    <>
      <div>
        <div>
          {t("Ocorreu um erro.")}
          <FlipWords words={words} />
        </div>
        <div></div>
      </div>
      <Button onClick={onRetry}>
        {t("Tentar novamente")}
      </Button>
    </>
  );
};
