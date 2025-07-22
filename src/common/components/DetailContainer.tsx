import React from "react";

export interface DetailContainerProps {
  children: React.ReactNode;
  titleContent?: React.ReactNode;
  background?: "highlight" | "default";
  border?: boolean;
  description?: string;
}

export const DetailContainer: React.FC<DetailContainerProps> = ({
  children,
  titleContent,
  background,
  border,
  description
}: DetailContainerProps) => {
  const getBgClass = () => {
    if(background === "highlight") return "bg-gray-50 dark:bg-gray-800";

    return "bg-white dark:bg-gray-900";
  };

  const borderClass = border ? "border-t border-b border-gray-200 dark:border-gray-700" : "";

  return (
    <div className={`p-6 ${getBgClass()} ${borderClass}`}>
      <div className="flex flex-col xl:flex-row gap-8">
        {titleContent && (
          <div className="w-full xl:w-[300px] xl:min-w-[300px] xl:max-w-[300px] text-gray-900 dark:text-gray-100">
            {titleContent}
            {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
          </div>
        )}

        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
