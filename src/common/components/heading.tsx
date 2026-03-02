import { Badge } from "../external/ui/badge.tsx";
import React, { ReactNode } from 'react';
import { Button } from "../external/ui/button.tsx";
import { ArrowLeft, Copy, EllipsisVertical } from "lucide-react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@common/external/ui/dropdown-menu.tsx";
import { toast } from "@common/external/ui/use-toast.ts";

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
  code?: string | number | null;
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
    <div>
      {(items && items.length) && items.map((item, index) => {
        const color = index <= activeIndex ? "primary" : "gray";
        const active = index === activeIndex;
        return (
          <div key={index}>
            <div></div>
            <span>{item}</span>
          </div>
        );
      })}
    </div>
  );
};

export const HeaderContainer: React.FC<HeaderContainerProps> = ({ children }) => {
  return (
    <div>
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
  headerStepperItems,
  code
}) => {
  return (
    <div>
      <div>
        {returnButton && (
          <Button
            variant="outline"
            onClick={onReturnClick}
          >
            <ArrowLeft size={18}></ArrowLeft>
          </Button>
        )}
        <div>
          <div>
            <h2>{title}</h2>
            {badgeValue !== undefined && (<Badge variant="outline">{badgeValue}</Badge>)}
          </div>
          {description && (<p>{description}</p>)}
          {customDescription}
        </div>
        {code !== undefined && code !== null && (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <EllipsisVertical size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => { navigator.clipboard?.writeText(code!.toString() || ''); toast({ title: "Copiado", description: "Código copiado para a área de transferência." }); }}>
                  <Copy size={16} />
                  <span>Copiar código</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
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
