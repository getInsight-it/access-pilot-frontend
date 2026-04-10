import React from "react";
import { Check } from "lucide-react";
import { cn } from "@config/lib/utils.ts";
import "./Toggle.scss";

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  id,
  className,
  "aria-label": ariaLabel
}) => {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn("ui-toggle", checked && "ui-toggle--checked", className)}
    >
      <span className="ui-toggle__thumb">
        <Check className="ui-toggle__icon" />
      </span>
    </button>
  );
};
