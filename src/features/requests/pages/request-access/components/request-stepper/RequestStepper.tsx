import React from "react";
import { Check } from "lucide-react";
import "./request-stepper.scss";

export interface RequestStepItem {
  id: number;
  number: number;
  title: string;
  description: string;
}

interface RequestStepperProps {
  steps: RequestStepItem[];
  currentStep: number;
}

export const RequestStepper: React.FC<RequestStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="request-stepper" aria-label="Etapas da solicitação">
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
              <p className="request-stepper__title">{step.title}</p>
              <p className="request-stepper__description">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
