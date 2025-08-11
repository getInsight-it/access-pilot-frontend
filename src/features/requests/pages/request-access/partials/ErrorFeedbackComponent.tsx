import { Button } from "../../../../../common/external/ui/button.tsx";
import { FlipWords } from "../../../../../common/external/ui/flip-words.tsx";

interface ErrorFeedbackProps {
  words: string[];
  onRetry: () => void;
}

export const ErrorFeedback = ({ words, onRetry }: ErrorFeedbackProps) => {
  return (
    <>
      <div className="lg:max-w-xl bg-red-900 flex flex-col">
        <div className="text-2xl font-normal text-primary-foreground px-6 py-6">
          Ocorreu um erro.
          <FlipWords words={words} />
        </div>
        <div className="lg:max-w-xl bg-red-500 p-1"></div>
      </div>
      <Button className="my-2 w-40" onClick={onRetry}>
        Tentar novamente
      </Button>
    </>
  );
};
