import { cn } from "../../../config/lib/utils.ts";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./step-loader.scss";

const loadingStates = [
  { text: "Carregando" },
  { text: "Conexão estabelecida" },
  { text: "A solicitação foi criada!" },
  { text: "Sucesso" }
];

interface StepLoaderProps {
  onClose?: () => void;
  loading: boolean;
}

const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn(className)}
    >
      <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
};

const CheckFilled = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(className)}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

type LoadingState = {
  text: string;
};

const LoaderCore = ({
  loadingStates,
  value = 0
}: {
  loadingStates: LoadingState[];
  value?: number;
}) => {
  return (
    <div className="step-loader__list">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.2, 0);
        const isCompleted = index < value;
        const isActive = index === value;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -(value * 40) }}
            animate={{ opacity: opacity, y: -(value * 40) }}
            transition={{ duration: 0.5 }}
            className={cn(
              "step-loader__item",
              isCompleted && "step-loader__item--completed",
              isActive && "step-loader__item--active",
              index > value && "step-loader__item--upcoming"
            )}
          >
            <div className="step-loader__icon-wrapper">
              {index > value && (
                <CheckIcon className="step-loader__icon" />
              )}
              {index <= value && (
                <CheckFilled className="step-loader__icon" />
              )}
            </div>
            <span className="step-loader__text">
              {loadingState.text}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = true,
  onClose
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
  onClose: () => void;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if(!loading) {
      setCurrentState(0);
      return;
    }

    if(currentState === loadingStates.length - 1 && !loop) {
      onClose();
      return;
    }

    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1)
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration, onClose]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          className="step-loader__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="step-loader__card">
            <LoaderCore value={currentState} loadingStates={loadingStates} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export function StepLoader({ onClose, loading }: StepLoaderProps) {
  return (
    <div className="step-loader">
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={loading}
        duration={2000}
        loop={false}
        onClose={onClose ?? (() => {})}
      />
    </div>
  );
}
