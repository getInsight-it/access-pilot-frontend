import React, { ReactNode } from 'react';
import { ArrowLeft, Copy, EllipsisVertical } from "lucide-react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@common/external/ui/dropdown-menu.tsx";
import { toast } from "@common/external/ui/use-toast.ts";
import { cn } from "@config/lib/utils.ts";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import "./heading.scss";

interface HeadingProps {
  title: string;
  description?: string;
  badgeValue?: string | number
  badgeClassName?: string;
  customDescription?: ReactNode;
  returnButton?: boolean;
  onReturnClick?: () => void;
  headerStepper?: boolean;
  headerStepperActiveIndex?: number;
  headerStepperItems?: string[];
  code?: string | number | null;
  className?: string;
}

interface HeaderContainerProps {
  children?: ReactNode;
  className?: string;
}

interface HeaderStepperProps {
  activeIndex: number;
  items: string[];
}

const HeaderStepper: React.FC<HeaderStepperProps> = ({ items, activeIndex }) => {
  return (
    <div>
      {(items && items.length) && items.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <div key={index} data-active={isActive}>
            <div></div>
            <span>{item}</span>
          </div>
        );
      })}
    </div>
  );
};

export const HeaderContainer: React.FC<HeaderContainerProps> = ({ children, className }) => {
  return (
    <div className={cn("header-container", className)}>
      {children}
    </div>
  );
};

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  badgeValue,
  badgeClassName,
  customDescription,
  returnButton,
  onReturnClick,
  headerStepper = false,
  headerStepperActiveIndex,
  headerStepperItems,
  code,
  className
}) => {
  const { t } = useI18n();

  return (
    <div className={cn("heading", className)}>
      <div className="heading__main">
        {returnButton && (
          <button
            type="button"
            onClick={onReturnClick}
            className="ui-button ui-button--white heading__back-button"
          >
            <ArrowLeft size={18}></ArrowLeft>
          </button>
        )}
        <div className="heading__content">
          <div className="heading__title-row">
            <h2 className="heading__title">{title}</h2>
            {badgeValue !== undefined && (<div className={cn("heading__badge", badgeClassName)}>{badgeValue}</div>)}
          </div>
          {description && (<p className="heading__description">{description}</p>)}
          {customDescription}
        </div>
        {code !== undefined && code !== null && (
          <div className="heading__code-actions">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <EllipsisVertical size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard?.writeText(code!.toString() || "");
                    toast({ title: t("Copiado"), description: t("Código copiado para a área de transferência.") });
                  }}>
                  <Copy size={16} />
                  <span>{t("Copiar código")}</span>
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
