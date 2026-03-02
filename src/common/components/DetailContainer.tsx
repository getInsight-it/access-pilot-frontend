import React from "react";

export interface DetailContainerProps {
  children: React.ReactNode;
  titleContent?: React.ReactNode;
  background?: "highlight" | "default";
  border?: boolean;
  description?: string;
  grow?: boolean;
}

export const DetailContainer: React.FC<DetailContainerProps> = ({
  children,
  titleContent,
  background,
  border,
  description,
  grow = false
}: DetailContainerProps) => {
  const getBgClass = () => {
    if(background === "highlight") return "bg-zebra-background-1";

    return "bg-zebra-background-2";
  };

  const borderClass = border ? "" : "";

  return (
    <div className={`${getBgClass()} ${borderClass}`}>
      <div>
        {titleContent && (
          <div>
            {titleContent}
            {description && <p>{description}</p>}
          </div>
        )}

        <div>
          {children}
        </div>
      </div>
    </div>
  );
};
