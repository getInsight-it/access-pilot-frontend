import { CSSProperties, MouseEvent, useMemo, useState } from "react";
import { Check, Palette, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../external/ui/popover.tsx";
import { cn } from "../../../config/lib/utils.ts";
import { useI18n } from "../../context/i18n/I18nContext.tsx";
import { ColorUsage } from "../../types/color-usage.model.ts";
import "./color-picker.scss";

interface ColorPickerProps {
  value?: string | null;
  options: ColorUsage[];
  onChange?: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  triggerLabel?: string;
}

const buildColorStyle = (color?: string | null, variableName: string = "--color-picker-swatch-color"): CSSProperties | undefined => {
  if (!color) {
    return undefined;
  }

  return {
    [variableName]: color
  } as CSSProperties;
};

export function ColorPicker({
  value,
  options,
  onChange,
  disabled = false,
  loading = false,
  triggerLabel
}: ColorPickerProps) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const selectedColor = value || "";
  const resolvedTriggerLabel = triggerLabel || t("Selecionar cor");
  const selectedColorUsage = useMemo(
    () => options.find((option) => option.color === selectedColor) || null,
    [options, selectedColor]
  );

  const handleSelectColor = (color: string) => {
    onChange?.(color);
    setIsOpen(false);
  };

  const handleClearSelection = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onChange?.("");
  };

  return (
    <div className="color-picker">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <span className="color-picker__preview" aria-hidden="true">
          <span
            className={cn(
              "color-picker__preview-swatch",
              !selectedColor && "color-picker__preview-swatch--empty"
            )}
            style={buildColorStyle(selectedColor)}
          />
        </span>

        <PopoverTrigger asChild>
          <button
            id="color-picker-trigger"
            type="button"
            className={cn(
              "color-picker__trigger",
              selectedColor && "color-picker__trigger--selected"
            )}
            disabled={disabled || loading}
          >
            <span className="color-picker__trigger-action">
              {loading ? t("Carregando") : resolvedTriggerLabel}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent className="color-picker__content" align="start" sideOffset={4}>
          {options.length > 0 ? (
            <div className="color-picker__grid" role="listbox" aria-label={t("Cores disponíveis")}>
              {options.map((option) => {
                const isActive = option.color === selectedColor;
                return (
                  <button
                    key={option.color}
                    type="button"
                    className={cn(
                      "color-picker__option",
                      isActive && "color-picker__option--active",
                      option.inUse && "color-picker__option--in-use"
                    )}
                    title={option.color}
                    onClick={() => handleSelectColor(option.color)}
                  >
                    <span
                      className="color-picker__option-swatch"
                      style={buildColorStyle(option.color)}
                    />
                    <span className="color-picker__option-meta">
                      <span className="color-picker__option-code">{option.color}</span>
                      {option.inUse && (
                        <span className="color-picker__option-status">{t("Em uso")}</span>
                      )}
                    </span>
                    {isActive ? (
                      <Check className="color-picker__option-check" />
                    ) : (
                      <Palette className="color-picker__option-check color-picker__option-check--placeholder" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="color-picker__empty">{t("Nenhuma cor disponível para seleção.")}</div>
          )}

          {selectedColorUsage?.inUse && (
            <div className="color-picker__selected-status">{t("A cor selecionada já está em uso.")}</div>
          )}
        </PopoverContent>
      </Popover>

      {selectedColor && (
        <button
          type="button"
          className="color-picker__clear"
          onClick={handleClearSelection}
          aria-label={t("Remover cor selecionada")}
        >
          <X className="color-picker__clear-icon" />
        </button>
      )}
    </div>
  );
}
