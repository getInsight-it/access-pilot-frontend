import { Check } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

export const CheckPill = ({
  children,
  selected,
  setSelected,
  index,
  currentIndex,
}: {
  children: string;
  selected: boolean;
  setSelected: Dispatch<SetStateAction<number>>;
  index: number;
  currentIndex: number;
}) => {
  const isPrevious = index < currentIndex;
  const isCurrent = index === currentIndex;
  const isNext = index > currentIndex;

  const getButtonStyle = () => {
    if (isPrevious) return "bg-green-200 text-green-800"; // Cor para botões anteriores
    if (isCurrent) return "bg-blue-200 text-blue-800"; // Cor para o botão atual
    if (isNext) return "bg-gray-200 text-gray-800"; // Cor para botões futuros
  };

  return (
    <div className="rounded-full bg-indigo-600">
      <button
        onClick={() => setSelected(index)}
        disabled={true}
        className={`
          flex origin-top-left items-center gap-1 rounded-full px-1.5 py-0.5 text-sm transition-all ${getButtonStyle()}
          ${selected ? "-rotate-3 border-indigo-600 text-indigo-600" : "border-zinc-900 dark:text-black"}`}
      >
        {/* Exibe o ícone apenas nos botões anteriores ou no atual */}
        {/* {(isPrevious || isCurrent) && <Check />} {children} */}
        <Check /> {children}
      </button>
    </div>
  );
};

