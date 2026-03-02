import React, { createContext, ReactNode, useContext, useState, useLayoutEffect, useCallback } from "react";
import { Theme, ThemeType } from "./theme.model.ts";
import { THEME_COLOR_PALETTE, GOV_COLOR_PALETTE } from "./constant/theme-color-palette.constant.ts";
import { LIGHT_THEME } from "./constant/light.constant.ts";
import { BUILT_IN_THEMES } from "./constant/theme.constant.ts";

interface ThemeContextType {
  theme: string;
  themeType: ThemeType;
  changeTheme: (theme: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'selected-theme';
const THEME_TYPE_STORAGE_KEY = 'selected-theme-type';

const applyColorPalette = (palette: any) => {
  const root = document.documentElement;
  const properties: Record<string, string> = {};

  Object.entries(palette).forEach(([colorName, shades]: [string, any]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      properties[`--color-${colorName}-${shade}`] = value as string;
    });
  });

  requestAnimationFrame(() => {
    Object.entries(properties).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
    });
  });
};

const applyTheme = (theme: Theme, themeType: ThemeType) => {
  const colorPalette = themeType === 'gov' ? GOV_COLOR_PALETTE : THEME_COLOR_PALETTE;
  applyColorPalette(colorPalette);

  requestAnimationFrame(() => {
    const root = document.documentElement;

    root.setAttribute('data-theme', themeType);

    const properties: Record<string, string> = {};

    Object.entries(theme.primary).forEach(([key, value]) => {
      properties[`--color-primary-${key}`] = value;
    });

    Object.entries(theme['attributes']).forEach(([key, value]) => {
      properties[`--${key}`] = value;
    });

    Object.entries(properties).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
    });
  });
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  });

  const [themeType, setThemeType] = useState<ThemeType>(() => {
    return (localStorage.getItem(THEME_TYPE_STORAGE_KEY) as 'light' | 'dark') || 'light';
  });

  const [themeCache] = useState<Map<string, Theme>>(new Map());

  const executeApplyTheme = useCallback((themeData: Theme, selectedTheme: string) => {
    applyTheme(themeData, themeData['theme-type']);
    setTheme(selectedTheme);
    setThemeType(themeData['theme-type']);
    localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);
    localStorage.setItem(THEME_TYPE_STORAGE_KEY, themeData['theme-type']);
  }, []);

  const changeTheme = useCallback(async (selectedTheme: string) => {
    try {
      let themeData: Theme;

      if (BUILT_IN_THEMES[selectedTheme]) {
        themeData = BUILT_IN_THEMES[selectedTheme];
      } else if (themeCache.has(selectedTheme)) {
        themeData = themeCache.get(selectedTheme)!;
      } else {
        const response = await fetch(`http://localhost:3001/${selectedTheme}`);
        themeData = await response.json();
        themeCache.set(selectedTheme, themeData);
      }

      executeApplyTheme(themeData, selectedTheme);
    } catch (error) {
      console.error('Error loading theme:', error);
      if (selectedTheme !== 'light') {
        executeApplyTheme(LIGHT_THEME, 'light');
      }
    }
  }, [themeCache, executeApplyTheme]);

  useLayoutEffect(() => {
    const initialTheme = BUILT_IN_THEMES[theme] || LIGHT_THEME;
    applyTheme(initialTheme, initialTheme['theme-type']);

    if (!BUILT_IN_THEMES[theme]) {
      changeTheme(theme);
    }
  }, [changeTheme, theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeType, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
};
