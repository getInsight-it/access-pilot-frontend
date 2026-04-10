import { CSSProperties, type MouseEvent, useEffect, useMemo, useState } from "react";
import { icons, Search, Settings, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../external/ui/popover.tsx";
import { iconCategories } from "./constant/iconCategories.ts";
import { cn } from "../../../config/lib/utils.ts";
import { useI18n } from "../../context/i18n/I18nContext.tsx";
import "./IconPicker.scss";

type IconName = keyof typeof icons;

const ICON_BATCH_SIZE = 96;

interface IconPickerProps {
  value?: string;
  color?: string | null;
  onChange?: (value: string) => void;
  disabled?: boolean;
  triggerLabel?: string;
}

export function IconPicker({
  value,
  color,
  onChange,
  disabled = false,
  triggerLabel
}: IconPickerProps) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visibleIconCount, setVisibleIconCount] = useState(ICON_BATCH_SIZE);
  const [selectedIcon, setSelectedIcon] = useState<IconName | null>((value as IconName) || null);

  const allIconNames = useMemo(() => Object.keys(icons) as IconName[], []);

  useEffect(() => {
    if (value !== undefined && value !== selectedIcon) {
      setSelectedIcon((value as IconName) || null);
    }
  }, [selectedIcon, value]);

  useEffect(() => {
    setVisibleIconCount(ICON_BATCH_SIZE);
  }, [searchTerm, selectedCategory]);

  const filteredIconNames = useMemo(() => {
    return allIconNames.filter((iconName) => {
      const matchesCategory =
        selectedCategory === "all" ||
        iconCategories.find((category) => category.id === selectedCategory)?.test(iconName);
      const matchesSearch = iconName.toLowerCase().includes(searchTerm.trim().toLowerCase());
      return Boolean(matchesCategory) && matchesSearch;
    });
  }, [allIconNames, searchTerm, selectedCategory]);

  const visibleIcons = useMemo(
    () => filteredIconNames.slice(0, visibleIconCount),
    [filteredIconNames, visibleIconCount]
  );

  const resolvedTriggerLabel = triggerLabel || t("Selecionar ícone");
  const SelectedIconComponent = selectedIcon ? icons[selectedIcon] : null;
  const TriggerIconComponent = SelectedIconComponent ?? Settings;
  const previewStyle = useMemo(() => {
    if (!color) {
      return undefined;
    }

    return {
      "--icon-picker-preview-color": color
    } as CSSProperties;
  }, [color]);

  const handleSelectIcon = (iconName: IconName) => {
    setSelectedIcon(iconName);
    onChange?.(iconName);
    setIsOpen(false);
  };

  const handleClearSelection = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSelectedIcon(null);
    onChange?.("");
  };

  return (
    <div className="icon-picker">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <span className="icon-picker__preview" aria-hidden="true" style={previewStyle}>
          <TriggerIconComponent className="icon-picker__preview-icon" />
        </span>

        <PopoverTrigger asChild>
          <button
            id="icon-picker-trigger"
            type="button"
            className={cn(
              "icon-picker__trigger",
              selectedIcon && "icon-picker__trigger--selected"
            )}
            disabled={disabled}
          >
            <span className="icon-picker__trigger-action">{resolvedTriggerLabel}</span>
          </button>
        </PopoverTrigger>

        <PopoverContent className="icon-picker__content" align="start" sideOffset={4}>
          <div className="icon-picker__section icon-picker__section--search">
            <div className="icon-picker__search app-input-group app-input-group--icon-left">
              <Search className="app-input-group__icon" />
              <input
                type="text"
                className="app-input icon-picker__search-input"
                value={searchTerm}
                placeholder={t("Pesquisar por nome do ícone")}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="icon-picker__section icon-picker__section--categories">
            <div className="icon-picker__categories">
              <button
                type="button"
                className={cn(
                  "icon-picker__category",
                  selectedCategory === "all" && "icon-picker__category--active"
                )}
                onClick={() => setSelectedCategory("all")}
              >
                {t("Todos")}
              </button>

              {iconCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={cn(
                    "icon-picker__category",
                    selectedCategory === category.id && "icon-picker__category--active"
                  )}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {t(category.label)}
                </button>
              ))}
            </div>
          </div>

          {filteredIconNames.length ? (
            <div className="icon-picker__section icon-picker__section--results">
              <div className="icon-picker__grid" role="listbox" aria-label={t("Ícones disponíveis")}>
                {visibleIcons.map((iconName) => {
                  const IconComponent = icons[iconName];
                  const isActive = iconName === selectedIcon;

                  return (
                    <button
                      key={iconName}
                      type="button"
                      className={cn("icon-picker__option", isActive && "icon-picker__option--active")}
                      title={iconName}
                      onClick={() => handleSelectIcon(iconName)}
                    >
                      <span className="icon-picker__option-icon">
                        <IconComponent className="icon-picker__option-icon-svg" />
                      </span>
                    </button>
                  );
                })}
              </div>

              {visibleIconCount < filteredIconNames.length && (
                <button
                  type="button"
                  className="icon-picker__load-more"
                  onClick={() => setVisibleIconCount((previous) => previous + ICON_BATCH_SIZE)}
                >
                  {t("Mostrar mais ícones")}
                </button>
              )}
            </div>
          ) : (
            <div className="icon-picker__section icon-picker__section--results">
              <div className="icon-picker__empty">{t("Nenhum ícone encontrado para os filtros selecionados.")}</div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {selectedIcon && (
        <button
          type="button"
          className="icon-picker__clear"
          onClick={handleClearSelection}
          aria-label={t("Remover ícone selecionado")}
        >
          <X className="icon-picker__clear-icon" />
        </button>
      )}
    </div>
  );
}
