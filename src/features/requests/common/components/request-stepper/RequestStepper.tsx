import React from "react";
import { Check } from "lucide-react";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import { RequestStepItem } from "../../types/access-request.model.ts";
import "./request-stepper.scss";

interface RequestStepperProps {
  steps: RequestStepItem[];
  currentStep: number;
}

export const RequestStepper: React.FC<RequestStepperProps> = ({ steps, currentStep }) => {
  const { t } = useI18n();

  return (
    <div className="request-stepper" aria-label={t("Etapas da solicitação")}>
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div
            key={step.id}
            className={`request-stepper__item${isActive ? " request-stepper__item--active" : ""}${isCompleted ? " request-stepper__item--completed" : ""}`}
          >
            <div className="request-stepper__number">
              {isCompleted ? <Check className="request-stepper__check-icon" /> : step.number}
            </div>
            <div className="request-stepper__text">
              <p className="request-stepper__title">{t(step.title)}</p>
              <p className="request-stepper__description">{t(step.description)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
