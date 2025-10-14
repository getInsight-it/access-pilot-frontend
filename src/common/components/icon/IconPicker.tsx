import React, { useEffect, useMemo, useState } from "react";
import { icons } from "lucide-react";
import { Button } from "../../external/ui/button.tsx";
import { Input } from "../../external/ui/input.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../external/ui/popover.tsx";
import { ShuffleLoader } from "../loading/ShuffleLoader.tsx";
import { iconTranslations } from "./constant/iconTranslations.ts";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<IconName | null>((value as IconName) || null);
  const [iconNames, setIconNames] = useState<IconName[]>([]);
  const [visibleIconCount, setVisibleIconCount] = useState(INITIAL_ICON_COUNT);
  const [isLoading, setIsLoading] = useState(true);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    const names = Object.keys(icons) as IconName[];
    setIconNames(names);
    setIsLoading(false);
  }, []);

  const filteredIcons = useMemo(() => {
    const lowercaseSearchTerm = searchTerm.toLowerCase().trim();
    return iconNames.filter((iconName) => {
      const lowercaseIconName = iconName.toLowerCase();

      if(lowercaseIconName.includes(lowercaseSearchTerm)) {
        return true;
      }

      return Object.entries(iconTranslations).some(([ptTerm, enTerms]) => {
        if(ptTerm.toLowerCase().includes(lowercaseSearchTerm)) {
          return enTerms.some((enTerm) => lowercaseIconName.includes(enTerm.toLowerCase()));
        }
        return false;
      });
    });
  }, [iconNames, searchTerm]);

  const visibleIcons = useMemo(() => filteredIcons.slice(0, visibleIconCount), [filteredIcons, visibleIconCount]);

  const handleIconClick = (iconName: IconName) => {
    setSelectedIcon(iconName);
    setIsOpen(false);
    if (onChange) {
      onChange(iconName);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if(scrollHeight - scrollTop <= clientHeight * 1.5) {
      setVisibleIconCount((prevCount) => prevCount + 50);
    }
  };

  useEffect(() => {
    setVisibleIconCount(INITIAL_ICON_COUNT);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  }, [searchTerm]);

  useEffect(() => {
    if (value && value !== selectedIcon) {
      setSelectedIcon(value as IconName);
    }
  }, [value]);

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button>Selecione um ícone</Button>
        </PopoverTrigger>
        <PopoverContent
          side={isLargeScreen ? "right" : "bottom"}
          align={isLargeScreen ? "start" : "end"}
          className={cn(
            "w-[calc(100vw-2rem)] sm:w-[300px] p-0",
            isLargeScreen && "ml-6"
          )}
        >
          <div className="p-4 pb-4  border-b border-gray-300">
            <div className="space-y-2">
              <h4 className="font-medium leading-none pb-2">Escolha um ícone</h4>
              <Input
                type="text"
                placeholder="Pesquisar ícone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-[300px]">
              <ShuffleLoader />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 p-4 max-h-[300px] overflow-y-auto" onScroll={handleScroll}>
              {visibleIcons.map((iconName) => {
                const IconComponent = icons[iconName];
                return (
                  <Button key={iconName} variant="ghost" className="p-0" onClick={() => handleIconClick(iconName)}>
                    <IconComponent className="h-5 w-5" />
                  </Button>
                );
              })}
            </div>
          )}
        </PopoverContent>
      </Popover>
      {selectedIcon && (
        <>
          <p className="mt-4">Ícone selecionado:</p>
          <div
            className="text-center mt-2 py-4 rounded-[var(--card-border-radius)] border border-primary w-auto max-w-60 grid items-center justify-center">
            {React.createElement(icons[selectedIcon], { className: "h-5 w-5 mx-auto" })}
            <p className="mt-1">{selectedIcon}</p>
          </div>
        </>
      )}
    </div>
  );
}


