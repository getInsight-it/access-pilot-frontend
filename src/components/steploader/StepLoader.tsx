import React from "react";
import { MultiStepLoader as Loader } from "../ui/multi-step-loader";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const loadingStates = [
  { text: "Carregando" },
  { text: "Conexão estabelecida" },
  { text: "A solicitação foi criada!" },
  { text: "Sucesso" },
];

interface StepLoaderProps {
  onClose?: () => void;
  loading: boolean; // Recebe o estado de loading como uma prop
}

export function StepLoader({ onClose, loading }: StepLoaderProps) {
  return (
    <div className="flex items-center justify-center">
      <Loader
        loadingStates={loadingStates}
        loading={loading}
        duration={2000}
        loop={false}
        onClose={onClose ?? (() => {})}
      />
      {/* {loading && (
        <button
          className="fixed top-4 right-4 text-primary z-[120]"
          onClick={() => onClose && onClose()}
        >
          <X className="h-10 w-10" />
        </button>
      )} */}
    </div>
  );
}
