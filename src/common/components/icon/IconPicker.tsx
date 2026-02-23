import { useEffect, useMemo, useRef, useState } from "react";
import { icons, X } from "lucide-react";
import { Button } from "../../external/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../external/ui/popover.tsx";
import { ShuffleLoader } from "../loading/ShuffleLoader.tsx";
import { iconCategories } from "./constant/iconCategories.ts";
import { cn } from "../../../config/lib/utils.ts";
import { useMediaQuery } from "../../hooks/use-media-query.ts";

type IconName = keyof typeof icons

const INITIAL_ICON_COUNT = 100;

interface IconPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconName | null>((value as IconName) || null);
  const [iconNames, setIconNames] = useState<IconName[]>([]);
  const [visibleIconCount, setVisibleIconCount] = useState(INITIAL_ICON_COUNT);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const iconCategoryMap = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const names = Object.keys(icons) as IconName[];
    setIconNames(names);
    setIsLoading(false);

    const catMap = new Map<string, string>();
    names.forEach((iconName) => {
      const match = iconCategories.find((cat) => cat.id !== "outros" && cat.test(iconName));
      catMap.set(iconName, match?.id ?? "outros");
    });
    iconCategoryMap.current = catMap;
  }, []);

  const filteredIcons = useMemo(() => {
    if (!selectedCategory) return iconNames;
    return iconNames.filter((n) => iconCategoryMap.current.get(n) === selectedCategory);
  }, [iconNames, selectedCategory]);

  const visibleIcons = useMemo(() => {
    let count = visibleIconCount;
    if (selectedIcon) {
      const idx = filteredIcons.indexOf(selectedIcon);
      if (idx >= count) count = idx + 1;
    }
    return filteredIcons.slice(0, count);
  }, [filteredIcons, visibleIconCount, selectedIcon]);

  const handleCategorySelect = (catId: string | null) => {
    setSelectedCategory(catId);
    setVisibleIconCount(INITIAL_ICON_COUNT);
  };

  const handleIconClick = (iconName: IconName) => {
    setSelectedIcon(iconName);
    setIsOpen(false);
    onChange?.(iconName);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIcon(null);
    onChange?.("");
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      setVisibleIconCount((prev) => prev + 50);
    }
  };

  useEffect(() => {
    if (value !== undefined && value !== selectedIcon) {
      setSelectedIcon((value as IconName) || null);
    }
  }, [value]);

  const SelectedIconComponent = selectedIcon ? icons[selectedIcon] : null;

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 min-w-[180px] justify-start">
            {SelectedIconComponent ? (
              <>
                <SelectedIconComponent className="h-5 w-5 shrink-0" />
                <span className="truncate">{selectedIcon}</span>
              </>
            ) : (
              <>
                <span className="h-5 w-5 shrink-0 rounded border border-dashed border-muted-foreground/50" />
                <span className="text-muted-foreground">Selecione um ícone</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side={isLargeScreen ? "right" : "bottom"}
          align={isLargeScreen ? "start" : "end"}
          className={cn(
            "w-[calc(100vw-2rem)] sm:w-[300px] p-0",
            isLargeScreen && "ml-6"
          )}
        >
          <div className="p-4 border-b border-gray-300">
            <h4 className="font-medium leading-none">Escolha um ícone</h4>
          </div>
          <div className="flex gap-1 overflow-x-auto px-4 py-2 border-b border-gray-300 scrollbar-none">
            <Button
              size="sm"
              variant={selectedCategory === null ? "default" : "outline"}
              className="shrink-0 h-7 text-xs"
              onClick={() => handleCategorySelect(null)}
            >
              Todos
            </Button>
            {iconCategories.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className="shrink-0 h-7 text-xs"
                onClick={() => handleCategorySelect(cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-[300px]">
              <ShuffleLoader />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 p-4 max-h-[300px] overflow-y-auto" onScroll={handleScroll}>
              {visibleIcons.map((iconName) => {
                const IconComponent = icons[iconName];
                const isSelected = iconName === selectedIcon;
                return (
                  <Button
                    key={iconName}
                    variant="ghost"
                    className={cn(
                      "p-0",
                      isSelected && "ring-2 ring-primary bg-primary/10"
                    )}
                    onClick={() => handleIconClick(iconName)}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Button>
                );
              })}
            </div>
          )}
        </PopoverContent>
      </Popover>

      {selectedIcon && (
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={handleClear}
          type="button"
          aria-label="Remover ícone"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
