import { Badge } from "../external/ui/badge.tsx";
import React, { ReactNode } from 'react';
import { Button } from "../external/ui/button.tsx";
import { ArrowLeft } from "lucide-react";

interface HeadingProps {
  title: string;
  description?: string;
  badgeValue?: string | number
  customDescription?: ReactNode;
  returnButton?: boolean;
  onReturnClick?: () => void;
  headerStepper?: boolean;
  headerStepperActiveIndex?: number;
  headerStepperItems?: string[];
}

interface HeaderContainerProps {
  children?: ReactNode;
}

interface HeaderStepperProps {
  activeIndex: number;
  items: string[];
}

const HeaderStepper: React.FC<HeaderStepperProps> = ({ items, activeIndex }) => {
  return (
    <div className="flex flex-row no-wrap items-center w-full mt-4 md:mt-6">
      {(items && items.length) && items.map((item, index) => {
        const color = index <= activeIndex ? "primary" : "gray";
        const active = index === activeIndex;
        return (
          <div className="flex flex-col w-full gap-1 md:gap-2" key={index}>
            <div className={`h-[3px] md:h-[4px] w-full ${color === "primary" ? "bg-primary-500" : "bg-gray-300"}`}></div>
            <span className={`text-xs md:text-sm font-semibold ${active ? "text-primary-500" : "text-gray-400"} truncate`}>{item}</span>
          </div>
        );
      })}
    </div>
  );
};

export const HeaderContainer: React.FC<HeaderContainerProps> = ({ children }) => {
  return (
    <div className="p-3 sm:p-4 md:p-6 flex flex-col gap-3 md:gap-4">
      {children}
    </div>
  );
};

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  badgeValue,
  customDescription,
  returnButton,
  onReturnClick,
  headerStepper = false,
  headerStepperActiveIndex,
  headerStepperItems
}) => {
  return (
    <div className="flex flex-col gap-3 md:gap-4 w-full">
      <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 w-full min-w-0">
        {returnButton && (
          <Button
            variant="outline"
            className="!border-primary-600 min-w-8 min-h-8 w-8 h-8 p-0 flex-shrink-0"
            onClick={onReturnClick}
          >
            <ArrowLeft className="text-primary-700" size={18}></ArrowLeft>
          </Button>
        )}
        <div className="flex flex-col gap-1 w-full min-w-0">
          <div className="flex flex-row items-center gap-2 md:gap-3 flex-wrap">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-text-default break-words">{title}</h2>
            {badgeValue !== undefined && (<Badge variant="outline" className="h-[24px] md:h-[28px] flex items-center justify-center flex-shrink-0">{badgeValue}</Badge>)}
          </div>
          {description && (<p className="text-xs sm:text-sm text-muted-foreground break-words">{description}</p>)}
          {customDescription}
        </div>
      </div>
      {headerStepper && headerStepperActiveIndex !== undefined && (headerStepperItems && headerStepperItems.length) && (
        <HeaderStepper
          activeIndex={headerStepperActiveIndex}
          items={headerStepperItems}
        />
      )}
    </div>
  );
};
