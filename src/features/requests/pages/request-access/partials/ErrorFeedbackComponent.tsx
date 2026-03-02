import { Button } from "../../../../../common/external/ui/button.tsx";
import { FlipWords } from "../../../../../common/external/ui/flip-words.tsx";

interface ErrorFeedbackProps {
  words: string[];
  onRetry: () => void;
}

export const ErrorFeedback = ({ words, onRetry }: ErrorFeedbackProps) => {
  return (
    <>
      <div>
        <div>
          Ocorreu um erro.
          <FlipWords words={words} />
        </div>
        <div></div>
      </div>
      <Button onClick={onRetry}>
        Tentar novamente
      </Button>
    </>
  );
};
