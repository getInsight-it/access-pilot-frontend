import React, { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@common/external/ui/button.tsx";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import "./request-step-layout.scss";

interface RequestStepLayoutProps {
  title: string;
  children: ReactNode;
  onBack: () => void;
  onNext: () => void;
  backButtonDisabled?: boolean;
  nextButtonDisabled?: boolean;
  nextButtonLabel: string;
  showNextIcon?: boolean;
}

export const RequestStepLayout: React.FC<RequestStepLayoutProps> = ({
  title,
  children,
  onBack,
  onNext,
  backButtonDisabled = false,
  nextButtonDisabled = false,
  nextButtonLabel,
  showNextIcon = false
}) => {
  const { t } = useI18n();

  return (
    <div className="request-step-layout">
      <header className="request-step-layout__header">
        <h3 className="request-step-layout__title">{t(title)}</h3>
      </header>

      <div className="request-step-layout__content">
        {children}
      </div>

      <footer className="request-step-layout__footer">
        <Button
          type="button"
          variant="white"
          className="request-step-layout__action-button request-step-layout__action-button--white"
          onClick={onBack}
          disabled={backButtonDisabled}
        >
          {t("Voltar")}
        </Button>

        <Button
          type="button"
          className="request-step-layout__action-button request-step-layout__action-button--primary"
          onClick={onNext}
          disabled={nextButtonDisabled}
        >
          <span className="request-step-layout__action-content">
            <span>{t(nextButtonLabel)}</span>
            {showNextIcon && <ArrowRight className="request-step-layout__action-icon" />}
          </span>
        </Button>
      </footer>
    </div>
  );
};
